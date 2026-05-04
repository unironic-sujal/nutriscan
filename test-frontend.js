const https = require('https');

https.get('https://nutriscan-bay.vercel.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      const jsUrl = 'https://nutriscan-bay.vercel.app' + match[1];
      console.log('Found JS:', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', (chunk) => { jsData += chunk; });
        jsRes.on('end', () => {
          // Look for the API_BASE_URL which might be compiled
          // "http://localhost:5000/api" or "https://nutriscan-pw9y.vercel.app/api"
          if (jsData.includes('nutriscan-pw9y.vercel.app')) {
            console.log('SUCCESS: JS bundle contains the correct Vercel API URL.');
          } else if (jsData.includes('http://localhost:5000/api')) {
            console.log('FAIL: JS bundle still contains localhost:5000/api. The Vercel env var was not applied or redeployed correctly.');
          } else {
            console.log('Could not find API URL in JS bundle.');
          }
        });
      });
    } else {
      console.log('Could not find JS bundle in HTML.');
    }
  });
}).on('error', (err) => {
  console.error(err);
});
