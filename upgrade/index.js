const fs = require('fs')
const { join, sep } = require('path')
const chalk = require('chalk')

let BASE_PATH ="/Users/jason/project/co/"

const args = process.argv.slice(2);

if (!args.length || ~['help', '-H', '--help'].indexOf(args[0].trim())) {
  return console.log(require('./help'));
}

const getPkg = (moduleName) => join(BASE_PATH, moduleName, 'package.json')

let [source, dist] = process.argv.slice(2)

if (!dist) {
  dist = source;
  source = process.cwd();
  BASE_PATH = join(source, '..');
}

if (dist.split(sep).length === 1) {
  dist = join(BASE_PATH, dist);
}

// console.log(source, dist);
// return;

const [sourcePkg, distPkg] = [source, dist].map(item => require(getPkg(item)))

const depTypes = ['dependencies', 'devDependencies'];

const deps = depTypes.reduce((acc, current) => {
  if (sourcePkg[current]) {
    Object.keys(sourcePkg[current]).map(item => {
      acc[item] = sourcePkg[current][item]
    });
  }
  return acc;
}, {});

depTypes.forEach(type => {
  if (!distPkg[type]) return;
  Object.keys(distPkg[type]).map(item => {
    if (deps[item] && distPkg[type][item] !== deps[item]) {
      console.log(chalk.green(`${item}`) + '   版本更新  ')
      console.log(
        chalk.green('更新前版本： => ' + chalk.yellow(distPkg[type][item])
        + '\t'
        + chalk.green('更新后版本： => ' + chalk.yellow(deps[item]))
        + '\n'
      ))
      distPkg[type][item] = deps[item]
    }
  });
})

if (sourcePkg.peerDependencies) {
  distPkg.peerDependencies = sourcePkg.peerDependencies;
}

fs.writeFile(getPkg(dist), JSON.stringify(distPkg, null, 2), (err) => {
  if (err)  {
    return console.log(chalk.red('写入失败 => '), err)
  }
  console.log('package.json文件已更新')
})
