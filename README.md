[![NPM](https://nodei.co/npm/expo-graphics.png)](https://nodei.co/npm/expo-graphics/)

---

# expo-graphics

Tools to help simplify and manage GL state.

### Installation

```bash
yarn add expo-graphics
```

### Usage

Import the library into your JavaScript file:

```bash
import ExpoGraphics from 'expo-graphics';
```

## Views

### `ExpoGraphics.View`

A view that helps manage GL state across different platforms.

#### Props

| Property               |                             Type                             | Default | Description                                                                                                         |
| ---------------------- | :----------------------------------------------------------: | :-----: | ------------------------------------------------------------------------------------------------------------------- |
| arEnabled              |                           ?boolean                           |  null   | Enables an ARKit context: **iOS Only**                                                                              |
| onRender               |                   (delta: number) => void                    |  null   | Called every frame with delta time since the last frame                                                             |
| onContextCreate        | ({gl, canvas?, width, height, scale, arSession?}) => Promise |  null   | Called with the newly created GL context, and optional arSession                                                    |
| onShouldReloadContext  |                        () => boolean                         |  null   | A delegate function that requests permission to reload the GL context when the app returns to the foreground        |
| onResize               |                   (layout: Layout) => void                   |  null   | Invoked when the view changes size, or the device orientation changes, returning the `{x, y, width, height, scale}` |
| shouldIgnoreSafeGaurds |                           ?boolean                           |  null   | This prevents the app from stopping when run in a simulator, or when AR is run in devices that don't support AR     |

## Example

Check out our example projects!
