const fs = require('fs');
const path = require('path');
const assert = require('assert');
const request = require('superagent');
const bundle = require('./bundle');
const CODES = Symbol('codes');
const FILE = Symbol('file');
const PARAMS = Symbol('params');
const OPTIONS = Symbol('options');
const ENDPOINT = 'https://mixpanel.com/api/2.0/jql';

const readFile = filepath => new Promise((resolve, reject) =>
  fs.readFile(filepath, 'utf8', (err, content) =>
    err ? reject(err) : resolve(content.toString())
  )
);

const sendRequest = (secret, script, params) => new Promise((resolve, reject) => {
  params = JSON.stringify(params || {});
  return request
    .post(ENDPOINT)
    .auth(secret)
    .type('form')
    .send({ script, params })
    .accept('application/json')
    .end((err, res) => {
      if (res.body && res.body.error) {
        err = new Error('Mixpanel Error: ' + res.body.error);
        err.status = res.status;
      }
      if (err) {
        return reject(err);
      }
      resolve(res.body);
    });
});

class Query {
  constructor(client) {
    this.client = client;
    this[CODES] = null;
    this[FILE] = null;
    this[PARAMS] = {};
    this[OPTIONS] = {
      basedir: process.cwd()
    };
  }

  codes(codes) {
    this[CODES] = codes;
    return this;
  }

  file(filepath) {
    filepath = path.resolve(filepath);
    this[FILE] = filepath;
    return this;
  }

  params(params) {
    Object.assign(this[PARAMS], params || {});
    return this;
  }

  param() {
    return this.params.apply(this, arguments);
  }

  options(options) {
    Object.assign(this[OPTIONS], options || {});
    return this;
  }

  option() {
    return this.options.apply(this, arguments);
  }

  generateScript() {
    return (this[CODES]
      ? Promise.resolve(this[CODES])
      : this[FILE]
      ? readFile(this[FILE])
      : Promise.reject('Please use `.file` or `.codes` to specify JQL codes'))
      .then(script => bundle(script, this[OPTIONS]));
  }

  send() {
    const params = this[PARAMS];
    const secret = this.client.secret;
    return this.generateScript().then(script => sendRequest(secret, script, params));
  }
}

module.exports = Query;
