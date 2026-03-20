import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCoins } from '../data/api'
import { formatPrice, formatLargeNumber, formatChange } from '../data/mock'

export default function Home() {
  const [tab, setTab] = useState('all')
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCoins()
      .then(({ coins }) => setCoins(coins))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Client-side tab sorting
  const sorted = tab === 'gainers'
    ? [...coins].sort((a, b) => b.change24h - a.change24h)
    : tab === 'losers'
    ? [...coins].sort((a, b) => a.change24h - b.change24h)
    : coins

  // Market stats derived from API data
  const totalMarketCap = coins.reduce((s, c) => s + (c.marketCap || 0), 0)
  const totalVolume = coins.reduce((s, c) => s + (c.volume || 0), 0)

  if (loading) return <div className="empty">⏳ 加载中…</div>
  if (error) return <div className="empty">❌ {error}</div>

  return (
    <>
      {/* 市场概览 */}
      <div className="stats-row">
        {[
          ['总市值', formatLargeNumber(totalMarketCap)],
          ['24h成交量', formatLargeNumber(totalVolume)],
          ['币种数量', coins.length],
        ].map(([label, val]) => (
          <div className="card stat-card" key={label}>
            <div className="stat-value">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* 行情表格 */}
      <div className="card">
        <div className="card-header">
          <div className="tabs">
            {[['all', '全部'], ['gainers', '涨幅榜'], ['losers', '跌幅榜']].map(([k, label]) => (
              <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>币种</th>
                <th>价格</th>
                <th>24h</th>
                <th>7d</th>
                <th>24h成交量</th>
                <th>市值</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((coin, idx) => (
                <tr key={coin.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <Link to={`/coin/${coin.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {coin.name} <span style={{ color: 'var(--text-tertiary)' }}>{coin.symbol}</span>
                    </Link>
                  </td>
                  <td className="price">{formatPrice(coin.price)}</td>
                  <td className={coin.change24h >= 0 ? 'change-up' : 'change-down'}>{formatChange(coin.change24h)}</td>
                  <td className={coin.change7d >= 0 ? 'change-up' : 'change-down'}>{formatChange(coin.change7d)}</td>
                  <td>{formatLargeNumber(coin.volume)}</td>
                  <td>{formatLargeNumber(coin.marketCap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
