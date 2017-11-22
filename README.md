# expo-graphics

Tools to help simplify OpenGL ES API.

To get started: `yarn add expo-graphics` in your Expo project and import it with
`import ExpoGraphics from 'expo-graphics';`.

## Functions

### `ExpoGraphics.View`

* **onContextCreate**: A callback that returns a `gl` context and a `arSession`.
* **onRender**: This function will be called every frame after the `gl` context
  has been created.
  * `delta`: The time between function calls.
* **onResize**: This will be called whenever the view changes size or the device
  orientation changes.
  * `x`
  * `y`
  * `width`
  * `height`
* **arEnabled**: This will determine if an `arSession` is returned with
  `onContextCreate`.
* **shouldIgnoreSafeGaurds**: If enabled this will force the app to render with
  unstable conditions.

## Example

Check out our example projects!

[![NPM](https://nodei.co/npm/expo-graphics.png)](https://nodei.co/npm/expo-graphics/)
