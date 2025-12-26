export type LogResult = "success" | "warning" | "error"

export interface LogRecord {
  id: string
  operator: string
  role: string
  module: string
  action: string
  result: LogResult
  ip: string
  timestamp: string
  payload?: Record<string, unknown>
}
