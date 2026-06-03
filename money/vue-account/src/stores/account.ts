import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TabData, TabId, FilterState, MonthlyStats, Transaction } from '@/types/account'

const seedTabs: Record<TabId, TabData> = {
  cny: {
    account: {
      name: '人民币储蓄卡', tag: 'CNY', number: '6217 0038 **** 2345',
      balance: 4485741533.02, currency: 'CNY', symbol: '¥', locale: 'zh-CN',
      withdrawn: 2150000.00, settled: 3280000.00, pending: 856200.00,
    },
    transactions: [
      { type: 'income', name: '项目结算', amount: 52800.00, date: '2026-06-02 14:30', status: 'success', txNo: 'TX202606020014' },
      { type: 'expense', name: '办公室租金', amount: 12000.00, date: '2026-06-02 10:15', status: 'success', txNo: 'TX202606020013' },
      { type: 'income', name: '客户回款', amount: 85000.00, date: '2026-06-01 16:42', status: 'success', txNo: 'TX202606010012' },
      { type: 'expense', name: '员工工资', amount: 156000.00, date: '2026-06-01 09:00', status: 'success', txNo: 'TX202606010011' },
      { type: 'expense', name: '服务器费用', amount: 3280.00, date: '2026-05-31 11:20', status: 'success', txNo: 'TX202605310010' },
      { type: 'income', name: '投资收益', amount: 12400.00, date: '2026-05-30 18:00', status: 'success', txNo: 'TX202605300009' },
      { type: 'expense', name: '差旅报销', amount: 4560.00, date: '2026-05-30 14:33', status: 'success', txNo: 'TX202605300008' },
      { type: 'income', name: '咨询服务费', amount: 36000.00, date: '2026-05-29 10:05', status: 'success', txNo: 'TX202605290007' },
      { type: 'expense', name: '设备采购', amount: 28900.00, date: '2026-05-28 15:48', status: 'success', txNo: 'TX202605280006' },
      { type: 'income', name: '退款到账', amount: 1500.00, date: '2026-05-28 09:12', status: 'success', txNo: 'TX202605280005' },
      { type: 'expense', name: '水电费', amount: 890.00, date: '2026-05-27 08:30', status: 'success', txNo: 'TX202605270004' },
      { type: 'income', name: '利息收入', amount: 5623.41, date: '2026-05-27 00:00', status: 'success', txNo: 'TX202605270003' },
      { type: 'expense', name: '物流配送', amount: 1200.00, date: '2026-05-26 16:20', status: 'pending', txNo: 'TX202605260002' },
      { type: 'income', name: '销售收入', amount: 98700.00, date: '2026-05-26 11:30', status: 'success', txNo: 'TX202605260001' },
    ],
  },
  usd: {
    account: {
      name: '美元支票账户', tag: 'USD', number: '3304 5519 **** 6789',
      balance: 512487.55, currency: 'USD', symbol: '$', locale: 'en-US',
      withdrawn: 85000.00, settled: 142000.00, pending: 32450.00,
    },
    transactions: [
      { type: 'income', name: '海外汇入', amount: 25000.00, date: '2026-06-01 20:15', status: 'success', txNo: 'TX202606010022' },
      { type: 'expense', name: 'AWS 月费', amount: 1842.30, date: '2026-05-31 12:00', status: 'success', txNo: 'TX202605310021' },
      { type: 'income', name: 'SaaS 订阅', amount: 499.00, date: '2026-05-30 09:30', status: 'success', txNo: 'TX202605300020' },
      { type: 'expense', name: '软件授权', amount: 2999.00, date: '2026-05-28 14:10', status: 'success', txNo: 'TX202605280019' },
      { type: 'income', name: '广告收入', amount: 8750.00, date: '2026-05-27 18:00', status: 'success', txNo: 'TX202605270018' },
    ],
  },
  eur: {
    account: {
      name: '欧元结算账户', tag: 'EUR', number: 'DE89 3704 0044 **** 1234',
      balance: 185320.80, currency: 'EUR', symbol: '€', locale: 'en-US',
      withdrawn: 28000.00, settled: 56000.00, pending: 12400.00,
    },
    transactions: [
      { type: 'income', name: '欧盟客户付款', amount: 32000.00, date: '2026-06-02 11:00', status: 'success', txNo: 'TX202606020032' },
      { type: 'expense', name: '欧洲办公室', amount: 4800.00, date: '2026-05-30 10:00', status: 'success', txNo: 'TX202605300031' },
      { type: 'income', name: '退税到账', amount: 1250.00, date: '2026-05-28 15:30', status: 'success', txNo: 'TX202605280030' },
    ],
  },
  hk: {
    account: {
      name: '港币账户', tag: 'HKD', number: '8821 0077 **** 9012',
      balance: 2856410.78, currency: 'HKD', symbol: 'HK$', locale: 'zh-CN',
      withdrawn: 980000.00, settled: 1250000.00, pending: 210000.00,
    },
    transactions: [
      { type: 'income', name: '港股分红', amount: 45000.00, date: '2026-06-01 16:00', status: 'success', txNo: 'TX202606010042' },
      { type: 'expense', name: '保险缴费', amount: 8900.00, date: '2026-05-29 09:00', status: 'success', txNo: 'TX202605290041' },
      { type: 'income', name: '租金收入', amount: 22000.00, date: '2026-05-28 08:00', status: 'success', txNo: 'TX202605280040' },
    ],
  },
  smart: {
    account: {
      name: '智能活期', tag: 'CNY', number: '7720 8833 **** 5566',
      balance: 98650.12, currency: 'CNY', symbol: '¥', locale: 'zh-CN',
      withdrawn: 25000.00, settled: 42000.00, pending: 8600.00,
    },
    transactions: [
      { type: 'income', name: '理财收益', amount: 186.50, date: '2026-06-02 00:00', status: 'success', txNo: 'TX202606020052' },
      { type: 'expense', name: '自动转入定存', amount: 5000.00, date: '2026-06-01 00:00', status: 'success', txNo: 'TX202606010051' },
      { type: 'income', name: '理财收益', amount: 162.30, date: '2026-06-01 00:00', status: 'success', txNo: 'TX202606010050' },
    ],
  },
  unionpay: {
    account: {
      name: '银联支付', tag: 'CNY', number: '6228 4800 **** 3310',
      balance: 3256.80, currency: 'CNY', symbol: '¥', locale: 'zh-CN',
      withdrawn: 12000.00, settled: 8600.00, pending: 2100.00,
    },
    transactions: [
      { type: 'expense', name: '便利店', amount: 32.50, date: '2026-06-02 08:45', status: 'success', txNo: 'TX202606020062' },
      { type: 'expense', name: '地铁充值', amount: 100.00, date: '2026-06-01 07:30', status: 'success', txNo: 'TX202606010061' },
      { type: 'income', name: '红包收款', amount: 200.00, date: '2026-05-31 12:20', status: 'success', txNo: 'TX202605310060' },
    ],
  },
}

