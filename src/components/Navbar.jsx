import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.svg" alt="logo" />
        <span>CryptoScope</span>
      </div>
      <div className="navbar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>行情</NavLink>
        <NavLink to="/alerts" className={({ isActive }) => isActive ? 'active' : ''}>预警</NavLink>
        <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'active' : ''}>持仓</NavLink>
      </div>
      <div className="navbar-search">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04Z"/></svg>
        <input type="text" placeholder="搜索币种、合约地址..." />
      </div>
    </nav>
  )
}
