const chalk = require('chalk')
module.exports = `
${chalk.green('Usage')}: command [target] <dist>

  ${chalk.green('target')}: Who's package.json you wanna update, by default, it equals to the result of process.cwd()

  ${chalk.green('dist')}:   The dist module's package.json you wanna compare to,
        and update target's package.json's dep version to match it.

`
