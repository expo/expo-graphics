// @flow
import { AR } from 'expo';
import invariant from 'invariant';
import React from 'react';
import { AppState, findNodeHandle, PixelRatio, StyleSheet, Text, View } from 'react-native';
import uuidv4 from 'uuid/v4';

import ARCameraState from './ARCameraState';
import ARRunningState from './ARRunningState';
import GLView from './GLView';

// import AR from '../__tests__/AR.mock';
// import type { TrackingConfiguration } from 'expo';
type TrackingConfiguration = any;

type Layout = {
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
};

type Props = {
  isArEnabled?: ?boolean,
  isArRunningStateEnabled?: ?boolean,
  isArCameraStateEnabled?: ?boolean,
  arTrackingConfiguration: ?TrackingConfiguration,
  arRunningProps?: ?object,
  arCameraProps?: ?object,
  isShadowsEnabled?: ?boolean,
  onShouldReloadContext?: () => boolean,
  onRender: (delta: number) => void,
  onContextCreate?: (props: *) => void,
  onResize?: (layout: Layout) => void,
  shouldIgnoreSafeGuards?: ?boolean,
} & React.ElementProps<typeof GLView>;

export default class GraphicsView extends React.Component<Props> {
  nativeRef: ?GLView.NativeView;
  gl: ?any;

  static defaultProps = {
    arRunningProps: {},
    arCameraProps: {},
    isShadowsEnabled: false,
    isArCameraStateEnabled: true,
  };

  state = {
    appState: AppState.currentState,
    id: uuidv4(),
  };

  _renderErrorView = error => (
    <View style={styles.errorContainer}>
      <Text>{error}</Text>
    </View>
  );

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {
    this.destroy();
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

  destroy = () => {
    AR.stopAsync();
    this.gl = null;
    this.nativeRef = null;
    cancelAnimationFrame(this.rafID);
  };

  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // console.log('App has come to the foreground!')
      const { onShouldReloadContext } = this.props;
      if (onShouldReloadContext && onShouldReloadContext()) {
        this.destroy();
        this.setState({ appState: nextAppState, id: uuidv4() });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    const {
      isArEnabled,
      shouldIgnoreSafeGuards,
      style,
      glviewStyle,
      runningProps,
      cameraProps,
      isArRunningStateEnabled,
      isArCameraStateEnabled,
    } = this.props;

    if (!shouldIgnoreSafeGuards) {
      if (isArEnabled && !AR.isAvailable()) {
        return this._renderErrorView(AR.getUnavailabilityReason());
      }
    }

    return (
      <View style={[styles.container, style]}>
        <GLView
          key={this.state.id}
          onLayout={this._onLayout}
          nativeRef_EXPERIMENTAL={this._saveNativeRef}
          style={[styles.container, glviewStyle]}
          onContextCreate={this._onContextCreate}
        />
        {isArEnabled && isArRunningStateEnabled && <ARRunningState {...runningProps} />}
        {isArEnabled && <ARCameraState isVisible={isArCameraStateEnabled} {...cameraProps} />}
      </View>
    );
  }

  _saveNativeRef = ref => {
    this.nativeRef = ref;
  };

  _onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    if (!this.gl) {
      return;
    }
    if (this.props.onResize) {
      const scale = PixelRatio.get();
      this.props.onResize({ x, y, width, height, scale, pixelRatio: scale });
    }
  };

  _onContextCreate = async ({ gl, ...props }) => {
    this.gl = gl;

    const {
      onContextCreate,
      onRender,
      isShadowsEnabled,
      isArEnabled,
      arTrackingConfiguration,
    } = this.props;

    invariant(
      onRender,
      'expo-graphics: GraphicsView.onContextCreate(): `onRender` must be defined.'
    );
    invariant(
      onContextCreate,
      'expo-graphics: GraphicsView.onContextCreate(): `onContextCreate` must be defined.'
    );

    if (isShadowsEnabled === true) {
      // Bacon: On iOS the Render Buffer must be shimmed to allow for shadows. This will break composers and effects though.
      gl.createRenderbuffer = () => ({});
    }

    if (isArEnabled === true) {
      const { TrackingConfiguration, TrackingConfigurations } = AR;
      const finalConfig = TrackingConfiguration || TrackingConfigurations;
      if (!arTrackingConfiguration) {
        invariant(
          finalConfig,
          'AR Cannot be run because TrackingConfiguration(s) are not defined.'
        );
      }
      const trackingConfiguration = arTrackingConfiguration || finalConfig.World;
      // Start AR session
      await AR.startAsync(findNodeHandle(this.nativeRef), trackingConfiguration);
    }

    await onContextCreate({
      gl,
      ...props,
    });
    let lastFrameTime;
    const render = () => {
      if (this.gl) {
        const now = 0.001 * global.nativePerformanceNow();
        const delta = typeof lastFrameTime !== 'undefined' ? now - lastFrameTime : 0.16666;
        this.rafID = requestAnimationFrame(render);

        onRender(delta);
        // NOTE: At the end of each frame, notify `Expo.GLView` with the below
        gl.endFrameEXP();

        lastFrameTime = now;
      }
    };
    render();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
