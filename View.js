// @flow

import Expo from "expo";
import React from "react";
import {
  findNodeHandle,
  Platform,
  NativeModules,
  View,
  Text,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";

const ErrorMessage = {
  simulator: `Can't run GLView in a simulator :(`,
  aNine: `ARKit can only run on iOS devices with A9 (2015) or greater chips! This is a`,
  notIosAR: `ARKit can only run on an iOS device! This is a`
};

type Layout = {
  x: number,
  y: number,
  width: number,
  height: number
};

type Props = {
  enableAR?: ?boolean,
  onRender: (delta: number) => void,
  onContextCreate?: (gl: *, arSession: *) => void,
  onResize?: (layout: Layout) => void
} & React.ElementProps<typeof GLView>;

export default class GameView extends React.Component<Props> {
  nativeRef: ?GLView.NativeView;
  gl: ?any;

  _renderErrorView = error => (
    <View style={styles.errorContainer}>
      <Text>{error}</Text>
    </View>
  );

  render() {
    if (!Expo.Constants.isDevice) {
      return this._renderErrorView(ErrorMessage.simulator);
    }
    if (Platform.OS === "ios") {
      if (Expo.Constants.deviceYearClass < 2015) {
        const message = `${ErrorMessage.aNine} ${Expo.Constants
          .deviceYearClass} device`;
        console.error(message);
        return this._renderErrorView(message);
      }
    } else if (this.props.enableAR) {
      const message = `${ErrorMessage.notIosAR} ${Platform.OS} device`;
      console.error(message);
      return this._renderErrorView(message);
    }

    return (
      <Expo.GLView
        onLayout={this._onLayout}
        nativeRef_EXPERIMENTAL={ref => (this.nativeRef = ref)}
        style={styles.container}
        onContextCreate={this._onContextCreate}
      />
    );
  }

  _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    if (!this.gl) {
      return;
    }
    this.props.onResize && this.props.onResize({ x, y, width, height });
  };

  _onContextCreate = async gl => {
    this.gl = gl;
    let arSession;
    if (this.props.enableAR) {
      // Start AR session
      arSession = await NativeModules.ExponentGLViewManager.startARSessionAsync(
        findNodeHandle(this.nativeRef)
      );
    }

    await this.props.onContextCreate(gl, arSession);
    let lastFrameTime;
    const render = () => {
      const now = 0.001 * global.nativePerformanceNow();
      const delta =
        typeof lastFrameTime !== "undefined" ? now - lastFrameTime : 0.16666;
      requestAnimationFrame(render);

      this.props.onRender(delta);
      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();

      lastFrameTime = now;
    };
    render();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  errorContainer: {
    backgroundColor: "orange",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
