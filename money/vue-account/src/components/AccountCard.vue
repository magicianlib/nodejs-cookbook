<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useMoneyFormat } from '@/composables/useMoneyFormat'
import AccountBalance from './AccountBalance.vue'

const store = useAccountStore()
const { formatScaledAmount, formatMoney } = useMoneyFormat()

const acc = computed(() => store.currentAccount)
const stats = computed(() => store.monthlyStats)
const net = computed(() => stats.value.income - stats.value.expense)

const balanceParts = computed(() =>
  formatScaledAmount(acc.value.balance, acc.value.locale),
)
const withdrawnParts = computed(() =>
  formatScaledAmount(acc.value.withdrawn, acc.value.locale),
)
const settledParts = computed(() =>
  formatScaledAmount(acc.value.settled, acc.value.locale),
)
const pendingParts = computed(() =>
  formatScaledAmount(acc.value.pending, acc.value.locale),
)
</script>

<template>
  <v-card variant="outlined" rounded="lg" class="account-card">
    <!-- Top: account info + balance -->
    <div class="d-flex justify-space-between align-start pt-6 px-8">
      <div class="d-flex flex-column ga-1">
        <div class="d-flex align-center ga-2">
          <span class="text-subtitle-2 font-weight-bold">{{ acc.name }}</span>
          <span class="tag">{{ acc.tag }}</span>
        </div>
        <span class="account-number">{{ acc.number }}</span>
      </div>
      <div class="text-right">
        <AccountBalance
          :parts="balanceParts"
          :symbol="acc.symbol"
          :currency="acc.currency"
        />
        <div class="text-caption text-muted mt-1">可用余额</div>
      </div>
    </div>

    <!-- Monthly stats -->
    <div class="d-flex ga-6 px-8 mt-4 pt-4 pb-4" style="border-top: 1px solid rgb(var(--v-theme-border-light))">
      <div class="d-flex flex-column ga-1">
        <span class="text-caption text-muted">本月收入</span>
        <span class="stat-value income">+{{ acc.symbol }}{{ formatMoney(stats.income) }}</span>
      </div>
      <div class="d-flex flex-column ga-1">
        <span class="text-caption text-muted">本月支出</span>
        <span class="stat-value expense">-{{ acc.symbol }}{{ formatMoney(stats.expense) }}</span>
      </div>
      <div class="d-flex flex-column ga-1">
        <span class="text-caption text-muted">本月净额</span>
        <span class="stat-value" :class="net >= 0 ? 'income' : 'expense'">
          {{ net >= 0 ? '+' : '' }}{{ acc.symbol }}{{ formatMoney(Math.abs(net)) }}
        </span>
      </div>
    </div>

    <!-- Settlement row -->
    <div class="stat-row mx-8 pb-6 pt-3">
      <div class="stat-cell">
        <div class="stat-cell-header">
          <span>已提现</span>
          <a class="detail-link" href="javascript:void(0)">明细</a>
        </div>
        <div class="stat-cell-value">
          <span class="currency-symbol">{{ acc.symbol }}</span>
          <template v-for="(part, i) in withdrawnParts" :key="i">
            <span v-if="part.type === 'digits'" class="amount-digits">{{ part.value }}</span>
            <span v-else-if="part.type === 'scale'" class="amount-scale">{{ part.value }}</span>
            <span v-else class="amount-fraction">{{ part.value }}</span>
          </template>
        </div>
      </div>
      <div class="stat-cell">
        <div class="stat-cell-header">已结算</div>
        <div class="stat-cell-value">
          <span class="currency-symbol">{{ acc.symbol }}</span>
          <template v-for="(part, i) in settledParts" :key="i">
            <span v-if="part.type === 'digits'" class="amount-digits">{{ part.value }}</span>
            <span v-else-if="part.type === 'scale'" class="amount-scale">{{ part.value }}</span>
            <span v-else class="amount-fraction">{{ part.value }}</span>
          </template>
        </div>
      </div>
      <div class="stat-cell">
        <div class="stat-cell-header">待结算</div>
        <div class="stat-cell-value pending">
          <span class="currency-symbol">{{ acc.symbol }}</span>
          <template v-for="(part, i) in pendingParts" :key="i">
            <span v-if="part.type === 'digits'" class="amount-digits">{{ part.value }}</span>
            <span v-else-if="part.type === 'scale'" class="amount-scale">{{ part.value }}</span>
            <span v-else class="amount-fraction">{{ part.value }}</span>
          </template>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.account-card {
  margin-bottom: 24px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 3px;
  background: rgb(var(--v-theme-border-light));
  color: rgb(var(--v-theme-foreground-secondary));
}

.account-number {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: rgb(var(--v-theme-foreground-secondary));
  letter-spacing: 0.02em;
}

.stat-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  font-weight: 500;
}

.stat-value.income { color: rgb(var(--v-theme-income)); }
.stat-value.expense { color: rgb(var(--v-theme-expense)); }

.stat-row {
  display: flex;
  gap: 0;
  border-top: 1px solid rgb(var(--v-theme-border-light));
}

.stat-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.stat-cell + .stat-cell {
  border-left: 1px solid rgb(var(--v-theme-border-light));
  padding-left: 20px;
}

.stat-cell:first-child {
  padding-left: 0;
}

.stat-cell-header {
  font-size: 12px;
  color: rgb(var(--v-theme-muted));
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-link {
  font-size: 11px;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  cursor: pointer;
}

.detail-link:hover { opacity: 0.7; }

.stat-cell-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  color: rgb(var(--v-theme-foreground));
  display: inline-flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.stat-cell-value .currency-symbol {
  font-size: inherit;
  font-weight: inherit;
  color: rgb(var(--v-theme-foreground-secondary));
  margin-right: 3px;
  line-height: 1;
}

.stat-cell-value .amount-digits {
  letter-spacing: 0.01em;
  line-height: 1;
}

.stat-cell-value .amount-scale {
  font-size: 12px;
  font-weight: 700;
  font-family: 'IBM Plex Sans', sans-serif;
  color: rgb(var(--v-theme-primary));
  margin: 0 2px;
  line-height: 1;
}

.stat-cell-value .amount-fraction {
  color: rgb(var(--v-theme-foreground-secondary));
  line-height: 1;
}

.stat-cell-value.pending {
  color: rgb(var(--v-theme-primary));
}

.stat-cell-value.pending .amount-scale {
  color: rgb(var(--v-theme-primary));
}
</style>
