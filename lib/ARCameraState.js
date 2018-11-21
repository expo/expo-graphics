// @flow
import { AR } from 'expo';
import React from 'react';
import { StyleSheet, Platform, Text, View } from 'react-native';

const removeSuffix = str => {
  if (typeof str === 'string') {
    const components = str.split('0');
    return components[components.length - 1];
  }
};

let TrackingState;
let TrackingStateReason;
if (AR.isAvailable()) {
  TrackingStateReason = AR.TrackingStateReason;
  TrackingState = AR.TrackingState;
} else {
  TrackingStateReason = {};
  TrackingState = {};
}

class ARCameraState extends React.Component {
  state = {};
  static defaultProps = {
    [TrackingStateReason.None]: { title: 'Having trouble collecting data' },
    [TrackingStateReason.Initializing]: {
      title: 'Initializing',
      subtitle: 'Move the camera around for better results',
    },
    [TrackingStateReason.ExcessiveMotion]: {
      title: 'Excessive motion',
      subtitle: 'Try moving your camera slower',
    },
    [TrackingStateReason.InsufficientFeatures]: {
      title: 'insufficient features',
      subtitle: 'Try moving your camera around more',
    },
    [TrackingStateReason.Relocalizing]: { title: 'Relocalizing' },

    trackingStateStyles: {
      [TrackingState.NotAvailable]: { color: '#D0021B' },
      [TrackingState.Limited]: { color: '#F5C423' },
      [TrackingState.Normal]: { color: '#ffffff' },
    },
  };
  componentDidMount() {
    if (AR.onCameraDidChangeTrackingState) {
      AR.onCameraDidChangeTrackingState(tracking => this.setState(tracking));
    }
  }

  componentWillUnmount() {
    if (AR.isAvailable() && AR.EventTypes) {
      AR.removeAllListeners(AR.EventTypes.CameraDidChangeTrackingState);
    }
  }

  render() {
    const {
      style,
      titleStyle,
      subtitleStyle,
      children,
      trackingStateStyles,
    } = this.props;
    const { trackingState, trackingStateReason } = this.state;

    let trackingStateMessage = {};
    const _trackingState = removeSuffix(trackingState);
    let trackingStateStyle = trackingStateStyles[_trackingState] || {};

    switch (_trackingState) {
      case TrackingState.NotAvailable:
        trackingStateMessage = { title: 'Not Available' };
        break;
      case TrackingState.Limited:
        const reason = removeSuffix(trackingStateReason);
        trackingStateMessage = this.props[reason];
        break;
      case TrackingState.Normal:
        break;
    }
    const { title, subtitle } = trackingStateMessage;

    return (
      <View style={[styles.container, style]}>
        {title && (
          <Text style={[styles.title, trackingStateStyle, titleStyle]}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 56,
    right: 12,
    left: 12,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  subtitle: {
    color: '#BEBEBE',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ARCameraState;
