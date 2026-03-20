import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_COINS, MARKET_STATS, formatPrice, formatLargeNumber, formatChange } from '../data/mock'

export default function Home() {
  const [tab, setTab] = useState('all')

  const coins = tab === 'gainers'
    ? [...MOCK_COINS].sort((a, b) => b.change24h - a.change24h)
    : tab === 'losers'
    ? [...MOCK_COINS].sort((a, b) => a.change24h - b.change24h)
    : MOCK_COINS

  return (
    <>
      {/* 市场概览 */}
      <div className="stats-row">
        {Object.entries(MARKET_STATS).map(([key, val]) => (
          <div className="card stat-card" key={key}>
            <div className="stat-value">{val}</div>
            <div className="stat-label">
              {{ totalMarketCap: '总市值', volume24h: '24h成交量', btcDominance: 'BTC占比', activeCryptos: '活跃币种' }[key]}
            </div>
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
                <th>1h</th>
                <th>24h</th>
                <th>7d</th>
                <th>24h成交量</th>
                <th>市值</th>
              </tr>
            </thead>
            <tbody>
              {coins.map(coin => (
                <tr key={coin.id}>
                  <td>{coin.rank}</td>
                  <td>
                    <Link to={`/coin/${coin.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {coin.name} <span style={{ color: 'var(--text-tertiary)' }}>{coin.symbol}</span>
                    </Link>
                  </td>
                  <td className="price">{formatPrice(coin.price)}</td>
                  <td className={coin.change1h >= 0 ? 'change-up' : 'change-down'}>{formatChange(coin.change1h)}</td>
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
