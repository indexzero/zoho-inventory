const crossFetch = require('cross-fetch');
const { URLSearchParams } = require('url');

module.exports = class Client {
  constructor({ resource, organization, token, origin }) {
    this.resource = resource;
    this.origin = origin || 'https://inventory.zoho.com/api/v1';
    this.url = `${origin.replace(/\/$/, '')}/${resource}/`;

    this.headers = { 'Content-Type': 'application/json' };
    this.query = {
      organization_id: organization,
      authtoken: token
    };
  }

  async fetch(path, { method = 'GET', query, headers, body }) {
    const qs = new URLSearchParams(Object.assign({}, query, this.query));
    const target = `${this.url}${path}?${qs.toString()}`;

    const response = await crossFetch(target, {
      method,
      headers: Object.assign({}, this.headers, headers || {}),
      body: body
    });

    return response;
  }

  async create(body) {
    return await this.fetch('', {
      method: 'POST',
      body
    })
  }

  async get(id) {
    return await this.fetch(`${id}/`);
  }

  async update(id, body) {
    return await this.fetch(`${id}/`, {
      method: 'PUT',
      body
    });
  }

  async delete(id) {
    return await this.fetch(`${id}/` {
      method: 'DELETE'
    });
  }
}
