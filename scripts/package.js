const shell = require('shelljs')

shell.cp('-n', ['package.json', 'README.md', 'LICENSE'], 'dist')
shell.exec(
  `json -I -f dist/package.json -e "this.devDependencies=undefined; this.optionalDependencies=undefined; this.scripts=undefined; this.prettier=undefined; this.jest=undefined;"`,
)
