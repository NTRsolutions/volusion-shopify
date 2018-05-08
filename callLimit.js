var stopcock = require('stopcock');

var get = stopcock(i=>{
  console.log(`${i} - ${new Date().toISOString()}`)
}, {limit: 2, interval: 1000, bucketSize: 2});

for(i=0;i<50;i++) {
  get(i);
}
