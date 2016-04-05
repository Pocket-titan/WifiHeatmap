/*
  List of saved heatmaps
*/
'use strict';
import React, {
  Text,
  View,
  Component,
  PropTypes,
  Navigator,
  ScrollView,
  InteractionManager,
} from 'react-native';

//Libraries
import RNFS from 'react-native-fs';

//Components
import Styles from './Styles';
import CreateMap from './CreateMap';
import ActionButton from './ActionButton';
import Card from './Card';

const mapsPath = RNFS.DocumentDirectoryPath + '/heatmaps';

const propTypes = {
  toRoute: PropTypes.func.isRequired,
};

class NewMapTitle extends React.Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={Styles.newMapTitle}> Create a new map! </Text>
      </View>
    );
  }
}

class MapList extends Component {
  constructor(props) {
      super(props);
      this.state = { maps: null };
      this.nextPage = this.nextPage.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //If the heatmaps directory is not there, create it
      RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
        let dir = (result.map(e => {return e.name}));
        let heatmapsExists = dir.find(e => {
          if (e === "heatmaps") {return true}
        });
        if (heatmapsExists) {this.checkMaps()}
        if (heatmapsExists === undefined) {
          console.log("Heatmaps folder was not found. Creating it!");
          RNFS.mkdir(mapsPath).then(res => {
             this.checkMaps();
          });
        }
      }).catch((err) => {
        console.log(err.message, err.code);
      });
    });
  }

  checkMaps() {
    RNFS.readDir(mapsPath).then((result) => {
        this.setState({maps: result.map(res => {
          res.key = result.indexOf(res);
          return res;
        })});
    }).catch((err) => {
       console.log(err.message, err.code);
    });
  }

  nextPage() {
    this.props.toRoute({
      name: "Create a map!",
      component: CreateMap,
      titleComponent: NewMapTitle,
      sceneConfig: Navigator.SceneConfigs.FadeAndroid,
      passProps: {
        initialRegion: {
          latitude: 5.6087229,
          longitude: 21.8827494,
          latitudeDelta: 100,
          longitudeDelta: 100,
        },
      },
    });
  }

  render() {
    let {maps} = this.state;
    let checkMaps = () => {this.checkMaps()}
    return (
        <View style={Styles.container}>
          <ScrollView style={{backgroundColor: 'transparent', elevation: 0, marginTop: 7}}>
            {
              (maps !== null ?
                (maps.length > 0
                ?
                  maps.map(map => {
                    return (
                      <Card
                        key={map.key}
                        name={map.name}
                        checkMaps={checkMaps}
                        route={this.props.toRoute}
                      />
                    );
                  }) : <Text style={Styles.noMapText}> No maps yet! </Text>)
                : null)
            }
          </ScrollView>
          <View style={Styles.buttonOverlay} pointerEvents="box-none">
            <ActionButton
              buttonStyle={Styles.newMapButton}
              onStartPress={this.nextPage}
              transformAction={false}
              transformVisual={false}
              touchable={true}
              imageName="plus"
              imageSize={30}
            />
        </View>
        </View>
    );
  }
}

MapList.propTypes = propTypes;
export default MapList
