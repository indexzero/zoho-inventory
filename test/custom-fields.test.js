/* eslint camelcase: 0 */
const assume = require('assume');
const CustomFields = require('../custom-fields');
const { loadSecrets, assumeApiClient } = require('./helpers');

const { token, organization } = loadSecrets();

describe('Custom Fields', function () {
  this.timeout(60 * 1000);

  it('should be a function', () => {
    assume(CustomFields).is.a('function');
  });

  it('should construct', () => {
    const customFields = new CustomFields({ token, organization });
    assumeApiClient(customFields);
  });

  describe('/settings/preferences/customfields (HTTP API)', () => {
    const active = [];
    let customFields;

    before(() => {
      customFields = new CustomFields({ token, organization });
    });

    it('POST /settings/preferences/customfields creates a Custom Field', async () => {
      const expected = {
        entity: 'item',
        show_on_pdf: false,
        label: 'text-field-test',
        data_type: 'string',
        is_basecurrency_amount: true,
        is_mandatory: true,
        pii_type: 'non_pii'
      };

      const body = await customFields.create(expected);

      assume(body.code).equals(0);
      assume(body.message).is.a('string');

      const { custom_field } = body;
      assume(custom_field).is.an('object');
      assume(custom_field.customfield_id).is.a('string');
      assume(custom_field.entity).equals(expected.entity);
      assume(custom_field.show_on_pdf).equals(expected.show_on_pdf);
      assume(custom_field.label).equals(expected.label);
      assume(custom_field.data_type).equals(expected.data_type);
      assume(custom_field.is_mandatory).equals(expected.is_mandatory);
      assume(custom_field.pii_type).equals(expected.pii_type);

      // Add to the set of active fields in this suite
      active.push(custom_field);
    });


    it('GET /settings/preferences/items lists Custom Fields', async () => {
      const body = await customFields.list();

      assume(body).is.an('object');
      assume(body.code).equals(0);
      assume(body.message).equals('success');
      assume(body.custom_fields).is.an('array');
      assume(body.custom_fields.length).equals(1);
    });

    it('DELETE /settings/preferences/customfields/:id removes a field', async () => {
      const body = await customFields.delete(active[0].customfield_id);

      assume(body).is.an('object');
      assume(body.code).equals(0);
      assume(body.message).equals('Custom Field has been deleted.');
    });
  });
});
