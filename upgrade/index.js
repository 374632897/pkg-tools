#!/usr/bin/env node

const fs = require('fs')
const { join, sep, basename } = require('path')
const chalk = require('chalk')
const leftPad = require('left-pad');
let BASE_PATH ="/Users/jason/project/co/"

const isSelect = (options, value) => ~options.indexOf(value.trim());

const args = process.argv.slice(2);

if (!args.length || isSelect(['help', '-H', '--help'], args[0])) {
  return console.log(require('./help'));
}

const getPkg = (moduleName) => join(BASE_PATH, moduleName, 'package.json')

let [target, compareTo] = process.argv.slice(2)

if (!compareTo) {
  compareTo = target;
  target = basename(process.cwd());
  BASE_PATH = join(process.cwd(), '..');
}

const [compareToPkg, targetPkg] = [compareTo, target].map(item => require(getPkg(item)))

const depTypes = ['dependencies', 'devDependencies'];

const deps = depTypes.reduce((acc, current) => {
  if (compareToPkg[current]) {
    Object.keys(compareToPkg[current]).map(item => {
      acc[item] = compareToPkg[current][item]
    });
  }
  return acc;
}, {});

const format = (moduleName, preVersion, nextVersion) => {
  return [
    leftPad(chalk.green(moduleName), 60),
    leftPad(chalk.yellow(preVersion), 20) + ' => ' + chalk.yellow(nextVersion)
  ]
};

const updateList = [
  format('Dependencies', 'preVersion', 'nextVersion'),
  ['', '', '']
];

depTypes.forEach(type => {
  if (!targetPkg[type]) return;
  const len = 12;
  Object.keys(targetPkg[type]).map(item => {
    if (deps[item] && targetPkg[type][item] !== deps[item]) {
      updateList.push(format(item, targetPkg[type][item], deps[item]));
      targetPkg[type][item] = deps[item]
    }
  });
})

if (compareToPkg.peerDependencies) {
  targetPkg.peerDependencies = compareToPkg.peerDependencies;
}

console.log(updateList.map(([moduleName, version]) => moduleName + '\t' + version).join('\n'));

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('是否执行版本更新(Y/n) ', (answer) => {
  console.log(answer)
  if (isSelect(['Y', 'y', 'yes', 'YES', 'Yes'], answer)) {
    fs.writeFile(getPkg(target), JSON.stringify(targetPkg, null, 2), (err) => {
      if (err)  {
        return console.log(chalk.red('写入失败 => '), err)
      }
      console.log('package.json文件已更新')
    })
  }
  rl.close();
});
