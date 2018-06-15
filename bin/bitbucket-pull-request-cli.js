#!/usr/bin/env node
;(function () {

  process.title = 'bitbucket-pull-request'

  const bitbucketPullRequest = require('../lib/index.js')

  bitbucketPullRequest.deref = function (c) {
    if (!c) return ''
    if (c.match(/[A-Z]/)) {
      c = c.replace(/([A-Z])/g, function (m) {
        return '-' + m.toLowerCase()
      })
    }
    if (plumbing.indexOf(c) !== -1) return c
    var a = abbrevs[c]
    if (aliases[a]) a = aliases[a]
    return a
  }

  const nopt = require('nopt')

  const conf = nopt({
    create: [String, String, String],
    get: [],
    approve: String
  }, {}, process.argv, 2)

  bitbucketPullRequest.argv = conf.argv.remain
  console.log(conf)

})()
