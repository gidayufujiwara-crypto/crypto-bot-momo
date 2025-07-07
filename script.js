async function update() {
  // Ambil harga saat ini
  const hargaRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const hargaData = await hargaRes.json();
  const hargaBTC = hargaData.bitcoin.usd;
  document.getElementById('harga').innerText = `💰 Harga BTC: US$ ${hargaBTC}`;

  // Ambil prediksi
  const predRes = await fetch('prediksi.json?' + new Date().getTime());
  const predData = await predRes.json();
  document.getElementById('prediksi').innerText = `📊 Prediksi (${predData.date}): ${predData.prediksi}`;

  // Ambil data historis 30 hari
  const histRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
  const histData = await histRes.json();
  const prices = histData.prices.map(p => p[1]);
  const times = histData.prices.map(p => new Date(p[0]).toLocaleDateString());
  const volumes = histData.total_volumes.map(v => v[1]);

  // Tampilkan grafik
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'Harga BTC 30 Hari',
        data: prices,
        borderColor: '#f7931a',
        fill: false
      }]
    },
    options: {
      responsive: true
    }
  });

  // Hitung indikator teknikal
  const EMA = technicalindicators.EMA;
  const RSI = technicalindicators.RSI;
  const MACD = technicalindicators.MACD;

  const ema21 = EMA.calculate({period:21, values: prices});
  const ema34 = EMA.calculate({period:34, values: prices});
  const ema90 = EMA.calculate({period:90, values: prices});
  const rsi14 = RSI.calculate({period:14, values: prices});
  const macd = MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

  // Ambil nilai terakhir
  const latestEma21 = ema21.at(-1)?.toFixed(2) ?? 'N/A';
  const latestEma34 = ema34.at(-1)?.toFixed(2) ?? 'N/A';
  const latestEma90 = ema90.at(-1)?.toFixed(2) ?? 'N/A';
  const latestRSI = rsi14.at(-1)?.toFixed(2) ?? 'N/A';
  const latestMACD = macd.at(-1) ?? { MACD: 0, signal: 0 };
  const latestVol = volumes.at(-1)?.toLocaleString() ?? 'N/A';

  // Tampilkan indikator
  document.getElementById('indikator').innerHTML = `
    <h3>📈 Indikator Teknikal</h3>
    <ul>
      <li>EMA21: ${latestEma21}</li>
      <li>EMA34: ${latestEma34}</li>
      <li>EMA90: ${latestEma90}</li>
      <li>RSI(14): ${latestRSI}</li>
      <li>Volume: ${latestVol}</li>
      <li>MACD: ${latestMACD.MACD.toFixed(2)} (Signal: ${latestMACD.signal.toFixed(2)})</li>
    </ul>
  `;
}
update();
