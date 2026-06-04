<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useMoneyFormat } from '@/composables/useMoneyFormat'
import type { Transaction } from '@/types/account'

const store = useAccountStore()
const { formatMoney } = useMoneyFormat()

const acc = computed(() => store.currentAccount)
const page = ref(1)
const itemsPerPage = ref(10)

const headers = computed(() => [
  { title: '日期', key: 'date', sortable: false },
  { title: '交易号', key: 'txNo', sortable: false },
  { title: '描述', key: 'name', sortable: false },
  { title: '类型', key: 'type', sortable: false, align: 'center' as const },
  { title: '状态', key: 'status', sortable: false, align: 'center' as const },
  { title: `金额 (${acc.value.currency})`, key: 'amount', sortable: false, align: 'end' as const },
  { title: `余额 (${acc.value.currency})`, key: 'balance', sortable: false, align: 'end' as const },
])

// Compute running balance
const tableItems = computed(() => {
  const txs = store.filteredTransactions
  let bal = acc.value.balance
  return txs.map((tx) => {
    const row = { ...tx, balance: bal }
    if (tx.type === 'income') bal -= tx.amount
    else bal += tx.amount
    return row
  })
})

const totalPages = computed(() => Math.ceil(tableItems.value.length / itemsPerPage.value))

const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: number[] = [1]
  const start = Math.max(2, page.value - 2)
  const end = Math.min(total - 1, page.value + 2)
  if (start > 2) pages.push(-1) // ellipsis marker
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push(-2) // ellipsis marker
  if (total > 1) pages.push(total)
  return pages
})

/*  Height calc:
 *  100vh - 56(toolbar) - 48(tabs) - 49(table-header) - ~45(pagination) - 24(container pad) - 2(card border)
 *  ≈ 100vh - 224px  */
const tableBodyHeight = 'calc(100vh - 224px)'

function formatAmount(tx: Transaction): string {
  const prefix = tx.type === 'income' ? '+' : '-'
  return `${prefix}${acc.value.symbol}${formatMoney(tx.amount)}`
}

function formatBalance(row: { balance: number }): string {
  return `${acc.value.symbol}${formatMoney(row.balance)}`
}

function statusLabel(s: string): string {
  return s === 'success' ? '已完成' : '处理中'
}

function typeLabel(t: string): string {
  return t === 'income' ? '收入' : '支出'
}
</script>

<template>
  <v-card variant="outlined" rounded="md" class="table-card">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between py-4 px-5 table-header">
      <div class="d-flex align-center">
        <span class="text-subtitle-2 font-weight-bold">交易明细</span>
        <span class="text-caption text-muted ml-2">共 {{ tableItems.length }} 条</span>
      </div>
    </div>

    <!-- Table -->
    <v-data-table
      v-model:page="page"
      :headers="headers"
      :items="tableItems"
      :items-per-page="itemsPerPage"
      fixed-header
      :height="tableBodyHeight"
      hover
      density="comfortable"
      class="money-table"
    >
      <template #item.date="{ item }">
        <span class="tx-mono">{{ item.date }}</span>
      </template>

      <template #item.txNo="{ item }">
        <span class="tx-mono tx-secondary">{{ item.txNo }}</span>
      </template>

      <template #item.type="{ item }">
        <span class="tx-type-badge" :class="item.type">
          <v-icon size="12">
            {{ item.type === 'income' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
          </v-icon>
          {{ typeLabel(item.type) }}
        </span>
      </template>

      <template #item.status="{ item }">
        <span
          class="status-badge"
          :class="item.status === 'success' ? 'status-success' : 'status-pending'"
        >
          {{ statusLabel(item.status) }}
        </span>
      </template>

      <template #item.amount="{ item }">
        <span
          class="tx-mono font-weight-medium text-body-2"
          :class="item.type === 'income' ? 'text-income' : 'text-expense'"
        >
          {{ formatAmount(item) }}
        </span>
      </template>

      <template #item.balance="{ item }">
        <span class="tx-mono tx-secondary text-body-2">
          {{ formatBalance(item) }}
        </span>
      </template>

      <!-- Pagination footer -->
      <template #bottom>
        <div class="d-flex align-center justify-space-between px-5 py-3 table-footer">
          <span class="text-caption text-muted">
            第 {{ page }} 页，共 {{ totalPages }} 页，{{ tableItems.length }} 条记录
          </span>
          <div class="d-flex align-center ga-1">
            <v-btn
              size="x-small"
              variant="outlined"
              icon
              :disabled="page <= 1"
              @click="page--"
              class="page-btn"
            >
              <v-icon size="14">mdi-chevron-left</v-icon>
            </v-btn>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p < 0" class="text-caption text-muted px-1">…</span>
              <v-btn
                v-else
                size="x-small"
                :variant="p === page ? 'flat' : 'outlined'"
                :color="p === page ? 'foreground' : undefined"
                :class="p === page ? 'text-white' : 'page-btn'"
                icon
                @click="page = p"
              >
                {{ p }}
              </v-btn>
            </template>
            <v-btn
              size="x-small"
              variant="outlined"
              icon
              :disabled="page >= totalPages"
              @click="page++"
              class="page-btn"
            >
              <v-icon size="14">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
/* ── Sticky card: sticks below toolbar(56) + tabs(48) ── */
.table-card {
  --sticky-top: 104px;
  position: sticky;
  top: var(--sticky-top);
  z-index: 5;
  background: rgb(var(--v-theme-background));
  max-height: calc(100vh - var(--sticky-top) - 24px);
  overflow: hidden;
}

.table-header {
  border-bottom: 1px solid rgb(var(--v-theme-border));
}

.table-footer {
  border-top: 1px solid rgb(var(--v-theme-border));
}

.tx-mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
}

.tx-secondary {
  color: rgb(var(--v-theme-foreground-secondary));
}

.text-income { color: rgb(var(--v-theme-income)); }
.text-expense { color: rgb(var(--v-theme-expense)); }
.text-muted { color: rgb(var(--v-theme-muted)); }

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background: rgba(var(--v-theme-expense), 0.06);
  color: rgb(var(--v-theme-expense));
}

.status-pending {
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary-hover));
}

.tx-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.tx-type-badge.income {
  background: rgba(var(--v-theme-income), 0.06);
  color: rgb(var(--v-theme-income));
}

.tx-type-badge.expense {
  background: rgba(var(--v-theme-expense), 0.06);
  color: rgb(var(--v-theme-expense));
}

.page-btn {
  width: 32px;
  height: 32px;
  border-color: rgb(var(--v-theme-border));
  color: rgb(var(--v-theme-foreground-secondary));
}

.money-table :deep(table) {
  font-size: 13px;
}

.money-table :deep(thead) {
  background: rgb(var(--v-theme-surface));
}

.money-table :deep(thead th) {
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--v-theme-muted));
  border-bottom: 1px solid rgb(var(--v-theme-border)) !important;
}

.money-table :deep(tbody td) {
  border-bottom: 1px solid rgb(var(--v-theme-border-light)) !important;
}

.money-table :deep(tbody tr:hover td) {
  background: rgb(var(--v-theme-surface-hover));
}
</style>
