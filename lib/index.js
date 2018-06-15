const Promise = require('bluebird')
const _ = require('lodash')
const request = require('request')

async function httpRequest (options) {
  return new Promise((resolve, reject) => {
    request(options, (reqErr, response, body) => {
      if (reqErr) {
        return reject(reqErr)
      }
      if (response.statusCode >= 400 && response.statusCode <= 599) {
        let err = new Error(response.statusMessage)
        err.statusMessage = response.statusMessage
        err.statusCode = response.statusCode
        if (!options.returnBody) {
          err = _.merge(err, response)
        }
        return reject(err)
      }
      if (options.returnBody) {
        return resolve(body)
      }
      return resolve(response)
    })
  })
}

const baseUrl = 'https://bitbucket.org/api/2.0'

function postBitBucket (uri, repositoryUser, repositoryName, options = {}) {
  const user = options.user || process.env.BITBUCKET_PULLREQUEST_USER
  const pass = options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD
  delete options.user
  delete options.password
  return httpRequest({
    method: 'POST',
    uri: uri,
    body: options,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user,
      pass,
      sendImmediately: false
    },
    returnBody: true
  })
}

function create (repositoryUser, repositoryName, title, description, sourceBranch, destinationBranch, closeSourceBranch = true) {
  return postBitBucket(
    `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests`,
    repositoryUser,
    repositoryName,
    {
      title,
      description,
      source: {
        branch: {
          name: sourceBranch
        },
        repository: {
          full_name: `${repositoryUser}/${repositoryName}`
        }
      },
      destination: {
        branch: {
          name: destinationBranch
        }
      },
      close_source_branch: closeSourceBranch
    })
}

function approve (repositoryUser, repositoryName, pullRequestId) {
  return postBitBucket(
    `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests/${pullRequestId}/approve`,
    repositoryUser, repositoryName)
}

function decline (repositoryUser, repositoryName, pullRequestId) {
  return postBitBucket(
    `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests/${pullRequestId}/decline`,
    repositoryUser, repositoryName)
}

function get (repositoryUser, repositoryName, options = {}) {
  return httpRequest({
    method: 'GET',
    uri: `${baseUrl}/repositories/${repositoryUser}/${repositoryName}/pullrequests`,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: options.user || process.env.BITBUCKET_PULLREQUEST_USER,
      pass: options.password || process.env.BITBUCKET_PULLREQUEST_PASSWORD,
      sendImmediately: false
    },
    returnBody: true
  })
}

module.exports = {
  create,
  get,
  approve,
  decline
}
