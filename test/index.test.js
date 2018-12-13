const assume = require('assume');
const createClient = require('../index');

describe('createClient', function () {
  it('should be a function', () => {
    assume(createClient).is.a('function');
  })
});
