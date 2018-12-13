const Items = require('./items');

module.exports = function createClient(opts) {
  const { token, organization } = opts;
  if (!token) throw new Error(`Missing 'token' in options`);
  if (!organization) throw new Error(`Missing 'token' in organization`);

  return {
    items: new Items(opts)
  }
};
