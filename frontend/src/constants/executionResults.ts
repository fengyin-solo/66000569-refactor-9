/**
 * 执行结果展示口径 —— 执行日志、熔断面板、画布节点三处共用的唯一事实来源。
 * 同一种执行结果的「名称、样式类、颜色、重试说明」只在这里登记一次：
 * 新增结果类型时只需在此增加一条记录，三条展示路径自动生效，无需各自改一遍。
 */

/** 各展示面需要的呈现信息；未提供的字段表示该展示面对此结果沿用默认样式。 */
export interface ExecutionResultDef {
  /** 结果名称（即状态字面量本身，三处均原样展示） */
  name: string
  /** 统一的样式类名（保持历史口径：名称小写，如 HALF_OPEN -> half_open） */
  className: string
  /** 主色：画布节点描边/顶部状态条；熔断器状态文字 */
  color: string
  /** 执行日志：整行文字色（缺省则继承默认） */
  logColor?: string
  /** 执行日志：整行底色（缺省则透明） */
  logBackground?: string
  /** 熔断面板：整行底色（缺省则透明） */
  breakerBackground?: string
  /** 画布节点是否带发光效果（仅运行中结果为 true） */
  glow?: boolean
}

/** 画布遇到未知结果时的兜底色（与历史 STATUS_COLORS 兜底一致） */
export const NODE_FALLBACK_COLOR = '#4a5568'

/**
 * 执行结果登记表：覆盖三条路径当前可能出现的全部结果。
 * 任务节点结果：PENDING / RUNNING / SUCCESS / FAILED / TIMEOUT / CIRCUIT_OPEN（日志）
 * 熔断器结果：CLOSED / OPEN / HALF_OPEN
 */
export const EXECUTION_RESULTS: Record<string, ExecutionResultDef> = {
  PENDING: {
    name: 'PENDING',
    className: 'pending',
    color: '#4a5568'
  },
  RUNNING: {
    name: 'RUNNING',
    className: 'running',
    color: '#3182ce',
    logBackground: '#3182ce15',
    glow: true
  },
  SUCCESS: {
    name: 'SUCCESS',
    className: 'success',
    color: '#38a169',
    logColor: '#38a169'
  },
  FAILED: {
    name: 'FAILED',
    className: 'failed',
    color: '#e53e3e',
    logColor: '#e53e3e',
    logBackground: '#e53e3e10'
  },
  TIMEOUT: {
    name: 'TIMEOUT',
    className: 'timeout',
    color: '#d69e2e'
  },
  CIRCUIT_OPEN: {
    name: 'CIRCUIT_OPEN',
    className: 'circuit_open',
    color: NODE_FALLBACK_COLOR
  },
  CLOSED: {
    name: 'CLOSED',
    className: 'closed',
    color: '#22c55e'
  },
  OPEN: {
    name: 'OPEN',
    className: 'open',
    color: '#ef4444',
    breakerBackground: '#ef444415'
  },
  HALF_OPEN: {
    name: 'HALF_OPEN',
    className: 'half_open',
    color: '#fbbf24'
  }
}

/**
 * 取某条结果的展示定义；未登记的历史结果返回 null。
 * 日志与熔断面板对未知结果的历史口径是「不附加任何颜色、类名仍为小写」，
 * 因此这两处用本方法配合可选兜底，绝不凭空赋予颜色。
 */
export function getResultDef(name: string): ExecutionResultDef | null {
  return EXECUTION_RESULTS[name] ?? null
}

/**
 * 画布节点取展示定义。历史口径下未知状态用灰色描边、类名取小写，
 * 与原 STATUS_COLORS[n.status] || '#4a5568' 完全一致。
 */
export function getNodeResultDef(name: string): ExecutionResultDef {
  return getResultDef(name) ?? { name, className: name.toLowerCase(), color: NODE_FALLBACK_COLOR }
}

/** 画布节点上的重试说明，口径统一为「重试N」 */
export function retryText(retries: number): string {
  return `重试${retries}`
}
