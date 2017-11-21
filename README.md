# expo-graphics

Use [THREE](https://threejs.org) on [Expo](https://expo.io)! Just `yarn add expo-graphics` in your Expo project and import it with `import ExpoGraphics from
'expo-graphics';`.

## Functions

### `ExpoGraphics.View`

* onContextCreate: A callback that returns a `gl` context and a `arSession`
* onRender: This function will be called every frame after the `gl` context has been created. 
  * `delta`: time between frames
* onResize: This will be called whenever the view changes size or the device orientation changes.
  * `x`
  * `y`
  * `width`
  * `height`
* enableAR: This will determine if an `arSession` is returned with `onContextCreate`

## Example

In a [new blank Expo project](https://docs.expo.io/versions/latest/guides/up-and-running.html),
run `yarn add expo-graphics` to install ExpoGraphics. Then replace
`main.js` with the following:


### 3D Game

```js
import Expo from "expo";
import React from "react";
import { StyleSheet, PixelRatio } from "react-native";

import * as THREE from "three";
import ExpoTHREE from "expo-three";
import ExpoGraphics from "expo-graphics";

export default class App extends React.Component {
  render() {
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <ExpoGraphics.View
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
      />
    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  onContextCreate = async gl => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scale = PixelRatio.get();

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    this.renderer = ExpoTHREE.createRenderer({ gl });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width / scale, height / scale);
    this.renderer.setClearColor(0x000000, 1.0);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      // NOTE: How to create an Expo-compatible THREE texture
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require("../assets/icons/app-icon.png"))
      })
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  };

  onResize = ({ x, y, width, height }) => {
    const scale = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    this.cube.rotation.x += 3.5 * delta;
    this.cube.rotation.y += 2 * delta;
    this.renderer.render(this.scene, this.camera);
  };
}
```

### AR Game

```js
import Expo from "expo";
import React from "react";
import { StyleSheet, PixelRatio } from "react-native";

import * as THREE from "three";
import ExpoTHREE from "expo-three";
import ExpoGraphics from "expo-graphics";

export default class App extends React.Component {
  render() {
    // Create an `ExpoGraphics.GLView` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <ExpoGraphics.View
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        enableAR={true}
      />
    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  onContextCreate = async (gl, arSession) => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scale = PixelRatio.get();

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    this.renderer = ExpoTHREE.createRenderer({ gl });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width / scale, height / scale);
    this.renderer.setClearColor(0x000000, 1.0);

    this.scene = new THREE.Scene();
    this.scene.background = ExpoTHREE.createARBackgroundTexture(
      arSession,
      this.renderer
    );

    /// AR Camera
    this.camera = ExpoTHREE.createARCamera(
      arSession,
      width / scale,
      height / scale,
      0.01,
      1000
    );  

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      // NOTE: How to create an Expo-compatible THREE texture
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require("../assets/icons/app-icon.png"))
      })
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  };

  onResize = ({ x, y, width, height }) => {
    const scale = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    this.cube.rotation.x += 3.5 * delta;
    this.cube.rotation.y += 2 * delta;
    this.renderer.render(this.scene, this.camera);
  };
}

```

[![NPM](https://nodei.co/npm/expo-graphics.png)](https://nodei.co/npm/expo-graphics/)
