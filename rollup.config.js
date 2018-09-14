import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const plugins = [
  flow({
    pretty: true,
  }),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
  }),
  resolve(),

  commonjs(),
];

const external = Object.keys(
  Object.assign({}, pkg.peerDependencies, pkg.dependencies)
);

const output = [{ file: pkg.main, format: 'cjs' }];

export default [
  /**
   * Node.js Build
   */
  {
    input: 'lib/index.js',
    output,
    plugins,
    external,
  },
];
