async function test() {
  try {
    const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EINDIAVIX?range=1d&interval=1d");
    const json = await res.json();
    console.log(JSON.stringify(json.chart.result[0].meta, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
