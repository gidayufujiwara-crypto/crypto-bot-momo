const axios = require("axios");
const { EMA, RSI } = require("technicalindicators");
const fs = require("fs");

const coins = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  dogecoin: "DOG"
};

function getSignal(prices, rsi, emaShort, emaLong) {
  const len = prices.length;
  if (emaShort[len - 2] && emaLong[len - 2]) {
    const prevCross = emaShort[len - 2] - emaLong[len - 2];
    const nowCross = emaShort.at(-1) - emaLong.at(-1);
    const rsiNow = rsi.at(-1);
    if (prevCross < 0 && nowCross > 0 && rsiNow > 50) return "🔔 BUY";
    if (prevCross > 0 && nowCross < 0 && rsiNow < 50) return "⚠️ SELL";
  }
  return "—";
}

(async () => {
  const result = {
    tanggal: new Date().toISOString().split("T")[0],
  };

  for (const [id, symbol] of Object.entries(coins)) {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        { params: { vs_currency: "usd", days: 30 } }
      );
      const prices = res.data.prices.map((x) => x[1]);
      const rsi = RSI.calculate({ period: 14, values: prices });
      const ema21 = EMA.calculate({ period: 21, values: prices });
      const ema34 = EMA.calculate({ period: 34, values: prices });

      result[symbol] = getSignal(prices, rsi, ema21, ema34);
    } catch (e) {
      console.error(`Gagal ambil data ${symbol}:`, e.message);
      result[symbol] = "⛔ ERROR";
    }
  }

  fs.writeFileSync("sinyal.json", JSON.stringify(result, null, 2));
})();
