const apikey = "656efcd658db41028d1346cc9e07d5f7";
async function test() {
  const url = `https://api.twelvedata.com/quote?symbol=INDIAVIX,VIX,^INDIAVIX&apikey=${apikey}`;
  const res = await fetch(url);
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
test();
