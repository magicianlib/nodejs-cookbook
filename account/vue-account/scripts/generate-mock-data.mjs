/**
 * Mock data generator for vue-account fund tabs.
 * Generates 6 JSON files (one per tab) with 100-500 realistic transactions.
 *
 * Usage:  node scripts/generate-mock-data.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'src', 'data')
mkdirSync(outDir, { recursive: true })

// ── helpers ──────────────────────────────────────────────────────────
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randFloat(min, max, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round((Math.random() * (max - min) + min) * factor) / factor
}
function pick(arr) { return arr[rand(0, arr.length - 1)] }

function padZero(n) { return String(n).padStart(2, '0') }

function formatDate(date) {
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}

function* dateRange(startStr, daysBack) {
  const start = new Date(startStr)
  const end = new Date(start)
  end.setDate(end.getDate() - daysBack)
  let current = new Date(start)
  while (current >= end) {
    yield new Date(current)
    current = new Date(current)
    current.setMinutes(current.getMinutes() - rand(30, 180))
  }
}

function generateTxNo(date, seq) {
  const d = date.toISOString().slice(0, 10).replace(/-/g, '')
  return `TX${d}${String(seq).padStart(4, '0')}`
}

function generateTransactions(config) {
  const txs = []
  let seq = 0
  const startDate = new Date('2026-06-04T18:00:00')

  // Generate dates spread over the period
  const dates = []
  for (let i = 0; i < config.count; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() - rand(0, config.daysBack))
    d.setHours(rand(0, 23), rand(0, 59), 0, 0)
    dates.push(d)
  }
  // Sort descending (newest first)
  dates.sort((a, b) => b - a)

  for (const date of dates) {
    const isIncome = Math.random() < config.incomeRatio
    const type = isIncome ? 'income' : 'expense'
    const name = isIncome ? pick(config.incomeNames) : pick(config.expenseNames)
    const amount = isIncome
      ? randFloat(config.incomeAmountRange[0], config.incomeAmountRange[1])
      : randFloat(config.expenseAmountRange[0], config.expenseAmountRange[1])
    const isPending = Math.random() < 0.05 // 5% pending
    seq++

    txs.push({
      type,
      name,
      amount,
      date: formatDate(date),
      status: isPending ? 'pending' : 'success',
      txNo: generateTxNo(date, seq),
    })
  }
  return txs
}

// ── per-tab config ───────────────────────────────────────────────────

const configs = {
  cny: {
    count: 386,
    daysBack: 365,
    incomeRatio: 0.45,
    incomeAmountRange: [500, 500000],
    expenseAmountRange: [50, 300000],
    incomeNames: [
      '项目结算', '客户回款', '投资收益', '咨询服务费', '退款到账',
      '利息收入', '销售收入', '劳务报酬', '技术服务费', '培训收入',
      '合同尾款', '股权转让', '版权收入', '租金收入', '政府补贴',
      '保险理赔', '股东注资', '平台分成', '合作分成', '代理佣金',
      '广告收入', '许可费收入', '维修服务', '设计费', '开发费',
      '测试费', '部署费', '运维费', '审计退款', '押金退还',
    ],
    expenseNames: [
      '办公室租金', '员工工资', '服务器费用', '差旅报销', '设备采购',
      '水电费', '物流配送', '社保缴纳', '办公用品', '维修费',
      '市场推广', '广告投放', '会议费用', '培训费', '招待费',
      '通讯费', '网络费', '保险费', '税费', '审计费',
      '法律顾问', '专利申请', '商标注册', '软件订阅', '云服务',
      '加班餐费', '团建活动', '福利发放', '快递费', '打印费',
      '清洁费', '安保费', '停车费', '加油费', '过路费',
    ],
  },
  usd: {
    count: 247,
    daysBack: 365,
    incomeRatio: 0.42,
    incomeAmountRange: [100, 80000],
    expenseAmountRange: [50, 40000],
    incomeNames: [
      '海外汇入', 'SaaS 订阅', '广告收入', '专利授权', '技术出口',
      '咨询服务', '许可收入', '平台分成', 'API 调用费', '云服务收入',
      '培训收入', '国际结算', '股息收入', '汇兑收益', '退税到账',
      '合作分成', '代理佣金', '软件销售', '设计服务', '技术支持',
      '订阅续费', '增值服务', '数据服务', '安全审计', '运维外包',
    ],
    expenseNames: [
      'AWS 月费', '软件授权', '域名续费', 'SSL 证书', 'CDN 费用',
      '办公租赁', '远程协作', '客服系统', '邮件服务', '监控告警',
      '数据分析', '安全扫描', '代码托管', 'CI/CD 服务', 'VPN 订阅',
      '云存储', '数据库托管', '短信服务', '视频会议', '项目管理',
      '设计工具', '文档协作', '知识库', '人才招聘', '背景调查',
    ],
  },
  eur: {
    count: 178,
    daysBack: 365,
    incomeRatio: 0.44,
    incomeAmountRange: [200, 120000],
    expenseAmountRange: [100, 60000],
    incomeNames: [
      '欧盟客户付款', '退税到账', '技术服务', '许可收入', '软件销售',
      '咨询顾问', '培训收入', '平台分成', '合作分成', '股息收入',
      '汇兑收益', '利息收入', '保险理赔', '押金退还', '合同尾款',
      '专利授权', '设计服务', '运维服务', '审计服务', '数据服务',
    ],
    expenseNames: [
      '欧洲办公室', '本地工资', '社保缴纳', '税务咨询', '法律顾问',
      '市场推广', '展会费用', '差旅费用', '办公设备', '通讯费用',
      '保险费用', '审计费用', '云服务费', '软件订阅', '商标维护',
      '专利年费', '物流仓储', '翻译服务', '本地化服务', '合规咨询',
    ],
  },
  hk: {
    count: 215,
    daysBack: 365,
    incomeRatio: 0.43,
    incomeAmountRange: [1000, 200000],
    expenseAmountRange: [500, 100000],
    incomeNames: [
      '港股分红', '租金收入', '汇款到账', '投资赎回', '利息收入',
      '保险收益', '基金分红', '债券利息', '服务费收入', '平台收益',
      '股权转让', '客户回款', '合同结算', '合作分成', '代理佣金',
      '咨询收入', '技术服务', '培训收入', '审计退款', '退税到账',
    ],
    expenseNames: [
      '保险缴费', '物业管理', '证券交易', '基金申购', '银行手续费',
      '汇款手续费', '律师费', '会计师费', '审计费', '办公租赁',
      '员工薪资', '社保缴纳', '差旅报销', '通讯费用', '市场推广',
      '会议费用', '招待费用', '办公设备', '维修保养', '物流仓储',
    ],
  },
  smart: {
    count: 124,
    daysBack: 300,
    incomeRatio: 0.50,
    incomeAmountRange: [10, 15000],
    expenseAmountRange: [50, 8000],
    incomeNames: [
      '理财收益', '活期利息', '货币基金', '短期理财', '余额宝收益',
      '转入到账', '红包收款', '代金券兑换', '积分兑换', '退款到账',
      '好友转账', 'AA 收款', '活动返现', '消费返利', '签到奖励',
    ],
    expenseNames: [
      '自动转入定存', '基金定投', '自动还款', '信用卡还款', '花呗还款',
      '生活缴费', '话费充值', '会员续费', '打车费用', '外卖订单',
      '线上购物', '电影票', '自动扣款', '保险自动扣', '贷款还款',
    ],
  },
  unionpay: {
    count: 163,
    daysBack: 365,
    incomeRatio: 0.30,
    incomeAmountRange: [5, 5000],
    expenseAmountRange: [1, 3000],
    incomeNames: [
      '红包收款', '转账到账', '退款到账', '工资到账', '奖金到账',
      '报销到账', '利息到账', '理财赎回', '好友转账', 'AA 收款',
      '商户退款', '话费返还', '积分兑换', '活动返现', '消费返利',
    ],
    expenseNames: [
      '便利店', '地铁充值', '超市购物', '餐饮消费', '加油站',
      '停车场', '药店', '水果店', '奶茶咖啡', '外卖订单',
      '公交刷卡', '电影票', '健身缴费', '水电煤缴费', '话费充值',
      '线上购物', '快递代收', '洗衣店', '理发店', '宠物用品',
      '图书购买', '数码配件', '鲜花礼品', '零食饮料', '日用品',
    ],
  },
}

// ── generate & write ─────────────────────────────────────────────────
for (const [tabId, config] of Object.entries(configs)) {
  const transactions = generateTransactions(config)
  const filePath = resolve(outDir, `transactions-${tabId}.json`)
  writeFileSync(filePath, JSON.stringify(transactions, null, 2), 'utf-8')
  console.log(`✓ ${tabId}: ${transactions.length} transactions → ${filePath}`)
}

console.log('\nDone! All mock data files generated.')
