import React from 'react';
import renderer from 'react-test-renderer';

import ARRunningStateIOS from '../lib/ARRunningState.ios.js';
import ARRunningStateDefault from '../lib/ARRunningState.js';

describe('ARRunningState', () => {
  describe('Platform.default', () => {
    it('renders', () => {
      const tree = renderer.create(<ARRunningStateDefault />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Platform.ios', () => {
    it('renders', () => {
      const tree = renderer.create(<ARRunningStateIOS />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
