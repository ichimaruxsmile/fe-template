import { useState, useEffect } from 'react'
import { getAlerts, deleteAlert, createAlert, getCoins } from '../data/api'
import { formatPrice } from '../data/mock'

const TYPE_LABELS = {
  price_above: '价格高于',
  price_below: '价格低于',
  change_above: '涨幅超过',
  change_below: '跌幅超过',
}

const ALERT_TYPES = [
  { value: 'price_above', label: '价格高于' },
  { value: 'price_below', label: '价格低于' },
  { value: 'change_above', label: '涨幅超过 (%)' },
  { value: 'change_below', label: '跌幅超过 (%)' },
]

const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
  fontSize: 14, outline: 'none',
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create form state
  const [showForm, setShowForm] = useState(false)
  const [coins, setCoins] = useState([])
  const [formCoinId, setFormCoinId] = useState('')
  const [formType, setFormType] = useState('price_above')
  const [formValue, setFormValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadAlerts() {
    setLoading(true)
    setError(null)
    getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAlerts() }, [])

  // Load coin list when opening the form
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
    setFormValue('')
    setFormType('price_above')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formCoinId || !formValue) return

    setSubmitting(true)
    try {
      const newAlert = await createAlert({
        coinId: formCoinId,
        type: formType,
        value: Number(formValue),
      })
      // Re-fetch to get enriched alert data (coin_name, current_price etc.)
      loadAlerts()
      handleCloseForm()
    } catch (err) {
      alert('创建失败: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAlert(id)
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      alert('删除失败: ' + err.message)
    }
  }

  if (loading) return <div className="empty">⏳ 加载中…</div>
  if (error) return <div className="empty">❌ {error}</div>

  const activeCount = alerts.filter((a) => a.active).length

  return (
    <>
      <div className="page-header">
        <h1>预警中心</h1>
        <button className="btn btn-primary" onClick={handleOpenForm}>+ 创建预警</button>
      </div>

      {/* 创建预警表单 */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>创建新预警</span>
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
            {/* 预警类型 */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>类型</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value)} style={inputStyle}>
                {ALERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {/* 阈值 */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                {formType.includes('change') ? '百分比 (%)' : '价格 (USD)'}
              </label>
              <input
                type="number" step="any" required
                value={formValue} onChange={(e) => setFormValue(e.target.value)}
                placeholder={formType.includes('change') ? '例: 5' : '例: 100000'}
                style={inputStyle}
              />
            </div>
            {/* 提交 */}
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: 38 }}>
              {submitting ? '提交中…' : '确认创建'}
            </button>
          </form>
        </div>
      )}

      {/* 统计 */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{activeCount}</div>
          <div className="stat-label">活跃预警</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{alerts.filter((a) => !a.active).length}</div>
          <div className="stat-label">已停用</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-label">预警规则总数</div>
        </div>
      </div>

      {/* 预警列表 */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {alerts.map((alert) => (
            <div key={alert.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 0', borderBottom: '1px solid var(--border)'
            }}>
              {/* 状态指示灯 */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.active ? 'var(--green)' : 'var(--text-tertiary)', flexShrink: 0 }} />

              {/* 信息 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{alert.coinName} <span style={{ color: 'var(--text-tertiary)' }}>{alert.coinSymbol}</span></span>
                  <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{TYPE_LABELS[alert.type] || alert.type}</span>
                  <span className="tag" style={{ background: 'var(--bg-tertiary)', color: alert.active ? 'var(--green)' : 'var(--text-tertiary)' }}>
                    {alert.active ? '活跃' : '停用'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {TYPE_LABELS[alert.type] || alert.type} {alert.type.includes('change') ? alert.value + '%' : formatPrice(alert.value)}
                  {' · '}当前价 {formatPrice(alert.currentPrice)}
                </div>
              </div>

              {/* 创建时间 */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {new Date(alert.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* 操作 */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleDelete(alert.id)}>
                  删除
                </button>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)' }}>暂无预警规则</div>
          )}
        </div>
      </div>
    </>
  )
}
