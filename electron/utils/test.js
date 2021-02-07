var compareVersions = require('compare-versions');

var ans = compareVersions('10.1.8', '10.0.4', '>');

console.log(Boolean(ans));