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

// let []

let [source, dist] = process.argv.slice(2)

if (!dist) {
  dist = source;
  source = basename(process.cwd());
  BASE_PATH = join(process.cwd(), '..');
}
[dist, source] = [source, dist]

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
  if (!distPkg[type]) return;
  const len = 12;
  Object.keys(distPkg[type]).map(item => {
    if (deps[item] && distPkg[type][item] !== deps[item]) {
      updateList.push(format(item, distPkg[type][item], deps[item]));
      distPkg[type][item] = deps[item]
    }
  });
})

if (sourcePkg.peerDependencies) {
  distPkg.peerDependencies = sourcePkg.peerDependencies;
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
    console.log('更新吧')
    return rl.close();
    fs.writeFile(getPkg(dist), JSON.stringify(distPkg, null, 2), (err) => {
      if (err)  {
        return console.log(chalk.red('写入失败 => '), err)
      }
      console.log('package.json文件已更新')
    })
  } else {
    console.info('不更新啊啊')
  }
  rl.close();
});
