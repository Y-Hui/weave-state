const shell = require('shelljs')

shell.exec('tsc -p ./tsconfig.json')

shell.mkdir('dist/temp-types/types')
shell.cp('-n', ['src/types/*'], 'dist/temp-types/types')
shell.exec('rollup --config rollup.config.dts.js')
shell.rm('-rf', 'dist/temp-types')
