'use strict';

var React = require('react-native');
var {
  View,
  NativeMethodsMixin,
  requireNativeComponent,
  StyleSheet,
  PropTypes,
  Platform,
  NativeModules,
  Animated,
} = React;

var resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

var MapHeatmap = React.createClass({
  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'AIRMapHeatmap',
    validAttributes: {
      coordinates: true,
    },
  },

  propTypes: {
    ...View.propTypes,

    // TODO(lmr): get rid of these?
    identifier: PropTypes.string,
    reuseIdentifier: PropTypes.string,

    /**
     * The coordinates for the Heatmap.
     */
    coordinates: React.PropTypes.arrayOf(PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        intensity: PropTypes.number.isRequired
      })).isRequired,

    isVisible: PropTypes.bool,
    radius: PropTypes.number,
    opacity: PropTypes.number,
    zIndex: PropTypes.number
  },

  getDefaultProps() {
    return {
      radius: 20,
      opacity: 0.7,
    };
  },

  render: function() {
    let {radius, opacity, coordinates, ...props} = this.props;
    if (!coordinates) {
      throw new Error("Coordinates were not provided, are required");
    }
    if (radius > 50 || radius < 10) {
      throw new Error("Radius is too big or too small, must be >10 and <= 50");
    }
    if (opacity < 0 || opacity > 1) {
      throw new Error("Opacity is too big or too small, must be >0 and <= 1");
    }
    return (
      <AIRMapHeatmap
        {...this.props}
      />
    );
  },
});

var AIRMapHeatmap = requireNativeComponent('AIRMapHeatmap', MapHeatmap);

module.exports = MapHeatmap;
