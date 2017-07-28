const chalk = require('chalk')
const info = (msg) => chalk.green(msg);
module.exports = `
  ${info('NAME')}

    up - upgrade package.json

  ${info('SYNOPSIS')}

    up [target] <dist>

  ${info('DESCRIPTION')}

    up 用于在老项目更新的过程当中， 通过指定基准模块， 然后根据该模块的依赖版本来对当前模块的依赖版本进行更新，
    从而避免每次手工更改版本号可能造成的错误问题。

  ${chalk.green('Usage')}

    ${chalk.green('target')}: 要更新 package.json 的模块， 缺省的时候将会使用当前目录。

    ${chalk.green('dist')}:   相对比的目标模块。 在进行更新的时候， 将会以该模块的依赖版本为基准进行更新。

    ${chalk.green('help')}:   显示帮助信息


`;
