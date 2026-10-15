// Currency utility for CAD
export const CURRENCY_SYMBOL = 'C$'
export const CURRENCY_CODE = 'CAD'

// Format price with CAD symbol
export const formatPrice = (price) => {
  const num = Number(price) || 0
  return `${CURRENCY_SYMBOL}${num.toFixed(2)}`
}

// Format amount without symbol
export const formatAmount = (price) => {
  const num = Number(price) || 0
  return num.toFixed(2)
}

export default { formatPrice, formatAmount, CURRENCY_SYMBOL, CURRENCY_CODE }

