/*
A cleaned up version of WifiHeatmap
*/

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  StatusBar,
  DrawerLayoutAndroid,
} from 'react-native';

//Libraries
import Router from 'react-native-simple-router';
import Icon from 'react-native-vector-icons/Ionicons';
const DialogAndroid = require('react-native-dialogs');

//Components here
import Styles from './App/Components/Styles';
import MapList from './App/Components/MapList';
import CreateMap from './App/Components/CreateMap';

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

const firstRoute = {
  name: 'Maplist',
  titleComponent: MapListTitle,
  component: MapList,
};

class WifiHeatmap extends Component {
  render() {
    let showInformation = () => {
      let informationOptions = {
        title: 'How it works',
        content: "Press the plus button to add a new map. When the app has pinpointed your location," +
        " press the play button to start the tracker. Now, simply walk around, making sure that you do not" +
        " keep your device perfectly still, but shake it a bit at every step. This is to ensure the device" +
        " picks up your steps. When you are done, press the stop button to stop tracking. You will be transported" +
        " back to the list of maps, where you should see your newly created map. Just click it to view it!\n" +
        "NOTE: Please calibrate your compass first by going into Google Maps and tilting your device back and forth.\n" +
        "(See the FAQ on the play store app page for more information)",
        positiveText: 'Got it!',
      };
      let showInfoDialog = function () {
        let dialog = new DialogAndroid();
        dialog.set(informationOptions);
        dialog.show();
      }
      showInfoDialog();
    }

    let backButton = () => {
      return (
        <View>
          <Icon style={Styles.backButton} name="arrow-left-c" size={35} color="#ecf0f1"/>
        </View>
      );
    }

    let rightCorner = () => {
      return (
        <View>
          <Icon onPress={showInformation} style={Styles.rightCorner} name="information-circled" size={25} color="#ecf0f1"/>
        </View>
      );
    }

    return (
      <View style={Styles.container}>
          <Router
            firstRoute={firstRoute}
            handleBackAndroid={true}
            headerStyle={Styles.navBar}
            backButtonComponent={backButton}
            rightCorner={rightCorner}
            titleStyle={Styles.title}
            statusBarProps={{backgroundColor: "#c0392b"}}
          />
      </View>
    );
  }
}

AppRegistry.registerComponent('WifiHeatmap', () => WifiHeatmap);
