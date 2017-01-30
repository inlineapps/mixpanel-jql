const assert = require('assert');
const Query = require('./query');
const SECRET = Symbol('secret');

class Client {
  constructor(secret) {
    assert(secret, 'Mixpanel secret is required as the first parameter.');
    this[SECRET] = secret;
  }

  get secret() {
    return this[SECRET];
  }

  query() {
    return new Query(this);
  }
}

module.exports = Client;
