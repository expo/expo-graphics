import { AR } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const removeSuffix = str => {
  if (typeof str === 'string') {
    const components = str.split('0');
    return components[components.length - 1];
  }
};

class ARCameraState extends React.Component {
  state = {};
  static defaultProps = {
    [AR.TrackingStateReasons.None]: { title: 'Having trouble collecting data' },
    [AR.TrackingStateReasons.Initializing]: {
      title: 'Initializing',
      subtitle: 'Move the camera around for better results',
    },
    [AR.TrackingStateReasons.ExcessiveMotion]: {
      title: 'Excessive motion',
      subtitle: 'Try moving your camera slower',
    },
    [AR.TrackingStateReasons.InsufficientFeatures]: {
      title: 'insufficient features',
      subtitle: 'Try moving your camera around more',
    },
    [AR.TrackingStateReasons.Relocalizing]: { title: 'Relocalizing' },

    trackingStateStyles: {
      [AR.TrackingStates.NotAvailable]: { color: '#D0021B' },
      [AR.TrackingStates.Limited]: { color: '#F5C423' },
      [AR.TrackingStates.Normal]: { color: '#ffffff' },
    },
  };
  componentDidMount() {
    AR.onCameraDidChangeTrackingState(tracking => this.setState(tracking));
  }

  componentWillUnmount() {
    AR.removeAllListeners(AR.EventTypes.CameraDidChangeTrackingState);
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
      case AR.TrackingStates.NotAvailable:
        trackingStateMessage = { title: 'Not Available' };
        break;
      case AR.TrackingStates.Limited:
        const reason = removeSuffix(trackingStateReason);
        trackingStateMessage = this.props[reason];
        break;
      case AR.TrackingStates.Normal:
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
