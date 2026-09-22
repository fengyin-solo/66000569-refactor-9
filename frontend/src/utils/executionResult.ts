/**
 * 执行结果的统一呈现定义。
 *
 * 执行日志、熔断面板、画布节点三条路径对同一份执行结果的取值与格式
 * （结果名称、颜色、CSS 类名、重试说明、运行光晕）都从这里取，
 * 不再在各组件里各写一遍。新增一种执行结果时，只需在下方注册表中
 * 增加一条记录，三条路径即同时生效。
 *
 * 未注册的状态串（如历史执行记录里出现的其他状态）保持历史展示：
 * 名称原样输出、画布使用兜底色、日志/熔断行不着色。
 */

/** 一种执行结果在各路径中的呈现方式；缺省字段表示该路径不做特殊着色 */
export interface ResultPresentation {
  /** 结果名称：缺省时展示原始状态串（与历史记录完全一致） */
  label?: string
  /** 画布节点颜色（边框、顶部状态条） */
  nodeColor?: string
  /** 画布是否带运行光晕 */
  nodeGlow?: boolean
  /** 执行日志行文字颜色 */
  logColor?: string
  /** 执行日志行背景色 */
  logBackground?: string
  /** 熔断状态文字颜色 */
  breakerColor?: string
  /** 熔断面板行背景色 */
  breakerBackground?: string
}

/** 画布节点遇到未知状态时的兜底色 */
const FALLBACK_NODE_COLOR = '#4a5568'

/**
 * 任务执行结果注册表（画布节点 + 执行日志共用）。
 * 状态机：PENDING → RUNNING → SUCCESS / FAILED / TIMEOUT。
 */
const TASK_RESULTS: Record<string, ResultPresentation> = {
  PENDING: { nodeColor: '#4a5568' },
  RUNNING: { nodeColor: '#3182ce', nodeGlow: true, logBackground: '#3182ce15' },
  SUCCESS: { nodeColor: '#38a169', logColor: '#38a169' },
  FAILED: { nodeColor: '#e53e3e', logColor: '#e53e3e', logBackground: '#e53e3e10' },
  TIMEOUT: { nodeColor: '#d69e2e' },
}

/** 熔断器状态注册表（熔断面板使用） */
const BREAKER_STATES: Record<string, ResultPresentation> = {
  OPEN: { breakerColor: '#ef4444', breakerBackground: '#ef444415' },
  CLOSED: { breakerColor: '#22c55e' },
  HALF_OPEN: { breakerColor: '#fbbf24' },
}

function lookup(table: Record<string, ResultPresentation>, token: string): ResultPresentation {
  return table[token] ?? {}
}

/** 结果名称：注册表里有定义用定义，否则原样输出状态串 */
export function resultLabel(status: string): string {
  return TASK_RESULTS[status]?.label ?? status
}

/** 熔断器状态名称，规则同 {@link resultLabel} */
export function breakerStateLabel(state: string): string {
  return BREAKER_STATES[state]?.label ?? state
}

/** 行 CSS 类名：统一的小写状态串取值，作为稳定的样式/测试钩子 */
export function resultClass(token: string): string {
  return token.toLowerCase()
}

/** 画布节点颜色，未知状态使用兜底色 */
export function nodeColor(status: string): string {
  return lookup(TASK_RESULTS, status).nodeColor ?? FALLBACK_NODE_COLOR
}

/** 画布节点是否绘制运行光晕 */
export function nodeGlows(status: string): boolean {
  return lookup(TASK_RESULTS, status).nodeGlow === true
}

/** 执行日志行内联样式（文字色 / 背景色，缺省字段不输出） */
export function logRowStyle(status: string): { color?: string; background?: string } {
  const p = lookup(TASK_RESULTS, status)
  return { color: p.logColor, background: p.logBackground }
}

/** 熔断面板行内联样式（背景色） */
export function breakerRowStyle(state: string): { background?: string } {
  return { background: lookup(BREAKER_STATES, state).breakerBackground }
}

/** 熔断状态文字内联样式（颜色） */
export function breakerStateStyle(state: string): { color?: string } {
  return { color: lookup(BREAKER_STATES, state).breakerColor }
}

/** 画布节点状态行：结果名称 + 重试说明 */
export function nodeStatusText(status: string, retries: number): string {
  return `${resultLabel(status)} | 重试${retries}`
}
