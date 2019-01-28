const Client = require('./client');

module.exports = class CustomFields extends Client {
  constructor(opts) {
    super(Object.assign({}, opts, {
      resource: 'customfields',
      path: 'settings/preferences'
    }));
  }

  /**
   * Lists all of the Custom Fields associated with
   * the specified organization
   *
   * **TODO:** Support pagination
   *
   * @param {Object} [options] Options to handle pagination.
   * @returns {Object} HTTP response body.
   */
  async list(options = {}) {
    const json = await this.fetch('items', options);

    if (!json.preferences_items) return json;
    return {
      code: json.code,
      message: json.message,
      custom_fields: json.preferences_items.custom_fields
    };
  }

  /**
   * Creates the resource with the specified using
   * the `body` content provided.
   * @param  {Object} body HTTP request body; will be form encoded.
   * @returns {Object}      HTTP response body.
   */
  async create(body) {
    const json = await this.fetch('customfields', {
      method: 'POST',
      body
    });

    if (!json || json.code !== 0) return json;
    return {
      code: json.code,
      message: json.message,
      custom_field: json.data
    };
  }

  /**
   * Gets the resource with the specified `id`.
   * @param  {string} id   Resource ID to locate.
   * @returns {Object}      HTTP response body.
   */
  async get(id) {
    return await this.fetch(`customfields/${id}/`);
  }

  /**
   * Updates the resource with the specified `id` using
   * the `body` content provided
   * @param  {string} id   Resource ID to update
   * @param  {Object} body HTTP request body; will be form encoded.
   * @returns {Object}      HTTP response body.
   */
  async update(id, body) {
    return await this.fetch(`customfields/${id}/`, {
      method: 'PUT',
      body
    });
  }

  /**
   * Deletes the resource with the specified `id`.
   * @param  {string} id Resource ID to delete.
   * @returns {Object}    HTTP response body.
   */
  async delete(id) {
    return await this.fetch(`customfields/${id}/`, {
      method: 'DELETE'
    });
  }
};
