// 模拟数据 — 后续会替换为真实 API 调用（通过 Cloudflare Workers → AWS Lambda）
export const MOCK_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, price: 67234.56, change1h: 0.12, change24h: 2.34, change7d: -1.05, volume: 28_400_000_000, marketCap: 1_320_000_000_000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2, price: 3456.78, change1h: -0.08, change24h: 1.56, change7d: 3.21, volume: 15_200_000_000, marketCap: 415_000_000_000 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', rank: 5, price: 178.92, change1h: 0.45, change24h: -3.12, change7d: 5.67, volume: 4_800_000_000, marketCap: 82_000_000_000 },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', rank: 4, price: 612.34, change1h: 0.03, change24h: 0.89, change7d: -0.42, volume: 1_900_000_000, marketCap: 94_000_000_000 },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', rank: 3, price: 2.34, change1h: -0.21, change24h: -1.45, change7d: 8.90, volume: 6_700_000_000, marketCap: 134_000_000_000 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', rank: 8, price: 0.72, change1h: 0.56, change24h: 4.23, change7d: -2.11, volume: 890_000_000, marketCap: 25_000_000_000 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', rank: 7, price: 0.168, change1h: -0.34, change24h: -2.78, change7d: 1.34, volume: 1_200_000_000, marketCap: 24_000_000_000 },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', rank: 12, price: 38.45, change1h: 0.89, change24h: 5.67, change7d: -4.32, volume: 780_000_000, marketCap: 14_500_000_000 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', rank: 14, price: 7.89, change1h: -0.15, change24h: 1.23, change7d: -0.87, volume: 420_000_000, marketCap: 10_800_000_000 },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', rank: 13, price: 18.56, change1h: 0.33, change24h: -0.92, change7d: 6.45, volume: 650_000_000, marketCap: 11_200_000_000 },
]

export const MOCK_ALERTS = [
  { id: 1, coin: 'BTC', condition: '价格突破 $70,000', type: '价格预警', status: 'active', triggered: 0, createdAt: '2024-03-15' },
  { id: 2, coin: 'ETH', condition: 'RSI > 70（超买）', type: 'RSI预警', status: 'active', triggered: 2, createdAt: '2024-03-14' },
  { id: 3, coin: 'SOL', condition: '24h 跌幅超过 10%', type: '跌幅预警', status: 'triggered', triggered: 1, createdAt: '2024-03-10' },
  { id: 4, coin: 'BTC', condition: 'MACD 金叉', type: 'MACD预警', status: 'paused', triggered: 5, createdAt: '2024-03-01' },
]

export const MOCK_PORTFOLIO = [
  { coin: 'BTC', name: 'Bitcoin', amount: 0.15, avgCost: 62000, currentPrice: 67234.56 },
  { coin: 'ETH', name: 'Ethereum', amount: 2.5, avgCost: 3200, currentPrice: 3456.78 },
  { coin: 'SOL', name: 'Solana', amount: 20, avgCost: 150, currentPrice: 178.92 },
]

export const MARKET_STATS = {
  totalMarketCap: '$2.45T',
  volume24h: '$89.2B',
  btcDominance: '52.3%',
  activeCryptos: '2,847',
}

// 格式化工具
export function formatPrice(n) {
  if (n >= 1) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return '$' + n.toFixed(4)
}

export function formatLargeNumber(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  return '$' + n.toLocaleString()
}

export function formatChange(n) {
  const sign = n >= 0 ? '+' : ''
  return sign + n.toFixed(2) + '%'
}
