export interface Account {
  name: string
  tag: string
  number: string
  balance: number
  currency: string
  symbol: string
  locale: string
  withdrawn: number
  settled: number
  pending: number
}

export interface Transaction {
  type: 'income' | 'expense'
  name: string
  amount: number
  date: string
  status: 'success' | 'pending'
  txNo: string
}

export type TabId = 'cny' | 'usd' | 'eur' | 'hk' | 'smart' | 'unionpay'

export interface TabData {
  account: Account
  transactions: Transaction[]
}

export interface ScaledPart {
  type: 'digits' | 'scale' | 'fraction'
  value: string
}

export interface FilterState {
  type: '' | 'income' | 'expense'
  search: string
  dateStart: string
  dateEnd: string
}

export interface MonthlyStats {
  income: number
  expense: number
}

export interface TabConfig {
  id: TabId
  label: string
}
