mixpanel-jql
============

Mixpanel JQL Client

```javascript
const Client = require('mixpanel-jql');
const client = new Client('mixpanel secret here');

// query data from mixpanel
client.query()
  .codes('function main() {...}') // or .file('./filepath')
  .params({
    //...
  })
  .send()
  .then(result => console.log(result))
  .catch(err => console.log(err));

// generate script
client.query()
  .codes('function main() {...}') // or .file('./filepath')
  .params({
    //...
  })
  .generateScript()
  .then(script => console.log(script));
```
