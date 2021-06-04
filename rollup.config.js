import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'cjs',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  plugins: [
    typescript(),
    nodeResolve({ resolveOnly: ['@fluss/core'] }),
    replace({
      preventAssignment: true,
      node_modules: 'modules',
    }),
    terser(),
  ],
  external: ['fs', 'path', 'chalk', 'pwa-asset-generator'],
};
