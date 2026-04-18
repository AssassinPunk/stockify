async function test() {
  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=Indian+Stock+Market&newsCount=10`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data.news, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
