import PropTypes from 'prop-types';
import * as React from 'react';

type Props = {
  /**
   * Called when the OpenGL context is created, with the context object as a parameter. The context
   * object has an API mirroring WebGL's WebGLRenderingContext.
   */
  onContextCreate?: (gl: *) => void,
  /**
   * A ref callback for the native GLView
   */
  nativeRef_EXPERIMENTAL: React.Ref<typeof HTMLCanvasElement>,
};

/**
 * A component that acts as an OpenGL render target
 */
export default class GLView extends React.Component<Props> {
  static propTypes = {
    onContextCreate: PropTypes.func,
    nativeRef_EXPERIMENTAL: PropTypes.func,
  };

  nativeRef: ?HTMLCanvasElement;

  componentDidMount() {
    const { onContextCreate } = this.props;
    onContextCreate &&
      onContextCreate({
        gl: this.nativeRef.getContext('webgl'),
        canvas: this.nativeRef,
        width: this.nativeRef.clientWidth,
        height: this.nativeRef.clientHeight,
        scale: window.devicePixelRatio,
      });
  }

  render() {
    const {
      onContextCreate, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;

    return <canvas {...props} ref={this._setNativeRef} />;
  }

  _setNativeRef = (nativeRef: HTMLCanvasElement) => {
    if (this.props.nativeRef_EXPERIMENTAL) {
      this.props.nativeRef_EXPERIMENTAL(nativeRef);
    }
    this.nativeRef = nativeRef;
  };

  startARSessionAsync() {
    console.error('GLView.startARSessionAsync: Not Implemented');
  }

  async createCameraTextureAsync() {
    console.error('GLView.createCameraTextureAsync: Not Implemented');
    return new WebGLTexture();
  }

  destroyObjectAsync(glObject: WebGLObject) {
    console.error('GLView.destroyObjectAsync: Not Implemented');
  }
}
