/*
  My very own actionbutton
*/
'use strict';
import React, {
  Text,
  View,
  Component,
  Image,
} from 'react-native';

import Styles from './Styles';
import { MKButton, MKColor } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/Ionicons';

let ActionButton = React.createClass({
  getInitialState() {
    return {
      buttonStyle: this.props.buttonStyle,
      onPress: this.props.onStartPress,
      imageName: this.props.imageName,
    }
  },
  render() {
    let transformAction = () => {
      let newPressAction = (this.state.onPress === this.props.onStartPress) ? this.props.onStopPress : this.props.onStartPress
      this.setState({onPress: newPressAction});
    }

    let transformVisual = () => {
      let newStyle = (this.state.buttonStyle === Styles.startFab) ? Styles.stopFab : Styles.startFab
      let newImageName = (this.state.imageName==="play") ? "stop" : "play"
      this.setState({buttonStyle: newStyle, imageName: newImageName});
    }

    let pressAction = () => {
      if (this.props.touchable) {
        this.state.onPress();
        if (this.props.transformVisual) {transformVisual()}
        if (this.props.transformAction) {transformAction()}
      }
    }

    return (
          <View style={Styles.buttonContainer} pointerEvents="box-none">
            <MKButton
              style={this.state.buttonStyle}
              cornerRadius={21}
              onPress={pressAction}
            >
                <Icon name={this.state.imageName} size={this.props.imageSize} color="#fff" />
            </MKButton>
          </View>
    );
  }
});

export default ActionButton
