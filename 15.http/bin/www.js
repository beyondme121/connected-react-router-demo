#! /usr/bin/env node
const { program, usage } = require('commander')
const packageJSON = require('../package.json')
const userOptions = require('./config')
const { forEach } = require('../utils')

// Object.values(userOptions).forEach(option => {
//   program.option(option.option, option.description)
// })

const usages = []
forEach(userOptions, (option) => {
  usages.push(option.usage)
  program.option(option.option, option.description)
})

program.name('hs')
program.usage('--option <value>')
program.version(packageJSON.version)

// 追加使用项
program.on('--help', () => {
  usages.forEach(usage => {
    console.log(`  ` + usage)
  })
})

// 解析用户参数, 将解析后的结果保存
let userConfig = program.parse(process.argv)
// 设置默认配置
let defaultConfig = {
  port: '8080',
  address: 'localhost',
  directory: process.cwd(),
  ...userConfig
}
// console.log(defaultConfig)

const createServer = require('../src/server')
let server = createServer(defaultConfig)
server.start()
