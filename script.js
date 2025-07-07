async function update() {
  try {
    const hargaRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const hargaData = await hargaRes.json();
    const hargaBTC = hargaData.bitcoin.usd;
    document.getElementById('harga').innerText = `💰 Harga BTC: $${hargaBTC.toLocaleString('en-US')}`;

    const sinyalRes = await fetch('sinyal.json?' + new Date().getTime());
    const data = await sinyalRes.json();
    document.getElementById('signals').innerHTML = `
      <h3>📡 Sinyal Beli/Jual (${data.tanggal})</h3>
      <ul>
        <li>BTC: ${data.BTC}</li>
        <li>ETH: ${data.ETH}</li>
        <li>SOL: ${data.SOL}</li>
        <li>DOG: ${data.DOG}</li>
      </ul>
    `;
  } catch (e) {
    document.getElementById('signals').innerText = '⚠️ Gagal memuat data sinyal.';
  }
}
update();