export const useAccountStore = defineStore('account', () => {
  const tabs = ref<Record<TabId, TabData>>(JSON.parse(JSON.stringify(seedTabs)))
  const activeTab = ref<TabId>('cny')
  const filters = ref<FilterState>({
    type: '',
    search: '',
    dateStart: '2026-06-01',
    dateEnd: '2026-06-30',
  })
  const showDialog = ref(false)
  const dialogType = ref<'income' | 'expense'>('income')

  const currentAccount = computed(() => tabs.value[activeTab.value].account)
  const currentTransactions = computed(() => tabs.value[activeTab.value].transactions)

  const filteredTransactions = computed(() => {
    const { type, search, dateStart, dateEnd } = filters.value
    return currentTransactions.value.filter((tx) => {
      if (type && tx.type !== type) return false
      if (search && !tx.name.toLowerCase().includes(search.toLowerCase())) return false
      const d = tx.date.substring(0, 10)
      if (dateStart && d < dateStart) return false
      if (dateEnd && d > dateEnd) return false
      return true
    })
  })

  const monthlyStats = computed((): MonthlyStats => {
    const now = new Date()
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    let income = 0
    let expense = 0
    currentTransactions.value.forEach((tx) => {
      if (tx.date.substring(0, 7) === ym) {
        if (tx.type === 'income') income += tx.amount
        else expense += tx.amount
      }
    })
    return { income, expense }
  })

  function setActiveTab(id: TabId) {
    activeTab.value = id
  }

  function resetFilters() {
    filters.value = { type: '', search: '', dateStart: '2026-06-01', dateEnd: '2026-06-30' }
  }

  function addTransaction(tx: Transaction) {
    const acc = tabs.value[activeTab.value].account
    if (tx.type === 'income') acc.balance += tx.amount
    else acc.balance -= tx.amount
    tabs.value[activeTab.value].transactions.unshift(tx)
  }

  function openDialog(type: 'income' | 'expense') {
    dialogType.value = type
    showDialog.value = true
  }

  function closeDialog() {
    showDialog.value = false
  }

  return {
    tabs,
    activeTab,
    filters,
    showDialog,
    dialogType,
    currentAccount,
    currentTransactions,
    filteredTransactions,
    monthlyStats,
    setActiveTab,
    resetFilters,
    addTransaction,
    openDialog,
    closeDialog,
  }
})
