async function update() {
  let res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  let data = await res.json();
  document.getElementById('harga').innerText = `💰 Harga BTC: US$ ${data.bitcoin.usd}`;

  let pr = await fetch('prediksi.json?' + new Date().getTime());
  let pj = await pr.json();
  document.getElementById('prediksi').innerText = `📊 Prediksi: ${pj.date} → ${pj.prediksi}`;

  let hist = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
  let histJ = await hist.json();
  let ctx = document.getElementById('chart').getContext('2d');
  let labels = histJ.prices.map(p => new Date(p[0]).toLocaleDateString());
  let vals = histJ.prices.map(p => p[1]);
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'BTC 7 hari', data: vals, borderColor: '#f7931a', fill: false }] }
  });
}
update();
