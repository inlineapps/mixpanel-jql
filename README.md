mixpanel-jql
============

Mixpanel JQL Client

```javascript
const Client = require('mixpanel-jql');
const client = new Client('mixpanel secret here');

client.query()
  .codes('function main() {...}') // or .file('./filepath')
  .params({
    //...
  })
  .end()
  .catch(err => console.log(err))
  .then(result => console.log(result));
```
