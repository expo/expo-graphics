// @flow
import { GLView as EXGLView } from 'expo-gl';
import React from 'react';
import { PixelRatio } from 'react-native';

const invariant = require('fbjs/lib/invariant');

export default class GLView extends React.Component {
  render() {
    const { onContextCreate, ...props } = this.props;
    return (
      <EXGLView
        {...props}
        onContextCreate={gl => {
          const scale = PixelRatio.get();

          invariant(
            onContextCreate,
            'ExpoGraphics.GLView: prop `onContextCreate` must be defined.'
          );

          onContextCreate({
            gl,
            width: gl.drawingBufferWidth / scale,
            height: gl.drawingBufferHeight / scale,
            scale,
            pixelRatio: scale,
            canvas: null,
          });
        }}
      />
    );
  }
}
