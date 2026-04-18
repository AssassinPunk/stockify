const fs = require('fs');
const apikey = "656efcd658db41028d1346cc9e07d5f7";
async function test() {
  const url = `https://api.twelvedata.com/symbol_search?symbol=NIFTY`;
  const res = await fetch(url);
  const json = await res.json();
  fs.writeFileSync('tmp/out.json', JSON.stringify(json, null, 2));
}
test();
