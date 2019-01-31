import { AR } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import AR from '../__tests__/AR.mock';

const removeSuffix = str => {
  if (typeof str === 'string') {
    const components = str.split('0');
    return components[components.length - 1];
  }
};

const {
  TrackingState,
  TrackingStates = {},
  TrackingStateReason,
  TrackingStateReasons = {},
  EventType,
  EventTypes = {},
} = AR;

const ARReasons = TrackingStateReason || TrackingStateReasons;
const ARState = TrackingState || TrackingStates;
const AREventType = EventType || EventTypes;
class ARCameraState extends React.Component {
  state = {};
  static defaultProps = {
    [ARReasons.None]: { title: 'Having trouble collecting data' },
    [ARReasons.Initializing]: {
      title: 'Initializing',
      subtitle: 'Move the camera around for better results',
    },
    [ARReasons.ExcessiveMotion]: {
      title: 'Excessive motion',
      subtitle: 'Try moving your camera slower',
    },
    [ARReasons.InsufficientFeatures]: {
      title: 'insufficient features',
      subtitle: 'Try moving your camera around more',
    },
    [ARReasons.Relocalizing]: { title: 'Relocalizing' },

    trackingStateStyles: {
      [ARState.NotAvailable]: { color: '#D0021B' },
      [ARState.Limited]: { color: '#F5C423' },
      [ARState.Normal]: { color: '#ffffff' },
    },
  };
  componentDidMount() {
    if (AR.onCameraDidChangeTrackingState) {
      AR.onCameraDidChangeTrackingState(tracking => this.setState(tracking));
    }
  }

  componentWillUnmount() {
    if (AR.isAvailable() && AR.removeAllListeners) {
      AR.removeAllListeners(AREventType.CameraDidChangeTrackingState);
    }
  }

  render() {
    const {
      style,
      isVisible,
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
      case ARState.NotAvailable:
        trackingStateMessage = { title: 'Not Available' };
        break;
      case ARState.Limited:
        const reason = removeSuffix(trackingStateReason);
        trackingStateMessage = this.props[reason];
        break;
      case ARState.Normal:
        break;
    }
    const { title, subtitle } = trackingStateMessage;

    if (!isVisible) {
      return null;
    }

    return (
      <View style={[styles.container, style]}>
        {title && <Text style={[styles.title, trackingStateStyle, titleStyle]}>{title}</Text>}
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
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
