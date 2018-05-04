'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL: '"http://localhost:7777/"',
  // SSO_URL: '"http://localhost:9999/sso/login"'

  BASE_URL: '"http://swms-server.zhijiaocloud.net"',
  SSO_URL: '"http://web.zhijiaocloud.net"'
})
