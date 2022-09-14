/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import babelPlugin from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import shell from 'shelljs'

shell.rm('-rf', 'dist')

const createBabelConfig = require('./babel.config')

const extensions = ['.js', '.ts', '.tsx']

const { root } = path.parse(process.cwd())

function external(id) {
  return !id.startsWith('.') && !id.startsWith(root)
}

function getBabelOptions(targets) {
  return {
    ...createBabelConfig({ env: (env) => env === 'build' }, targets),
    extensions,
    comments: false,
    babelHelpers: 'bundled',
  }
}

/**
 * @return {import("rollup").RollupOptions}
 */
function createBuildOptions(format, input, output, plugins = []) {
  const isNodeBuild = format === 'cjs'

  return {
    input,
    output: {
      file: `${output}.js`,
      format,
      exports: 'named',
      sourcemap: !!process.env.SOURCE_MAP,
      externalLiveBindings: false,
      name: 'WeaveState',
    },
    external,
    plugins: [
      json({
        namedExports: false,
      }),
      ts({
        check: process.env.NODE_ENV === 'production',
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            target: isNodeBuild ? 'es2019' : 'es2015',
            sourceMap: output.sourcemap,
            declaration: false,
            emitDeclarationOnly: false,
          },
          exclude: ['**/__tests__', 'test-dts'],
        },
      }),
      require('@rollup/plugin-node-resolve').nodeResolve(),
      ...plugins,
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

function buildToESM(module, output) {
  return createBuildOptions('esm', `./src/${module}.ts`, output)
}

function buildToCJS(module, output) {
  return createBuildOptions('cjs', `./src/${module}.ts`, output, [
    babelPlugin(getBabelOptions({ ie: 11 })),
  ])
}

export default () => {
  return [
    buildToESM('index', 'dist/index.esm'),
    buildToESM('utils/index', 'dist/utils/index.esm'),
    buildToESM('extend/index', 'dist/extend/index.esm'),
    buildToESM('react-extend/index', 'dist/react-extend/index.esm'),

    buildToCJS('index', 'dist/index'),
    buildToCJS('utils/index', 'dist/utils/index'),
    buildToCJS('extend/index', 'dist/extend/index'),
    buildToCJS('react-extend/index', 'dist/react-extend/index'),
  ]
}
