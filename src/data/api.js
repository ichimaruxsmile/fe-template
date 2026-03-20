// ─────────────────────────────────────────────────────────
// CryptoScope API Client
// Centralises all API calls and normalises snake_case → camelCase
// ─────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  const json = await res.json()

  if (!res.ok || json.code >= 400) {
    throw new Error(json.error || `Request failed (${res.status})`)
  }

  return json.data
}

// ─── Coins ───────────────────────────────────────────────

function normaliseCoin(c) {
  return {
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    price: c.price,
    change24h: c.change_24h,
    change7d: c.change_7d,
    marketCap: c.market_cap,
    volume: c.volume_24h,
    high24h: c.high_24h,
    low24h: c.low_24h,
    circulatingSupply: c.circulating_supply,
    ath: c.ath,
    logo: c.logo,
    description: c.description,
    links: c.links,
  }
}

/**
 * GET /api/market/coins
 * @param {{ sort?: string, order?: string, limit?: number, q?: string }} params
 */
export async function getCoins(params = {}) {
  const qs = new URLSearchParams()
  if (params.sort) qs.set('sort', params.sort)
  if (params.order) qs.set('order', params.order)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.q) qs.set('q', params.q)

  const query = qs.toString()
  const data = await request(`/api/market/coins${query ? '?' + query : ''}`)

  return {
    coins: data.coins.map(normaliseCoin),
    total: data.total,
  }
}

/**
 * GET /api/market/coins/:id
 */
export async function getCoinDetail(id) {
  const data = await request(`/api/market/coins/${id}`)
  return normaliseCoin(data)
}

/**
 * GET /api/market/kline/:id
 * @param {string} id
 * @param {{ interval?: string, limit?: number }} params
 */
export async function getKline(id, params = {}) {
  const qs = new URLSearchParams()
  if (params.interval) qs.set('interval', params.interval)
  if (params.limit) qs.set('limit', String(params.limit))

  const query = qs.toString()
  return request(`/api/market/kline/${id}${query ? '?' + query : ''}`)
}

// ─── Alerts ──────────────────────────────────────────────

function normaliseAlert(a) {
  return {
    id: a.id,
    coinId: a.coin_id,
    type: a.type,
    value: a.value,
    active: a.active,
    createdAt: a.created_at,
    coinName: a.coin_name,
    coinSymbol: a.coin_symbol,
    currentPrice: a.current_price,
  }
}

/** GET /api/alerts */
export async function getAlerts() {
  const data = await request('/api/alerts')
  return data.map(normaliseAlert)
}

/** POST /api/alerts */
export async function createAlert({ coinId, type, value }) {
  const data = await request('/api/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coin_id: coinId, type, value }),
  })
  return normaliseAlert(data)
}

/** DELETE /api/alerts/:id */
export async function deleteAlert(id) {
  return request(`/api/alerts/${id}`, { method: 'DELETE' })
}

// ─── Portfolio ───────────────────────────────────────────

function normaliseHolding(h) {
  return {
    coinId: h.coin_id,
    name: h.coin_name,
    coin: h.coin_symbol,
    amount: h.amount,
    avgCost: h.avg_cost,
    currentPrice: h.current_price,
    value: h.value,
    cost: h.cost,
    pnl: h.pnl,
    pnlPct: h.pnl_pct,
  }
}

/** GET /api/portfolio */
export async function getPortfolio() {
  const data = await request('/api/portfolio')
  return {
    holdings: data.holdings.map(normaliseHolding),
    summary: {
      totalValue: data.summary.total_value,
      totalCost: data.summary.total_cost,
      totalPnl: data.summary.total_pnl,
      totalPnlPct: data.summary.total_pnl_pct,
    },
  }
}
