const https = require('https');

const options = {
  hostname: 'nutriscan-pw9y.vercel.app',
  port: 443,
  path: '/api/search?q=cola',
  method: 'GET',
  headers: {
    'Origin': 'https://nutriscan-bay.vercel.app',
    'Accept': 'application/json, text/plain, */*'
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(`BODY: ${data}`); });
});
req.on('error', (e) => { console.error(`problem with request: ${e.message}`); });
req.end();
