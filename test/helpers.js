const assume = require('assume');

function demandSecret(key, env) {
  throw new Error(`Missing required config: token. Either:
  1. Update ${key} in ./.devlocal.json
  2. Set ${env} in environment variables
`);
}

function loadSecrets() {
  let devlocal = {};
  const env = {
    token: process.env.ZOHO_APITOKEN,
    organization: process.env.ZOHO_ORGID
  };

  try {
    devlocal = require('../.devlocal.json');
  } catch (ex) {
    /* Ignore errors */
  }

  const secrets = Object.assign(env, devlocal);
  if (!secrets.token) demandSecret('token', 'ZOHO_APITOKEN');
  if (!secrets.organization) demandSecret('organization', 'ZOHO_ORGID');
  return secrets;
}

function assumeApiClient(client) {
  assume(client).is.an('object');
  assume(client.fetch).is.a('asyncFunction');
  assume(client.list).is.a('asyncFunction');
  assume(client.create).is.a('asyncFunction');
  assume(client.get).is.a('asyncFunction');
  assume(client.update).is.a('asyncFunction');
  assume(client.delete).is.a('asyncFunction');
}

module.exports = {
  loadSecrets,
  assumeApiClient
};
