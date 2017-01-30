const path = require('path');
const through2 = require('through2');
const browserify = require('browserify');

module.exports = (source, options) => {
  options.standalone = 'jqlScript';
  const wrapperFile = path.resolve(__dirname, 'wrapper.js');
  const emptyFile = path.resolve(__dirname, 'empty.js');
  return new Promise((resolve, reject) => {
    browserify(wrapperFile, options)
      .require(emptyFile, { expose: '@@script' })
      .transform(file => {
        if (file !== emptyFile) {
          return through2();
        }
        return through2(() => {}, function (cb) {
          this.push(wrapSource(source));
          cb();
        });
      })
      .bundle((err, codes) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(wrapBundle(codes.toString()));
      });
  });
};

function wrapSource(source) {
  return source + '\n;\nmodule.exports = main;';
}

function wrapBundle(codes) {
  return `
    ${codes}
    ;function main() {
      return jqlScript();
    }
  `;
}
