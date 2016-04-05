/*
Global styles :D
*/
'use strict';
import React, {
  StyleSheet
} from 'react-native';

let Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  navBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    elevation: 4,
  },
  statusBar: {
    backgroundColor: '#c0392b',
  },
  backButton: {
    marginLeft: 10
  },
  rightCorner: {
    marginRight: 15
  },
  title: {
    textAlign: 'center',
  },
  newMapTitle: {
    textAlign: 'center',
    marginLeft: 5,
    color: '#ecf0f1',
    fontSize: 17,
    fontWeight: '600',
  },
  mapListTitle: {
    textAlign: 'center',
    marginLeft: 50,
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    elevation: 5,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    elevation: 5,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  startFab: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: "rgb(26, 187, 156)",
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopFab: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: "rgb(231, 76, 60)",
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newMapButton: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: "rgb(26, 187, 156)",
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: "rgb(26, 187, 156)",
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 56,
    height: 56,
    elevation: 1,
    marginTop: -56,
  },
  spinnerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    elevation: 4,
    height: 105,
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 8,
    marginBottom: 6,
    marginRight: 8,
  },
  cardTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGroup: {
    elevation: 0,
  },
  swipeOut: {
    flex: 1
  },
  deleteWrapper: {
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    alignItems: 'center',
  },
  radiusSlider: {
    marginTop: 5,
    marginRight: 86,
  },
  opacitySlider: {
    marginRight: 86,
  },
  radiusText: {
    textAlign: 'center',
    marginRight: 86,
  },
  opacityText: {
    textAlign: 'center',
    marginBottom: 13,
    marginRight: 86,
  },
  settingsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  noMapText: {
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
  },
  placeholder: {
    backgroundColor: "#f0ede5",
  }
});

export default Styles
