const fs = require('fs');
const FormData = require('form-data');
const Client = require('./client');

module.exports = class Items extends Client {
  constructor(opts) {
    super(Object.assign({}, opts, { resource: 'items' }));
  }

  /**
   * Returns the properly form encoded value for the `body`
   * contents provided.
   *
   * Overridden in derived clients to handle bespoke / inconsistent
   * form parameters (such as "image" in /items).
   *
   * @param  {Object} body HTTP request body.
   * @return {string} Simple `JSONString=` default expected by Zoho.
   */
  formEncode(body) {
    if (!body.image) {
      return super.formEncode(body);
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(body.image));
    form.append('JSONString', JSON.stringify(
      Object.assign({}, body, { image: undefined })
    ));

    return form;
  }
};
