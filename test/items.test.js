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
    const active = [];
    let items;

    before(() => {
      items = new Items({ token, organization });
    });

    it('POST /items creates an item', async () => {
      const expected = {
        name: 'Test Book',
        unit: 'pcs',
        rate: 10,
        sku: 'TESTBOOK1',
        purchase_rate: 2,
        item_type: 'sales_and_purchases',
        description: 'There are many books, but this one tests POST /items'
      };

      const body = await items.create(expected);

      assume(body.code).equals(0);
      assume(body.message).is.a('string');

      const { item } = body;
      assume(item).is.an('object');
      assume(item.name).equals(expected.name);
      assume(item.unit).equals(expected.unit);
      assume(item.rate).equals(expected.rate);
      assume(item.sku).equals(expected.sku);
      assume(item.purchase_rate).equals(expected.purchase_rate);
      assume(item.item_type).equals(expected.item_type);
      assume(item.description).equals(expected.description);

      // Add to the set of active items in this suite
      active.push(item);
    });

    it('DELETE /items/:id deletes an item', async () => {
      const expected = active.pop();
      const body = await items.delete(expected.item_id);

      assume(body.code).equals(0);
      assume(body.message).is.a('string');
    });

    it('GET /items lists items', async () => {
      const body = await items.list();

      assume(body).is.an('object');
      assume(body.message).equals('success');
      assume(body.items).is.an('array');
      assume(body.page_context).is.an('object');
    });
  });
});
