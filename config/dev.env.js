'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:7777/"',
  //BASE_URL: '"http://192.168.1.101:7777/"',
  SSO_URL: '"http://localhost:9999/sso/login"',
  LOGOUT_URL: '"http://localhost:9999/sso/logout"'
})
