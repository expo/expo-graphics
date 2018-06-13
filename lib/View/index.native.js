// @flow
import Expo, { AR } from 'expo';
import React from 'react';
import {
  AppState,
  findNodeHandle,
  PixelRatio,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ARCameraState from '../ARCameraState';
import ARRunningState from '../ARRunningState';
import GLView from '../GLView';

import type { TrackingConfiguration } from 'expo';

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

  onShouldReloadContext?: () => boolean,
  onRender: (delta: number) => void,
  onContextCreate?: (props: *) => void,
  onResize?: (layout: Layout) => void,
  shouldIgnoreSafeGaurds?: ?boolean,
} & React.ElementProps<typeof GLView>;

function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class GraphicsView extends React.Component<Props> {
  nativeRef: ?GLView.NativeView;
  gl: ?any;

  static defaultProps = {
    arRunningProps: {},
    arCameraProps: {},
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
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
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
    if (!this.props.shouldIgnoreSafeGaurds) {
      if (this.props.isArEnabled) {
        try {
          AR.isAvailable();
        } catch ({ message }) {
          return this._renderErrorView(message);
        }
      }
    }

    return (
      <View style={[styles.container, this.props.style]}>
        <GLView
          key={this.state.id}
          onLayout={this._onLayout}
          nativeRef_EXPERIMENTAL={ref => (this.nativeRef = ref)}
          style={[styles.container, this.props.glviewStyle]}
          onContextCreate={this._onContextCreate}
        />
        {this.props.isArRunningStateEnabled && (
          <ARRunningState {...this.props.runningProps} />
        )}
        {this.props.isArCameraStateEnabled && (
          <ARCameraState {...this.props.cameraProps} />
        )}
      </View>
    );
  }

  _onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    if (!this.gl) {
      return;
    }
    const scale = PixelRatio.get();
    this.props.onResize && this.props.onResize({ x, y, width, height, scale });
  };

  _onContextCreate = async ({ gl, ...props }) => {
    gl.createRenderbuffer = () => ({});

    this.gl = gl;
    if (this.props.isArEnabled) {
      if (!this.props.arTrackingConfiguration) {
        console.error(
          'ExpoGraphics.View: `arTrackingConfiguration` must be defined.',
        );
      }
      // Start AR session
      await AR.startAsync(
        findNodeHandle(this.nativeRef),
        this.props.arTrackingConfiguration,
      );
    }

    await this.props.onContextCreate({
      gl,
      ...props,
    });
    let lastFrameTime;
    const render = () => {
      if (this.gl) {
        const now = 0.001 * global.nativePerformanceNow();
        const delta =
          typeof lastFrameTime !== 'undefined' ? now - lastFrameTime : 0.16666;
        this.rafID = requestAnimationFrame(render);

        this.props.onRender(delta);
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
