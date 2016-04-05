/*
  When a map in maplist is clicked :D
*/
'use strict';
import React, {
  Text,
  View,
  Component,
  PropTypes,
  TouchableHighlight,
  Animated,
  InteractionManager,
} from 'react-native';

//Libraries
import RNFS from 'react-native-fs';
import MapView from 'react-native-maps';
import {MKSlider, MKButton, MKSpinner} from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/Ionicons';

//Components
import Styles from './Styles';
import ActionButton from './ActionButton';

const mapsPath = RNFS.DocumentDirectoryPath + '/heatmaps/';

class MapCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: this.props.file.region,
      waiting: true,
      options: false,
      wrapperHeight: new Animated.Value(0.1),
      radius: 28,
      opacity: 1,
    };
    this.showSettings = this.showSettings.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      let waiting = (this.props.file && this.props.file.region) ? false : true
      this.setState({waiting: waiting});
    });

    if (this.props.file === "unknown") {
      alert("Error: no file was found with that name :(");
    }
    if (this.props.file.region === undefined) {
      alert("Error: no region was found :(")
    }
  }

   onRegionChange(region) {
     this.setState({region: region});
   }

   showSettings() {
     let newValue = (this.state.options) ? 0.1 : 115
     Animated.timing(
       this.state.wrapperHeight,
       {toValue: newValue},
     ).start();
     this.setState({options: !this.state.options});
   }

   updateRadius(newRadius) {
     newRadius = Math.round(newRadius);
     this.setState({radius: newRadius});
   }

   updateOpacity(newOpacity) {
     this.setState({opacity: newOpacity});
   }
  render() {
    let {waiting, options, buttonOverlayStyle} = this.state;
    return (
      <View style={Styles.container}>
        <MapView
          region={this.state.region}
          onRegionChange={(region) => this.onRegionChange(region)}
          style={Styles.map}
          showsCompass={true}>
          {
            waiting ?
              (<View></View>) :
              (<MapView.Heatmap
                coordinates={this.props.file.markers}
                isVisible={true}
                zIndex={100}
                radius={this.state.radius}
                opacity={this.state.opacity}
              />)
          }
        </MapView>
        <View style={Styles.buttonOverlay} pointerEvents="box-none">
          <View style={Styles.buttonContainer} pointerEvents="box-none">
            <MKButton
              style={Styles.settingsButton}
              cornerRadius={21}
              onPress={this.showSettings}>
                <Icon name="gear-b" size={35} color="#ecf0f1" />
            </MKButton>
          </View>
      </View>
      <View style={Styles.settingsOverlay} pointerEvents="box-none">
        <Animated.View style={{height: this.state.wrapperHeight, backgroundColor: '#f2f4f5'}} pointerEvents="box-none">
            <View style={{overflow: "hidden"}} pointerEvents="box-none">
              <MKSlider
                style={Styles.radiusSlider}
                onChange={(radius) => {this.updateRadius(radius)}}
                min={12}
                max={50}
                lowerTrackColor="#1abc9c"
              />
              <Text style={Styles.radiusText}> Radius </Text>
              <MKSlider
                style={Styles.opacitySlider}
                onChange={(opacity) => {this.updateOpacity(opacity)}}
                min={0}
                max={1}
                lowerTrackColor="#1abc9c"
              />
              <Text style={Styles.opacityText}> Opacity </Text>
            </View>
        </Animated.View>
      </View>
      </View>
    );
  }
}

export default MapCard
