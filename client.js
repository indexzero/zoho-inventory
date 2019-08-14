const crossFetch = require('cross-fetch');
const diagnostics = require('diagnostics');
const { URLSearchParams } = require('url');
const FormData = require('form-data');
const mapLimit = require('async/mapLimit');

/**
 * Generic fetch-based HTTP client that assumes all of the
 * conventions extant in the Zoho Inventory API.
 * @type {Client}
 */
module.exports = class Client {
  constructor({ resource, path, organization, token, origin }) {
    this.resource = resource;
    this.path = path || resource;
    this.origin = origin || 'https://inventory.zoho.com/api/v1';
    this.url = `${this.origin.replace(/\/$/, '')}/${this.path}/`;
    this.debug = diagnostics(`zoho:${this.resource}`);

    this.headers = { 'content-type': 'application/x-www-form-urlencoded' };
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
   * @param  {string} path              HTTP path to request against
   * @param  {String} [options.method]  HTTP method
   * @param  {Object} [options.query]   URL query string
   * @param  {Object} [options.headers] Additional HTTP headers
   * @param  {Object} [body]            HTTP request body; will be form encoded.
   * @returns {Object} HTTP response body.
   */
  async fetch(path, { method = 'GET', query, headers = {}, body } = {}) {
    const qs = new URLSearchParams(Object.assign({}, query, this.query));
    const target = `${this.url}${path}`;

    const form = body && this.formEncode(body);
    const details = {
      method,
      headers: Object.assign({},
        this.headers,
        form && form.getHeaders() || {},
        headers
      ),
      body: form
    };

    this.debug(method, target, { query, body, headers: details.headers });
    const response = await crossFetch(`${target}?${qs.toString()}`, details);

    this.debug(response.status, response.statusText, { ok: response.ok });
    return await response.json();
  }

  /**
   * Returns the properly form encoded value for the `body`
   * contents provided.
   *
   * Overridden in derived clients to handle bespoke / inconsistent
   * form parameters (such as "image" in /items).
   *
   * @param  {Object} body HTTP request body.
   * @returns {string} Simple `JSONString=` default expected by Zoho.
   */
  formEncode(body) {
    const form = new FormData();
    form.append('JSONString', JSON.stringify(body));
    return form;
  }

  /**
   * Lists all of the resource associated with this instance.
   *
   * @param {Object} [options] Options to handle pagination.
   * @returns {Object} HTTP response body.
   */
  async list(options = {}) {
    return await this.fetch('', options);
  }

  /**
   * List all pages of of the resource associated with this instance
   *
   * @param {Object} [options] Options to handle pagination.
   * @returns {Array} List of all resource pages within Zoho Inventory.
   */
  async listAll(options = {}) {
    const meta = await this.fetch('', {
      query: { response_option: 2 },
      ...options
    });

    if (!meta || !meta.page_context || !meta.page_context.total_pages) {
      throw new Error('Unable to determine item pages.');
    }

    const length = meta.page_context.total_pages;
    const pages = Array.from({ length }, (v, k) => k + 1);

    const set = await mapLimit(pages, 3, async (page) => {
      return await this.list({
        query: {
          per_page: 200,
          page
        },
        ...options
      });
    });

    //
    // Remark (indexzero): this is brittle if any page fetch errors.
    //
    return set.reduce((acc, res) => {
      return acc.concat(res.items);
    }, []);
  }

  /**
   * Creates the resource with the specified using
   * the `body` content provided.
   * @param  {Object} body HTTP request body; will be form encoded.
   * @returns {Object}     HTTP response body.
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
   * @returns {Object}     HTTP response body.
   */
  async get(id) {
    return await this.fetch(`${id}/`);
  }

  /**
   * Updates the resource with the specified `id` using
   * the `body` content provided
   * @param  {string} id   Resource ID to update
   * @param  {Object} body HTTP request body; will be form encoded.
   * @returns {Object}     HTTP response body.
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
   * @returns {Object}   HTTP response body.
   */
  async delete(id) {
    return await this.fetch(`${id}/`, {
      method: 'DELETE'
    });
  }
};
