import { GLView as EXGLView } from 'expo';
import React from 'react';
import { PixelRatio } from 'react-native';

export default class GLView extends React.Component {
  render() {
    const { onContextCreate, ...props } = this.props;
    return (
      <EXGLView
        {...props}
        onContextCreate={gl => {
          const scale = PixelRatio.get();
          onContextCreate &&
            onContextCreate({
              gl,
              width: gl.drawingBufferWidth / scale,
              height: gl.drawingBufferHeight / scale,
              scale,
              canvas: null,
            });
        }}
      />
    );
  }
}
