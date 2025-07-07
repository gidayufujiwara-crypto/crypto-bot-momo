const axios = require("axios");
const { EMA, RSI } = require("technicalindicators");
const fs = require("fs");

const coins = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  dogecoin: "DOG"
};

function getSignal(prices, rsi, ema21, ema34) {
  const len = prices.length;
  const prevCross = ema21[len - 2] - ema34[len - 2];
  const nowCross = ema21[len - 1] - ema34[len - 1];
  const rsiNow = rsi.at(-1);
  if (prevCross < 0 && nowCross > 0 && rsiNow > 50) return "🔔 BUY";
  if (prevCross > 0 && nowCross < 0 && rsiNow < 50) return "⚠️ SELL";
  return "—";
}

(async () => {
  const result = {
    tanggal: new Date().toISOString().split("T")[0]
  };

  for (const [id, sym] of Object.entries(coins)) {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: { vs_currency: "usd", days: 30 }
      });
      const prices = res.data.prices.map(p => p[1]);
      const ema21 = EMA.calculate({ period: 21, values: prices });
      const ema34 = EMA.calculate({ period: 34, values: prices });
      const rsi = RSI.calculate({ period: 14, values: prices });
      result[sym] = getSignal(prices, rsi, ema21, ema34);
    } catch (e) {
      result[sym] = "⛔ ERROR";
    }
  }

  fs.writeFileSync("sinyal.json", JSON.stringify(result, null, 2));
})();
