const fs = require('fs');
const http = require('http');

http.createServer(function (req, res) {
  console.log('Incoming request');
  fs.readFile(__dirname + '/index.html', function (err, data) {
    if (err) console.log(err);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });

}).listen(8080, function () {
  console.log('Server listening')
});