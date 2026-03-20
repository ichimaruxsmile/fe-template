import { useState, useEffect } from 'react'
import { getPortfolio } from '../data/api'
import { formatPrice, formatChange } from '../data/mock'

export default function Portfolio() {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getPortfolio()
      .then(({ holdings, summary }) => {
        setHoldings(holdings)
        setSummary(summary)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="empty">⏳ 加载中…</div>
  if (error) return <div className="empty">❌ {error}</div>

  return (
    <>
      <div className="page-header">
        <h1>持仓组合</h1>
        <button className="btn btn-primary">+ 添加持仓</button>
      </div>

      {/* 总览 */}
      {summary && (
        <div className="stats-row">
          <div className="card stat-card">
            <div className="stat-value">{formatPrice(summary.totalValue)}</div>
            <div className="stat-label">总资产估值</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: summary.totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {summary.totalPnl >= 0 ? '+' : ''}{formatPrice(Math.abs(summary.totalPnl))}
            </div>
            <div className="stat-label">总盈亏</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: summary.totalPnlPct >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {formatChange(summary.totalPnlPct)}
            </div>
            <div className="stat-label">盈亏比例</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{holdings.length}</div>
            <div className="stat-label">持仓币种</div>
          </div>
        </div>
      )}

      {/* 资产分布占位 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">资产分布</div>
        <div style={{
          height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)',
          color: 'var(--text-tertiary)', fontSize: 13
        }}>
          📊 资产分布饼图（后续集成 Recharts）
        </div>
      </div>

      {/* 持仓明细 */}
      <div className="card">
        <div className="card-header">持仓明细</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>币种</th>
                <th>持仓数量</th>
                <th>当前价格</th>
                <th>当前价值</th>
                <th>成本价</th>
                <th>盈亏</th>
                <th>盈亏%</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(p => (
                <tr key={p.coinId}>
                  <td style={{ fontWeight: 500 }}>{p.name} <span style={{ color: 'var(--text-tertiary)' }}>{p.coin}</span></td>
                  <td className="price">{p.amount}</td>
                  <td className="price">{formatPrice(p.currentPrice)}</td>
                  <td className="price">{formatPrice(p.value)}</td>
                  <td className="price">{formatPrice(p.avgCost)}</td>
                  <td className={p.pnl >= 0 ? 'change-up price' : 'change-down price'}>
                    {p.pnl >= 0 ? '+' : ''}{formatPrice(Math.abs(p.pnl))}
                  </td>
                  <td className={p.pnlPct >= 0 ? 'change-up' : 'change-down'}>
                    {formatChange(p.pnlPct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
