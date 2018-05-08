var fs = require('fs');

var wstream = fs.createWriteStream('err.json');
wstream.write("err message", err=> console.log(err));

for(i=0;i<11;i++) {
  fs.appendFile('log.json', i+'\n', (err) => {
    if (err) throw err;
  })
}
