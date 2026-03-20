import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCoinDetail, getKline } from '../data/api'
import { formatPrice, formatLargeNumber, formatChange } from '../data/mock'

const INTERVALS = [
  { key: '1m',  label: '1分' },
  { key: '5m',  label: '5分' },
  { key: '15m', label: '15分' },
  { key: '1h',  label: '1时' },
  { key: '4h',  label: '4时' },
  { key: '1d',  label: '日' },
  { key: '1w',  label: '周' },
]

// ─── Canvas K-line renderer ─────────────────────────────
function drawKline(canvas, klines) {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const W = rect.width
  const H = rect.height
  const PAD_TOP = 16
  const PAD_BOTTOM = 28
  const PAD_LEFT = 2
  const PAD_RIGHT = 60
  const chartW = W - PAD_LEFT - PAD_RIGHT
  const chartH = H - PAD_TOP - PAD_BOTTOM

  ctx.clearRect(0, 0, W, H)

  if (!klines || klines.length === 0) return

  // Price range
  const allHigh = klines.map((k) => k.high)
  const allLow = klines.map((k) => k.low)
  const maxPrice = Math.max(...allHigh)
  const minPrice = Math.min(...allLow)
  const range = maxPrice - minPrice || 1

  const toY = (price) => PAD_TOP + (1 - (price - minPrice) / range) * chartH
  const candleWidth = Math.max(1, (chartW / klines.length) * 0.7)
  const gap = chartW / klines.length

  // Grid lines + price labels
  const gridLines = 5
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '10px monospace'
  ctx.textAlign = 'left'
  for (let i = 0; i <= gridLines; i++) {
    const price = minPrice + (range * i) / gridLines
    const y = toY(price)
    ctx.beginPath()
    ctx.moveTo(PAD_LEFT, y)
    ctx.lineTo(W - PAD_RIGHT, y)
    ctx.stroke()
    const label = price >= 1 ? price.toFixed(2) : price.toFixed(4)
    ctx.fillText(label, W - PAD_RIGHT + 6, y + 3)
  }

  // Date labels along the bottom
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.textAlign = 'center'
  const labelStep = Math.max(1, Math.floor(klines.length / 6))
  klines.forEach((k, i) => {
    if (i % labelStep !== 0) return
    const x = PAD_LEFT + i * gap + gap / 2
    const d = new Date(k.time)
    const label = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
    ctx.fillText(label, x, H - 6)
  })

  // Candles
  klines.forEach((k, i) => {
    const x = PAD_LEFT + i * gap + gap / 2
    const isUp = k.close >= k.open
    const color = isUp ? '#22c55e' : '#ef4444'

    // Wick
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, toY(k.high))
    ctx.lineTo(x, toY(k.low))
    ctx.stroke()

    // Body
    const top = toY(Math.max(k.open, k.close))
    const bot = toY(Math.min(k.open, k.close))
    const bodyH = Math.max(1, bot - top)
    ctx.fillStyle = color
    ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH)
  })
}

// ─── KlineChart component ────────────────────────────────
function KlineChart({ coinId }) {
  const canvasRef = useRef(null)
  const [interval, setInterval_] = useState('1d')
  const [klines, setKlines] = useState([])
  const [klineLoading, setKlineLoading] = useState(false)

  // Fetch kline data when coin or interval changes
  useEffect(() => {
    setKlineLoading(true)
    getKline(coinId, { interval, limit: 60 })
      .then((data) => setKlines(data.klines))
      .catch(() => setKlines([]))
      .finally(() => setKlineLoading(false))
  }, [coinId, interval])

  // Draw on canvas whenever data changes or window resizes
  const draw = useCallback(() => {
    if (canvasRef.current && klines.length > 0) {
      drawKline(canvasRef.current, klines)
    }
  }, [klines])

  useEffect(() => {
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [draw])

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <div className="tabs">
          {INTERVALS.map(({ key, label }) => (
            <button
              key={key}
              className={`tab ${interval === key ? 'active' : ''}`}
              onClick={() => setInterval_(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', height: 400 }}>
        {klineLoading && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-tertiary)', fontSize: 13, zIndex: 1,
          }}>
            ⏳ 加载K线数据…
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  )
}

// ─── Detail page ─────────────────────────────────────────
export default function Detail() {
  const { id } = useParams()
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCoinDetail(id)
      .then(setCoin)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="empty">⏳ 加载中…</div>
  if (error) return <div className="empty"><h3>❌ {error}</h3><Link to="/">返回首页</Link></div>
  if (!coin) return <div className="empty"><h3>币种未找到</h3><Link to="/">返回首页</Link></div>

  return (
    <>
      {/* 顶部信息 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {coin.logo && <img src={coin.logo} alt={coin.symbol} style={{ width: 32, height: 32, borderRadius: '50%' }} />}
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{coin.name}</h1>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>{coin.symbol}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
            <span className="price" style={{ fontSize: 28, fontWeight: 700 }}>{formatPrice(coin.price)}</span>
            <span className={`tag ${coin.change24h >= 0 ? 'tag-green' : 'tag-red'}`} style={{ fontSize: 13 }}>
              {formatChange(coin.change24h)}
            </span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">☆ 收藏</button>
          <button className="btn btn-primary">🔔 设置预警</button>
        </div>
      </div>

      {/* K线图表 */}
      <KlineChart coinId={id} />

      {/* 市场数据 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card">
          <div className="card-header">市场数据</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {[
              ['市值', formatLargeNumber(coin.marketCap)],
              ['24h成交量', formatLargeNumber(coin.volume)],
              ['24h最高', formatPrice(coin.high24h)],
              ['24h最低', formatPrice(coin.low24h)],
              ['24h涨跌', formatChange(coin.change24h)],
              ['7d涨跌', formatChange(coin.change7d)],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 2 }}>{label}</div>
                <div className="price" style={{ fontSize: 14 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">币种简介</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {coin.description || '暂无简介'}
          </p>
          {coin.links && (
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              {coin.links.website && <a href={coin.links.website} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 12 }}>🌐 官网</a>}
              {coin.links.github && <a href={coin.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 12 }}>💻 GitHub</a>}
              {coin.links.whitepaper && <a href={coin.links.whitepaper} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 12 }}>📄 白皮书</a>}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
