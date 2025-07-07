async function update() {
  try {
    // Ambil harga BTC IDR
    const hargaRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr');
    const hargaData = await hargaRes.json();
    const hargaBTC = hargaData.bitcoin.idr;
    document.getElementById('harga').innerText = `💰 Harga BTC: Rp ${hargaBTC.toLocaleString('id-ID')}`;

    // Ambil prediksi harian
    const predRes = await fetch('prediksi.json?' + new Date().getTime());
    const predData = await predRes.json();
    document.getElementById('prediksi').innerText = `📊 Prediksi (${predData.date}): ${predData.prediksi}`;

    // Ambil sinyal beli/jual dari sinyal.json
    const sinyalRes = await fetch('sinyal.json?' + new Date().getTime());
    const sinyal = await sinyalRes.json();
    document.getElementById('signals').innerHTML = `
      <h3>📡 Sinyal Beli/Jual (${sinyal.tanggal})</h3>
      <ul>
        <li>BTC: ${sinyal.BTC}</li>
        <li>ETH: ${sinyal.ETH}</li>
        <li>SOL: ${sinyal.SOL}</li>
        <li>DOG: ${sinyal.DOG}</li>
      </ul>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById('signals').innerText = '⚠️ Gagal memuat data';
  }
}
update();
