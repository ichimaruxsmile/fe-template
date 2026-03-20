import { useState, useEffect } from 'react'
import { getAlerts, deleteAlert } from '../data/api'
import { formatPrice } from '../data/mock'

const TYPE_LABELS = {
  price_above: '价格高于',
  price_below: '价格低于',
  change_above: '涨幅超过',
  change_below: '跌幅超过',
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function loadAlerts() {
    setLoading(true)
    setError(null)
    getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAlerts() }, [])

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
        <button className="btn btn-primary">+ 创建预警</button>
      </div>

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
