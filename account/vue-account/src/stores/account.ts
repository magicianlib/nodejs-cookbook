import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TabData, TabId, FilterState, MonthlyStats, Transaction } from '@/types/account'

import cnyTransactions from '@/data/transactions-cny.json'
import usdTransactions from '@/data/transactions-usd.json'
import eurTransactions from '@/data/transactions-eur.json'
import hkTransactions from '@/data/transactions-hk.json'
import smartTransactions from '@/data/transactions-smart.json'
import unionpayTransactions from '@/data/transactions-unionpay.json'

const seedTabs: Record<TabId, TabData> = {
  cny: {
    account: {
      name: '人民币储蓄卡', tag: 'CNY', number: '6217 0038 **** 2345',
      balance: 4485741533.02, currency: 'CNY', symbol: '¥', locale: 'zh-CN',
      withdrawn: 2150000.00, settled: 3280000.00, pending: 856200.00,
    },
    transactions: cnyTransactions as Transaction[],
  },
  usd: {
    account: {
      name: '美元支票账户', tag: 'USD', number: '3304 5519 **** 6789',
      balance: 512487.55, currency: 'USD', symbol: '$', locale: 'en-US',
      withdrawn: 85000.00, settled: 142000.00, pending: 32450.00,
    },
    transactions: usdTransactions as Transaction[],
  },
  eur: {
    account: {
      name: '欧元结算账户', tag: 'EUR', number: 'DE89 3704 0044 **** 1234',
      balance: 185320.80, currency: 'EUR', symbol: '€', locale: 'en-US',
      withdrawn: 28000.00, settled: 56000.00, pending: 12400.00,
    },
    transactions: eurTransactions as Transaction[],
  },
  hk: {
    account: {
      name: '港币账户', tag: 'HKD', number: '8821 0077 **** 9012',
      balance: 2856410.78, currency: 'HKD', symbol: 'HK$', locale: 'zh-CN',
      withdrawn: 980000.00, settled: 1250000.00, pending: 210000.00,
    },
    transactions: hkTransactions as Transaction[],
  },
  smart: {
    account: {
      name: '智能活期', tag: 'CNY', number: '7720 8833 **** 5566',
      balance: 98650.12, currency: 'CNY', symbol: '¥', locale: 'zh-CN',
      withdrawn: 25000.00, settled: 42000.00, pending: 8600.00,
    },
    transactions: smartTransactions as Transaction[],
  },
  unionpay: {
    account: {
      name: '银联支付', tag: 'CNY', number: '6228 4800 **** 3310',
      balance: 3256.80, currency: 'CNY', symbol: '¥', locale: 'zh-CN',
      withdrawn: 12000.00, settled: 8600.00, pending: 2100.00,
    },
    transactions: unionpayTransactions as Transaction[],
  },
}

export const useAccountStore = defineStore('account', () => {
  const tabs = ref<Record<TabId, TabData>>(JSON.parse(JSON.stringify(seedTabs)))
  const activeTab = ref<TabId>('cny')
  const filters = ref<FilterState>({
    type: '',
    search: '',
    dateStart: '',
    dateEnd: '',
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
    filters.value = { type: '', search: '', dateStart: '', dateEnd: '' }
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
