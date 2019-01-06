import React from 'react';
import renderer from 'react-test-renderer';

import GraphicsViewIOS from '../lib/GraphicsView.ios.js';
import GraphicsViewDefault from '../lib/GraphicsView.js';

describe('GraphicsView', () => {
  describe('Platform.default', () => {
    it('renders', () => {
      const tree = renderer.create(<GraphicsViewDefault />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Platform.ios', () => {
    it('renders', () => {
      const tree = renderer.create(<GraphicsViewIOS />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
