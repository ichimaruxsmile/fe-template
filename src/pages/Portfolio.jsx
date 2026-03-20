import { useState, useEffect } from 'react'
import { getPortfolio, addHolding, getCoins } from '../data/api'
import { formatPrice, formatChange } from '../data/mock'

const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
  fontSize: 14, outline: 'none',
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Add holding form state
  const [showForm, setShowForm] = useState(false)
  const [coins, setCoins] = useState([])
  const [formCoinId, setFormCoinId] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formAvgCost, setFormAvgCost] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadPortfolio() {
    setLoading(true)
    setError(null)
    getPortfolio()
      .then(({ holdings, summary }) => {
        setHoldings(holdings)
        setSummary(summary)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadPortfolio() }, [])

  function handleOpenForm() {
    setShowForm(true)
    if (coins.length === 0) {
      getCoins().then(({ coins }) => {
        setCoins(coins)
        if (coins.length > 0) setFormCoinId(coins[0].id)
      })
    }
  }

  function handleCloseForm() {
    setShowForm(false)
    setFormAmount('')
    setFormAvgCost('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formCoinId || !formAmount || !formAvgCost) return

    setSubmitting(true)
    try {
      await addHolding({
        coinId: formCoinId,
        amount: Number(formAmount),
        avgCost: Number(formAvgCost),
      })
      loadPortfolio()
      handleCloseForm()
    } catch (err) {
      alert('添加失败: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="empty">⏳ 加载中…</div>
  if (error) return <div className="empty">❌ {error}</div>

  return (
    <>
      <div className="page-header">
        <h1>持仓组合</h1>
        <button className="btn btn-primary" onClick={handleOpenForm}>+ 添加持仓</button>
      </div>

      {/* 添加持仓表单 */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>添加持仓</span>
            <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={handleCloseForm}>✕ 关闭</button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            {/* 选择币种 */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>币种</label>
              <select value={formCoinId} onChange={(e) => setFormCoinId(e.target.value)} style={inputStyle}>
                {coins.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
                ))}
              </select>
            </div>
            {/* 持仓数量 */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>数量</label>
              <input
                type="number" step="any" required min="0"
                value={formAmount} onChange={(e) => setFormAmount(e.target.value)}
                placeholder="例: 0.5"
                style={inputStyle}
              />
            </div>
            {/* 成本价 */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>成本价 (USD)</label>
              <input
                type="number" step="any" required min="0"
                value={formAvgCost} onChange={(e) => setFormAvgCost(e.target.value)}
                placeholder="例: 60000"
                style={inputStyle}
              />
            </div>
            {/* 提交 */}
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: 38 }}>
              {submitting ? '提交中…' : '确认添加'}
            </button>
          </form>
        </div>
      )}

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
