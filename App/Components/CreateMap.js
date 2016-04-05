/*
  Create a map
*/
'use strict';
import React, {
  Text,
  View,
  Component,
  Image,
  Animated,
  DeviceEventEmitter,
  InteractionManager,
} from 'react-native';

//Libraries
import { MKSpinner } from 'react-native-material-kit';
import ReactNativeHeading from 'react-native-heading';
import RNFS from 'react-native-fs';
import MapView from 'react-native-maps';
const mSensorManager = require('NativeModules').SensorManager;
const wifiManager = require('NativeModules').WifiManagerModule;
const DialogAndroid = require('react-native-dialogs');

const mapsPath = RNFS.DocumentDirectoryPath + '/heatmaps/';

//Components
import Styles from './Styles';
import ActionButton from './ActionButton';
import MapList from './MapList';

//Router
class MapListTitle extends Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={Styles.mapListTitle}> Maplist </Text>
      </View>
    );
  }
}

let spinner = (<MKSpinner style={Styles.spinner} strokeWidth={6}/>);

let CreateMap = React.createClass({
  getInitialState() {
    return {
      //Initial region to focus on (Africa!)
      region: this.props.initialRegion,
      waiting: true,
      handData: -10,
      currSample: 1,
      steps: 0,
      markers: [],
      heading: "unknown",
      position: "unknown",
    };
  },

  componentDidMount() {
    //Forgive me for my sins
    this.mounted = true;
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      let initialPosition = new Promise(
        function(resolve, reject) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (self.mounted) {resolve(position)}
              else {reject("Not mounted!")}
            },
            (error) => {
              console.log("error with promise!");
              reject(error);
            },
            {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000}
          );
        }
      );
      initialPosition.then((location) => {
        if (this.mounted) {
          let newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          }
        //Push an initial marker and render it
        setTimeout(() => {
          this.setState({waiting: false, position: location});
          this.refs.map.animateToRegion(newRegion, 2000);
        }, 100);
        //Timeout to wait before the animation has completed, otherwise it is skipped :/
        setTimeout(() => {
          if (this.mounted) {
            this.setState({region: newRegion});
            wifiManager.getRssi().then((intensity) => {
              this.setState({
                markers: [{
                  latlng: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  },
                  intensity: intensity,
                  id: 1,
                }],
                touchable: true
              });
            });
          }
        }, 2100);
      }
    })});
  },

  componentWillUnmount() {
      //Forgive me for my sins
      this.mounted = false;
      clearTimeout();
  },

  onStartPress() {
    mSensorManager.startAccelerometer(200); // 200ms delay
    ReactNativeHeading.start(1);
    // Step algorithm is explained here: http://www.enggjournals.com/ijcse/doc/IJCSE12-04-05-266.pdf
    DeviceEventEmitter.addListener('Accelerometer', (data) => this.motionListener(data));
    DeviceEventEmitter.addListener('headingUpdated', (data) => this.headingListener(data));
  },

  onStopPress() {
    DeviceEventEmitter.removeAllListeners('Accelerometer');
    mSensorManager.stopAccelerometer();

    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners('headingUpdated');

    //The saving part
    let self = this;
    //TODO: this self thing is not nice, fix it
    let saveMap = (input) => {
      let path = mapsPath + input + '.JSON';
      let finalMarkers = self.state.markers.map(marker => {
        return {
          latitude: marker.latlng.latitude,
          longitude: marker.latlng.longitude,
          intensity: marker.intensity,
        };
      });
      let contents = JSON.stringify({markers: finalMarkers, region: this.state.region});
      RNFS.writeFile(path, contents).then((success) => {
          console.log('FILE WRITTEN!');
        }).catch((err) => {
          console.log(err.message);
      });
      this.props.resetToRoute({
        name: 'Maplist',
        titleComponent: MapListTitle,
        component: MapList,
      });
    }

    let saveOptions = {
      title: 'Save your map!',
      input: {
        hint: "Map name",
        allowEmptyInput: false,
        callback: (input) => saveMap(input)
      },
      positiveText: 'OK',
      negativeText: 'Cancel'
    };

    let showDialog = function () {
      let dialog = new DialogAndroid();
      dialog.set(saveOptions);
      dialog.show();
    }

    this.state.markers.length === 1 ? alert('No steps were taken!') : showDialog()
  },

  motionListener(data) {
    this.setState({currSample: this.state.currSample+1});
    if (data.z - this.state.handData.z > 0.4) {
      this.setState({maxData: data, maxSample: this.state.currSample});
      DeviceEventEmitter.removeAllListeners('Accelerometer');
      //Now we watch for steps!
      DeviceEventEmitter.addListener('Accelerometer', (data) => this.stepListener(data));
    }
    this.setState({handData: data});
  },

  stepListener(data) {
    let {currSample, maxSample, maxData} = this.state;
    let max = maxData, b = (Math.PI-1), a = 9
    ;
    //Step counter threshold depends on constants a and b, need finetuning!
    let threshold =  a/(currSample - maxSample) + b;
    //onStep
    if (max.z - data.z >= threshold) {
      let stepDistance = 0.00058; //in KM
      let newPosition = this.calculateCoordinates(stepDistance);
      wifiManager.getRssi().then((intensity) => {
        let newMarkers = this.state.markers.concat({
          latlng: {
            latitude: newPosition.coords.latitude,
            longitude: newPosition.coords.longitude,
          },
          intensity: intensity,
        });
        this.setState({markers: newMarkers});
      });
      this.setState({steps: this.state.steps+1, maxData: data, maxSample: currSample, position: newPosition});
    }
    else if (data.z > max.z) {
      this.setState({maxData: data});
    }
    this.setState({currSample: currSample+1});
  },

  toRad(input) {
    return input * Math.PI / 180;
  },

  toDeg(input) {
    return input * 180 / Math.PI;
  },

  calculateCoordinates(stepDistance) {
    let {heading, position} = this.state;
    let latitude = position.coords.latitude; //Lat
    let longitude = position.coords.longitude; //Long

    let distance = stepDistance / 6371;
    let angle = this.toRad(heading), ogLat = this.toRad(latitude), ogLong = this.toRad(longitude);

    let newLat = Math.asin( Math.sin(ogLat)*Math.cos(distance) + Math.cos(ogLat)*Math.sin(distance)*Math.cos(angle));
    let newLong = ogLong + Math.atan2(Math.sin(angle)*Math.sin(distance)*Math.cos(ogLat),Math.cos(distance)-Math.sin(ogLat)*Math.sin(newLat));

    newLat = this.toDeg(newLat), newLong = this.toDeg(newLong);

    return {
      coords: {
        latitude: newLat,
        longitude: newLong,
      },
    };
  },

  headingListener(data) {
    this.setState({heading: data.heading});
  },

  render() {
    let {markers, waiting} = this.state;
    return (
      <View style={Styles.container}>

        <MapView
          ref="map"
          style={Styles.map}
          showsCompass={true}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {
            waiting ?
            <View></View> :
            <MapView.Polyline
              coordinates={markers.map((marker) => {return marker.latlng})}
              strokeWidth={2}
            />
          }
        </MapView>

        <View style={Styles.spinnerOverlay}>
          {(waiting) ? spinner : <View></View>}
        </View>

        <View style={Styles.buttonOverlay}>
          <ActionButton
            buttonStyle={Styles.startFab}
            onStartPress={this.onStartPress}
            onStopPress={this.onStopPress}
            touchable={this.state.touchable}
            transformVisual={true}
            transformAction={true}
            imageName="play"
            imageSize={30}
          />
        </View>

      </View>
    );
  }
});

export default CreateMap
