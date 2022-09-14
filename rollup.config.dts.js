/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import path from 'path'
import dts from 'rollup-plugin-dts'

const { root } = path.parse(process.cwd())

function external(id) {
  return !id.startsWith('.') && !id.startsWith(root)
}

/**
 * @return {import("rollup").RollupOptions[]}
 */
export default () => {
  return [
    {
      input: './dist/temp-types/index.d.ts',
      output: [{ file: 'dist/index.d.ts', format: 'es' }],
      external,
      plugins: [dts()],
    },
    {
      input: './dist/temp-types/extend/index.d.ts',
      output: [{ file: 'dist/extend/index.d.ts', format: 'es' }],
      external,
      plugins: [dts()],
    },
    {
      input: './dist/temp-types/react-extend/index.d.ts',
      output: [{ file: 'dist/react-extend/index.d.ts', format: 'es' }],
      external,
      plugins: [dts()],
    },
    {
      input: './dist/temp-types/utils/index.d.ts',
      output: [{ file: 'dist/utils/index.d.ts', format: 'es' }],
      external,
      plugins: [dts()],
    },
  ]
}
