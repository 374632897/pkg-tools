const fs = require('fs')
const { join } = require('path')
const chalk = require('chalk')
const BASE_PATH ="/Users/jason/project/co/"

const getPkg = (moduleName) => join(BASE_PATH, moduleName, 'package.json')
const [source, dist] = process.argv.slice(2)

const [sourcePkg, distPkg] = [source, dist].map(item => require(getPkg(item)))

// const depTypes = ['dependencies', 'peerDependencies', 'devDependencies'];
const depTypes = ['dependencies', 'devDependencies'];

const depIter = (pkg, cb) => {
  depTypes.forEach(depType => {
    if (!pkg[depType]) return;
    Object.keys(pkg[depType]).map(item => {
      cb(item, pkg[item]);
    });
  })
}

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
fs.writeFile(getPkg(dist), JSON.stringify(distPkg, null, 2), (err) => {
  if (err)  {
    return console.log(chalk.red('写入失败 => '), err)
  }
  console.log('package.json文件已更新')
})
