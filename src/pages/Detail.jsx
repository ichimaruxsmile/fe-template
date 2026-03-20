import { useParams, Link } from 'react-router-dom'
import { MOCK_COINS, formatPrice, formatLargeNumber, formatChange } from '../data/mock'

export default function Detail() {
  const { id } = useParams()
  const coin = MOCK_COINS.find(c => c.id === id)

  if (!coin) return <div className="empty"><h3>币种未找到</h3><Link to="/">返回首页</Link></div>

  return (
    <>
      {/* 顶部信息 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{coin.name}</h1>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>{coin.symbol}</span>
            <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>#{coin.rank}</span>
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

      {/* K线图表占位 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="tabs">
            {['1分', '5分', '15分', '1时', '4时', '日', '周'].map(t => (
              <button key={t} className={`tab ${t === '日' ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
          <div className="tabs">
            {['K线', '折线', '面积'].map(t => (
              <button key={t} className={`tab ${t === 'K线' ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{
          height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)',
          color: 'var(--text-tertiary)', fontSize: 13
        }}>
          📊 K线图表区域（后续集成 TradingView Lightweight Charts）
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {['MA', 'EMA', 'RSI', 'MACD', 'BOLL'].map(ind => (
            <button key={ind} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }}>{ind}</button>
          ))}
        </div>
      </div>

      {/* 市场数据 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card">
          <div className="card-header">市场数据</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {[
              ['市值', formatLargeNumber(coin.marketCap)],
              ['24h成交量', formatLargeNumber(coin.volume)],
              ['24h最高', formatPrice(coin.price * 1.02)],
              ['24h最低', formatPrice(coin.price * 0.97)],
              ['1h涨跌', formatChange(coin.change1h)],
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
          <div className="card-header">价格换算</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{coin.symbol}</label>
              <input type="number" defaultValue="1" style={{
                width: '100%', marginTop: 4, padding: '8px 12px',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none'
              }} />
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>↕</div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>USD</label>
              <input type="text" readOnly value={formatPrice(coin.price)} style={{
                width: '100%', marginTop: 4, padding: '8px 12px',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none'
              }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
