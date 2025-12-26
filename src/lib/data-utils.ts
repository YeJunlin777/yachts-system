export function formatCurrency(value: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(value)
}

export function formatDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('zh-CN', options ?? { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
