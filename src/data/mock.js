// 格式化工具函数 — 在整个前端通用

export function formatPrice(n) {
  if (n >= 1) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return '$' + n.toFixed(4)
}

export function formatLargeNumber(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  return '$' + n.toLocaleString()
}

export function formatChange(n) {
  const sign = n >= 0 ? '+' : ''
  return sign + n.toFixed(2) + '%'
}
