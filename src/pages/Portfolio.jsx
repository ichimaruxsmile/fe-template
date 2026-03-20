import { MOCK_PORTFOLIO, formatPrice, formatChange } from '../data/mock'

export default function Portfolio() {
  const totalValue = MOCK_PORTFOLIO.reduce((s, p) => s + p.amount * p.currentPrice, 0)
  const totalCost = MOCK_PORTFOLIO.reduce((s, p) => s + p.amount * p.avgCost, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPct = (totalPnl / totalCost) * 100

  return (
    <>
      <div className="page-header">
        <h1>持仓组合</h1>
        <button className="btn btn-primary">+ 添加持仓</button>
      </div>

      {/* 总览 */}
      <div className="stats-row">
        <div className="card stat-card">
          <div className="stat-value">{formatPrice(totalValue)}</div>
          <div className="stat-label">总资产估值</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {totalPnl >= 0 ? '+' : ''}{formatPrice(Math.abs(totalPnl))}
          </div>
          <div className="stat-label">总盈亏</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: totalPnlPct >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {formatChange(totalPnlPct)}
          </div>
          <div className="stat-label">盈亏比例</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{MOCK_PORTFOLIO.length}</div>
          <div className="stat-label">持仓币种</div>
        </div>
      </div>

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
              {MOCK_PORTFOLIO.map(p => {
                const value = p.amount * p.currentPrice
                const cost = p.amount * p.avgCost
                const pnl = value - cost
                const pnlPct = (pnl / cost) * 100
                return (
                  <tr key={p.coin}>
                    <td style={{ fontWeight: 500 }}>{p.name} <span style={{ color: 'var(--text-tertiary)' }}>{p.coin}</span></td>
                    <td className="price">{p.amount}</td>
                    <td className="price">{formatPrice(p.currentPrice)}</td>
                    <td className="price">{formatPrice(value)}</td>
                    <td className="price">{formatPrice(p.avgCost)}</td>
                    <td className={pnl >= 0 ? 'change-up price' : 'change-down price'}>
                      {pnl >= 0 ? '+' : ''}{formatPrice(Math.abs(pnl))}
                    </td>
                    <td className={pnlPct >= 0 ? 'change-up' : 'change-down'}>
                      {formatChange(pnlPct)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
