const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
http.createServer((req,res) => {
  const requested = decodeURIComponent(req.url.split('?')[0]);
  const file = requested === '/' ? '/index.html' : requested;
  const absolute = path.resolve(root, '.' + file);
  if (absolute.startsWith(root) && fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
    res.writeHead(200, {'Content-Type': types[path.extname(absolute)] || 'application/octet-stream'});
    fs.createReadStream(absolute).pipe(res); return;
  }
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
  fs.createReadStream(path.join(root,'index.html')).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log('Pharus site at http://localhost:3000'));
