const program = require('commander')
const version = require('../package.json').version

program
  .version(version)
  .usage('[options]')
  .option('-u,--upgrade', 'upgrade your project')
  .option('-H, --hello', 'say Hello')
  .option('-d, --drink <drink>', /^(coffee|tea)$/, 'tea')
  .command('show <file> [otherfiles]')
  .action((file, otherfiles) => {
    console.log(file, otherfiles)
  })
  // .parse(process.argv)
program.parse(process.argv)
console.log(program.drink)
if (program.upgrade) {
  return console.info('upgrade')
}
if (program.hello) {
  return console.info('Hello')
}

// program.parse(process.argv);

