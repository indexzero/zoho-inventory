const assume = require('assume');
const Client = require('../client');

describe('Client', function () {
  it('should be a function', () => {
    assume(Client).is.a('function');
  })
});
