import React from 'react';
import renderer from 'react-test-renderer';

import GLView from '../lib/GLView';

describe('GLView', () => {
  describe('Platform.default', () => {
    it('renders', () => {
      const tree = renderer.create(<GLView />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
