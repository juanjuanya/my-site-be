const secrets = {
  dbUri: 'mongodb://localhost:27017/my_site'
}

const getSecret = key => secrets[key]

module.exports = getSecret