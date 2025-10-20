import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

const createConfig = (input, outputName) => ({
  input,
  output: [
    {
      file: `dist/${outputName}.esm.js`,
      format: 'esm',
      sourcemap: true
    },
    {
      file: `dist/${outputName}.esm.min.js`,
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  external: ['ts-micro-result'],
  plugins: [
    nodeResolve({
      preferBuiltins: false
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist'
    }),
    ...(outputName === 'index' ? [visualizer({
      filename: `dist/bundle-analysis.html`,
      open: false,
      gzipSize: true,
      brotliSize: true
    })] : [])
  ]
});

export default [
  createConfig('src/index.ts', 'index'),
  createConfig('src/lite.ts', 'lite'),
  createConfig('src/core.ts', 'core'),
  createConfig('src/registry.ts', 'registry'),
  createConfig('src/middleware.ts', 'middleware'),
  createConfig('src/advanced.ts', 'advanced')
];
