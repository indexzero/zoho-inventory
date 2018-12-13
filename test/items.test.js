const assume = require('assume');
const Items = require('../items');
const { loadSecrets } = require('./helpers');

const { token, organization } = loadSecrets();

describe('Items', function () {
  it('should be a function', () => {
    assume(Items).is.a('function');
  });

  it('should construct', () => {
    const items = new Items({ token, organization });

    assume(items).is.an('object');
    assume(items.fetch).is.a('asyncFunction');
    assume(items.list).is.a('asyncFunction');
    assume(items.create).is.a('asyncFunction');
    assume(items.get).is.a('asyncFunction');
    assume(items.update).is.a('asyncFunction');
    assume(items.delete).is.a('asyncFunction');
  });

  describe('Items HTTP API', () => {
    let items
    before(() => {
      items = new Items({ token, organization });
    });

    it('GET /items', async () => {
      const body = await items.list();

      assume(body).is.an('object');
      assume(body.message).equals('success');
      assume(body.items).is.an('array');
      assume(body.page_context).is.an('object');
    });
  });
});
