const Client = require('./client');

module.exports = class Items extends Client {
  constructor(opts) {
    super(Object.assign({}, opts, { resource: 'items' }));
  }
}
