const assume = require('assume');
const Items = require('../items');

describe('Items', function () {
  it('should be a function', () => {
    assume(Items).is.a('function');
  })
});
