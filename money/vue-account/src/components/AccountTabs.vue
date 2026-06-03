<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import type { TabId, TabConfig } from '@/types/account'

const store = useAccountStore()

const tabItems: TabConfig[] = [
  { id: 'cny', label: '人民币账户 (CNY)' },
  { id: 'usd', label: '外汇账户 (USD)' },
  { id: 'eur', label: '外汇账户 (EUR)' },
  { id: 'hk', label: '外汇账户 (HKD)' },
  { id: 'smart', label: '智能账户' },
  { id: 'unionpay', label: '银联支付' },
]
</script>

<template>
  <div class="tabs-wrapper">
    <v-tabs
      :model-value="store.activeTab"
      @update:model-value="store.setActiveTab($event as TabId)"
      color="primary"
      slider-color="primary"
      show-arrows
      density="default"
      class="account-tabs"
    >
      <v-tab
        v-for="item in tabItems"
        :key="item.id"
        :value="item.id"
      >
        {{ item.label }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<style scoped>
.tabs-wrapper {
  position: sticky;
  top: 56px;
  z-index: 10;
  background: rgb(var(--v-theme-background));
  border-bottom: 1px solid rgb(var(--v-theme-border));
  margin-bottom: 24px;
}

.account-tabs :deep(.v-tab) {
  font-size: 14px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
  padding: 12px 20px;
  color: rgb(var(--v-theme-muted));
  transition: color 120ms ease;
}

.account-tabs :deep(.v-tab--selected) {
  font-weight: 600;
  color: rgb(var(--v-theme-foreground));
}

.account-tabs :deep(.v-tab:hover) {
  color: rgb(var(--v-theme-foreground-secondary));
}

.account-tabs :deep(.v-slider) {
  height: 2px;
}

.account-tabs :deep(.v-slider-track) {
  --v-tabs-slider-color: rgb(var(--v-theme-primary));
}
</style>
