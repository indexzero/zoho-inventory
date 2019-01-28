const assume = require('assume');
const createClient = require('../index');
const { loadSecrets, assumeApiClient } = require('./helpers');

const { token, organization } = loadSecrets();

describe('createClient', function () {
  it('should be a function', () => {
    assume(createClient).is.a('function');
  });

  it('should include items API client', () => {
    const client = createClient({ token, organization });
    assumeApiClient(client.items);
  });

  it('should include customFields API client', () => {
    const client = createClient({ token, organization });
    assumeApiClient(client.customFields);
  });
});
