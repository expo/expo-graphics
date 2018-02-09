// @flow

import Expo from 'expo';
import GLView from '../GLView';
import React from 'react';
import {
  findNodeHandle,
  Platform,
  NativeModules,
  View,
  Text,
  StyleSheet,
  AppState,
  PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';

const ErrorMessage = {
  simulator: `Can't run OpenGL in a simulator :(`,
  aNine: `ARKit can only run on iOS devices with A9 (2015) or greater chips! This is a`,
  notIosAR: `ARKit can only run on an iOS device! This is a`,
};

type Layout = {
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
};

type Props = {
  arEnabled?: ?boolean,
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
    this.gl = null;
    this.nativeRef = null;
    this.arSession = null;
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
      if (!Expo.Constants.isDevice) {
        return this._renderErrorView(ErrorMessage.simulator);
      }
      if (this.props.arEnabled) {
        if (Platform.OS === 'ios') {
          if (Expo.Constants.deviceYearClass < 2015) {
            const message = `${ErrorMessage.aNine} ${
              Expo.Constants.deviceYearClass
            } device`;
            console.error(message);
            return this._renderErrorView(message);
          }
        } else {
          const message = `${ErrorMessage.notIosAR} ${Platform.OS} device`;
          console.error(message);
          return this._renderErrorView(message);
        }
      }
    }

    return (
      <GLView
        key={this.state.id}
        onLayout={this._onLayout}
        nativeRef_EXPERIMENTAL={ref => (this.nativeRef = ref)}
        style={[styles.container, this.props.style]}
        onContextCreate={this._onContextCreate}
      />
    );
  }

  _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    if (!this.gl) {
      return;
    }
    const scale = PixelRatio.get();
    this.props.onResize && this.props.onResize({ x, y, width, height, scale });
  };

  _onContextCreate = async ({ gl, ...props }) => {
    this.gl = gl;
    this.arSession;
    if (this.props.arEnabled) {
      // Start AR session
      this.arSession = await NativeModules.ExponentGLViewManager.startARSessionAsync(
        findNodeHandle(this.nativeRef),
      );
    }

    await this.props.onContextCreate({
      gl,
      arSession: this.arSession,
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
