import copy from 'rollup-plugin-copy';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  output: addon.output(),
  plugins: [
    addon.publicEntrypoints(['index.js', 'services/query-params.js']),
    addon.appReexports(['services/query-params.js']),
    addon.dependencies(),
    resolve({ extensions: ['.js', '.ts'] }),
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'bundled',
    }),
    addon.clean(),
    copy({
      targets: [
        { src: '../README.md', dest: '.' },
        { src: '../LICENSE.md', dest: '.' },
      ],
    }),
  ],
};
