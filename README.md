[![NPM](https://nodei.co/npm/expo-graphics.png)](https://nodei.co/npm/expo-graphics/)

---

# expo-graphics

Tools to help simplify and manage GL/AR state.

### Installation

```bash
yarn add expo-graphics
```

### Usage

Import the library into your JavaScript file:

```bash
import ExpoGraphics from 'expo-graphics';
```

## Components

### `ExpoGraphics.View`

A view that assists with common GL and AR tasks.

#### Props

| Property                |                             Type                             | Default | Description                                                                                                         |
| ----------------------- | :----------------------------------------------------------: | :-----: | ------------------------------------------------------------------------------------------------------------------- |
| isArEnabled             |                           ?boolean                           |  null   | Enables an ARKit context: **iOS Only**                                                                              |
| isArRunningStateEnabled |                           ?boolean                           |  null   | Adds a toggle for ARKit running state: **iOS Only**                                                                 |
| isArCameraStateEnabled  |                           ?boolean                           |  null   | Renders information related to ARKit the tracking state: **iOS Only**                                               |
| arTrackingConfiguration |                  ?AR.TrackingConfiguration                   |  null   | Enables an ARKit context: **iOS Only**                                                                              |
| arRunningProps          |                           ?object                            |   {}    | Props for optional ARRunningState: **iOS Only**                                                                     |
| arCameraProps           |                           ?object                            |   {}    | Props for optional ARCameraState: **iOS Only**                                                                      |
| isShadowsEnabled        |                           ?boolean                           |  false  | Overrides the render buffer allowing for shadows, this works by default on Android: **iOS Only**                    |
| onRender                |                   (delta: number) => void                    |  null   | Called every frame with delta time since the last frame                                                             |
| onContextCreate         | ({gl, canvas?, width, height, scale, arSession?}) => Promise |  null   | Called with the newly created GL context, and optional arSession                                                    |
| onShouldReloadContext   |                        () => boolean                         |  null   | A delegate function that requests permission to reload the GL context when the app returns to the foreground        |
| onResize                |                   (layout: Layout) => void                   |  null   | Invoked when the view changes size, or the device orientation changes, returning the `{x, y, width, height, scale}` |
| shouldIgnoreSafeGuards  |                           ?boolean                           |  null   | This prevents the app from stopping when run in a simulator, or when AR is run in devices that don't support AR     |

### `ExpoGraphics.ARCameraState`

Information related to the AR camera's tracking state.

#### Props

| Property                                       |              Type               |                                     Default                                      | Description                                       |
| ---------------------------------------------- | :-----------------------------: | :------------------------------------------------------------------------------: | ------------------------------------------------- |
| titleStyle                                     |             ?object             |                                       null                                       | The style of the title Text                       |
| subtitleStyle                                  |             ?object             |                                       null                                       | The style of the subtitle Text                    |
| trackingStateStyles                            |  ?{[AR.TrackingState]: object}  |                                       null                                       | The title text style used with each TrackingState |
| [AR.TrackingStateReason.None]                 | {title:string, subtitle:string} |                   { title: 'Having trouble collecting data' }                    | Used when the AR camera isn't available           |
| [AR.TrackingStateReason.Initializing]         | {title:string, subtitle:string} | { title: 'Initializing, subtitle: 'Move the camera around for better results' }  | The camera is starting to collect data            |
| [AR.TrackingStateReason.ExcessiveMotion]      | {title:string, subtitle:string} |     { title: 'Excessive motion', subtitle: 'Try moving your camera slower' }     | The device is moving too fast                     |
| [AR.TrackingStateReason.InsufficientFeatures] | {title:string, subtitle:string} | {title: 'insufficient features', subtitle: 'Try moving your camera around more'} | The camera hasn't collected enough data           |
| [AR.TrackingStateReason.Relocalizing]         | {title:string, subtitle:string} |                   { title: 'Having trouble collecting data' }                    | The camera is reseting                            |

### `ExpoGraphics.ARRunningState`

A button used for toggling the AR state

#### Props

| Property |   Type    | Default | Description                            |
| -------- | :-------: | :-----: | -------------------------------------- |
| onPress  | ?Function |  null   | Called whenever the button is toggled. |
