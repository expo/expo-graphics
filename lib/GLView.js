// @flow
import { GLView as EXGLView } from 'expo-gl';
import invariant from 'invariant';
import React from 'react';
import { PixelRatio } from 'react-native';

// import EXGLView from '../__tests__/GLView.mock';
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
