async function update() {
  // Ambil harga BTC sekarang
  const hargaRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const hargaData = await hargaRes.json();
  const hargaBTC = hargaData.bitcoin.usd;
  document.getElementById('harga').innerText = `💰 Harga BTC: US$ ${hargaBTC}`;

  // Ambil prediksi dari prediksi.json
  const predRes = await fetch('prediksi.json?' + new Date().getTime());
  const predData = await predRes.json();
  document.getElementById('prediksi').innerText = `📊 Prediksi (${predData.date}): ${predData.prediksi}`;

  // ====== SINYAL TEKNIKAL UNTUK BTC, ETH, SOL, DOGE ======

  // Fungsi untuk deteksi sinyal
  function getSignal(prices, rsi, emaShort, emaLong) {
    const len = prices.length;
    if (emaShort[len - 2] && emaLong[len - 2]) {
      const prevCross = emaShort[len - 2] - emaLong[len - 2];
      const nowCross = emaShort.at(-1) - emaLong.at(-1);
      const rsiNow = rsi.at(-1);
      if (prevCross < 0 && nowCross > 0 && rsiNow > 50) return '🔔 BUY';
      if (prevCross > 0 && nowCross < 0 && rsiNow < 50) return '⚠️ SELL';
    }
    return '—';
  }

  // Siapkan coin list
  const coins = ['bitcoin', 'ethereum', 'solana', 'dogecoin'];
  const signals = {};
  const EMA = technicalindicators.EMA;
  const RSI = technicalindicators.RSI;

  // Loop tiap coin
  for (let coin of coins) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30`);
    const hist = await res.json();
    const prices = hist.prices.map(p => p[1]);

    const ema21 = EMA.calculate({ period: 21, values: prices });
    const ema34 = EMA.calculate({ period: 34, values: prices });
    const rsi14 = RSI.calculate({ period: 14, values: prices });

    signals[coin] = getSignal(prices, rsi14, ema21, ema34);
  }

  // Tampilkan sinyal
  let html = '<h3>📡 Sinyal Beli/Jual Otomatis</h3><ul>';
  for (let coin of coins) {
    const label = coin === 'bitcoin' ? 'BTC' :
                  coin === 'ethereum' ? 'ETH' :
                  coin === 'solana' ? 'SOL' : 'DOG';
    html += `<li>${label}: ${signals[coin]}</li>`;
  }
  html += '</ul>';
  document.getElementById('signals').innerHTML = html;
}

update();
