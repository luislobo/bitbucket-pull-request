const {get, create, approve, decline} = require('../index')
let pullRequestId = ''

test('get pull request', async () => {
  const result = await get('luislobo', 'bitbucket-pull-request-test')
  expect(result)
    .toHaveProperty('page', 1)
})

test('create pull request and decline', async () => {
  let result = await create(
    'luislobo',
    'bitbucket-pull-request-test',
    'some title',
    'some big description\ncomes here',
    'test_branch',
    'master'
  )
  expect(result).toHaveProperty('id')
  expect(result).toHaveProperty('state', 'OPEN')

  result = await decline(
    'luislobo',
    'bitbucket-pull-request-test',
    result.id
  )
  expect(result).toHaveProperty('id')
})
