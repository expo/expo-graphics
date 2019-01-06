import React from 'react';
import renderer from 'react-test-renderer';

import ARCameraStateIOS from '../lib/ARCameraState.ios.js';
import ARCameraStateDefault from '../lib/ARCameraState.js';

describe('ARCameraState', () => {
  describe('Platform.default', () => {
    it('renders', () => {
      const tree = renderer.create(<ARCameraStateDefault />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Platform.ios', () => {
    it('renders', () => {
      const tree = renderer.create(<ARCameraStateIOS />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
