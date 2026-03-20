import { MOCK_ALERTS } from '../data/mock'

const STATUS_MAP = {
  active: { label: '活跃', color: 'var(--green)' },
  paused: { label: '已暂停', color: 'var(--text-tertiary)' },
  triggered: { label: '已触发', color: 'var(--orange)' },
}

export default function Alerts() {
  return (
    <>
      <div className="page-header">
        <h1>预警中心</h1>
        <button className="btn btn-primary">+ 创建预警</button>
      </div>

      {/* 统计 */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{MOCK_ALERTS.filter(a => a.status === 'active').length}</div>
          <div className="stat-label">活跃预警</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{MOCK_ALERTS.reduce((s, a) => s + a.triggered, 0)}</div>
          <div className="stat-label">总触发次数</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{MOCK_ALERTS.length}</div>
          <div className="stat-label">预警规则总数</div>
        </div>
      </div>

      {/* 预警列表 */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {MOCK_ALERTS.map(alert => {
            const st = STATUS_MAP[alert.status]
            return (
              <div key={alert.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 0', borderBottom: '1px solid var(--border)'
              }}>
                {/* 状态指示灯 */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.color, flexShrink: 0 }} />

                {/* 信息 */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>{alert.coin}</span>
                    <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{alert.type}</span>
                    <span className="tag" style={{ background: 'var(--bg-tertiary)', color: st.color }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{alert.condition}</div>
                </div>

                {/* 触发次数 */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>触发 {alert.triggered} 次</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{alert.createdAt}</div>
                </div>

                {/* 操作 */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>编辑</button>
                  <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>
                    {alert.status === 'paused' ? '启用' : '暂停'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
