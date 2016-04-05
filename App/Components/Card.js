/*
  Card for saved maps
*/
'use strict';
import React, {
  Text,
  View,
  Component,
  PropTypes,
  TouchableHighlight,
  Navigator
} from 'react-native';

//Components
import Styles from './Styles';
import MapCard from './MapCard';

//Libraries
import RNFS from 'react-native-fs';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons';
import DialogAndroid from 'react-native-dialogs';

const mapsPath = RNFS.DocumentDirectoryPath + '/heatmaps/';

class MapCardTitle extends React.Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={Styles.newMapTitle}> {this.props.name} </Text>
      </View>
    );
  }
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardStyle: Styles.card,
      file: "unknown",
    };
  }

  componentDidMount() {
    RNFS.readFile(mapsPath + this.props.name).then(result => {
      try {
        let parsedResult = JSON.parse(result);
        this.setState({file: parsedResult});
      }
      catch(e) {
        console.log("Error parsing heatmap :'(");
      }
    });
  }

  render() {
    let onCardClick = () => {
      this.props.route({
        name: "Your very own map",
        component: MapCard,
        titleComponent: MapCardTitle,
        sceneConfig: Navigator.SceneConfigs.FadeAndroid,
        passProps: {
          name: this.props.name,
          file: this.state.file,
        },
      });
    }

    let onPressIn = () => {
      this.setState({cardStyle: [Styles.card, {elevation: 2}]});
    }

    let onPressOut = () => {
      this.setState({cardStyle: Styles.card});
    }

    let deleteMap = () => {
      let secondChanceOptions = {
        title: 'Are you sure?',
        content: 'Delete file ' + this.props.name.replace(/\.[^.]*$/g, '') + " ?",
        positiveText: 'OK',
        negativeText: 'Cancel',
        onPositive: () => {
          RNFS.unlink(mapsPath + this.props.name).spread((success, path) => {
            console.log("FILE DELETED", success, path);
          }).catch(error => {
            console.log(error.message);
          });
          this.props.checkMaps();
        }
      };
      let dialog = new DialogAndroid();
      dialog.set(secondChanceOptions);
      dialog.show();
    }

    let deleteComponent = (
      <View style={Styles.deleteWrapper}>
          <Icon name="trash-b" size={30} color="#fff" style={Styles.deleteIcon}/>
      </View>
    );
    //delete map button
    let deleteButton = [
      {
        component: deleteComponent,
        backgroundColor: "rgb(231, 76, 60)",
        underlayColor: "rgb(193, 57, 43)",
        onPress: deleteMap,
      }
    ];

    return (
      <View style={this.state.cardStyle}>
        <Swipeout right={deleteButton} backgroundColor="#fff" autoClose={true}>
          <View>
            <TouchableHighlight
              onPress={onCardClick}
              underlayColor="#fbfbfb"
              style={{justifyContent: 'center', flex: 1, height: 105}}
              onPressIn={onPressIn}
              onPressOut={onPressOut}>
                <View>
                  <Text style={Styles.cardText}> {this.props.name.replace(/\.[^.]*$/g, '')} </Text>
                </View>
            </TouchableHighlight>
          </View>
        </Swipeout>
      </View>
    );
  }
}

export default Card
