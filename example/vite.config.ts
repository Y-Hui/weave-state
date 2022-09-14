/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'weave-state': path.resolve(__dirname, '../src'),
      'weave-state/extend': path.resolve(__dirname, '../src/extend/index.ts'),
      'weave-state/react-extend': path.resolve(
        __dirname,
        '../src/react-extend/index.ts',
      ),
      'weave-state/utils': path.resolve(__dirname, '../src/utils/index.ts'),
      'weave-state/utils/*': path.resolve(__dirname, '../src/utils/*.ts'),
      'weave-state/types': path.resolve(__dirname, '../src/types'),
    },
  },
  plugins: [react()],
})
