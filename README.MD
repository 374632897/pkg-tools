# Tools

## up

```
up - upgrade package.json
up [target] <dist>
```
up 用于在老项目更新的过程当中，通过指定基准模块，然后根据该模块的依赖版本来对当前模块的依赖版本进行更新，从而避免每次手工更改版本号可能造成的错误问题。

### Usage

```
target: 要更新 package.json 的模块

dist:   相对比的目标模块。 在进行更新的时候， 将会以该模块的依赖版本为基准进行更新。

help:   显示帮助信息
```
