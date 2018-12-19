const crossFetch = require('cross-fetch');
const diagnostics = require('diagnostics');
const { URLSearchParams } = require('url');

/**
 * Generic fetch-based HTTP client that assumes all of the
 * conventions extant in the Zoho Inventory API.
 * @type {Client}
 */
module.exports = class Client {
  constructor({ resource, organization, token, origin }) {
    this.resource = resource;
    this.origin = origin || 'https://inventory.zoho.com/api/v1';
    this.url = `${this.origin.replace(/\/$/, '')}/${resource}/`;
    this.debug = diagnostics(`zoho:${this.resource}`);

    this.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    this.query = {
      organization_id: organization,
      authtoken: token
    };
  }

  /**
   * Performs a generic HTTP fetch using assumptions extant in the
   * Zoho Inventory API:
   *
   * - Default HTTP headers
   * - Default query string parameters
   * - Form encoding any body as a "JSONString" parameter
   *
   * @param  {[type]} path              HTTP path to request against
   * @param  {String} options.method    HTTP method
   * @param  {[type]} [options.query]   URL query string
   * @param  {Object} [options.headers] Additional HTTP headers
   * @param  {Object} [body]            HTTP request body; will be form encoded.
   * @return {Object} HTTP response body.
   */
  async fetch(path, { method = 'GET', query, headers = {}, body } = {}) {
    const qs = new URLSearchParams(Object.assign({}, query, this.query));
    const target = `${this.url}${path}`;

    this.debug(method, target, { query, body });

    const response = await crossFetch(`${target}?${qs.toString()}`, {
      method,
      headers: Object.assign({}, this.headers, headers),
      body: body && `JSONString=${JSON.stringify(body)}`
    });

    this.debug(response.status, response.statusText, { ok: response.ok });

    return await response.json();
  }

  /**
   * Lists all of the resource associated with this instance.
   *
   * **TODO:** Support pagination
   *
   * @return {Object} HTTP response body.
   */
  async list() {
    return await this.fetch('');
  }

  /**
   * Creates the resource with the specified using
   * the `body` content provided.
   * @param  {Object} body HTTP request body; will be form encoded.
   * @return {Object}      HTTP response body.
   */
  async create(body) {
    return await this.fetch('', {
      method: 'POST',
      body
    });
  }

  /**
   * Gets the resource with the specified `id`.
   * @param  {string} id   Resource ID to locate.
   * @return {Object}      HTTP response body.
   */
  async get(id) {
    return await this.fetch(`${id}/`);
  }

  /**
   * Updates the resource with the specified `id` using
   * the `body` content provided
   * @param  {string} id   Resource ID to update
   * @param  {Object} body HTTP request body; will be form encoded.
   * @return {Object}      HTTP response body.
   */
  async update(id, body) {
    return await this.fetch(`${id}/`, {
      method: 'PUT',
      body
    });
  }

  /**
   * Deletes the resource with the specified `id`.
   * @param  {string} id Resource ID to delete.
   * @return {Object}    HTTP response body.
   */
  async delete(id) {
    return await this.fetch(`${id}/`, {
      method: 'DELETE'
    });
  }
}
