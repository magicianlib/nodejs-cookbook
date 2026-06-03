<script setup lang="ts">
import type { ScaledPart } from '@/types/account'

defineProps<{
  parts: ScaledPart[]
  symbol: string
  currency: string
}>()
</script>

<template>
  <div class="amount-row">
    <span class="currency-symbol">{{ symbol }}</span>
    <template v-for="(part, i) in parts" :key="i">
      <span v-if="part.type === 'digits'" class="amount-digits">{{ part.value }}</span>
      <span v-else-if="part.type === 'scale'" class="amount-scale">{{ part.value }}</span>
      <span v-else class="amount-fraction">{{ part.value }}</span>
    </template>
    <span class="currency-code">{{ currency }}</span>
  </div>
</template>

<style scoped>
.amount-row {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 26px;
  font-weight: 600;
  color: rgb(var(--v-theme-foreground));
  display: inline-flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.currency-symbol {
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-foreground-secondary));
  margin-right: 3px;
  align-self: flex-end;
  line-height: 1;
}

.amount-digits {
  letter-spacing: 0.01em;
  line-height: 1;
}

.amount-scale {
  font-size: 15px;
  font-weight: 700;
  font-family: 'IBM Plex Sans', sans-serif;
  color: rgb(var(--v-theme-primary));
  margin: 0 2px;
  line-height: 1;
}

.amount-fraction {
  color: rgb(var(--v-theme-foreground-secondary));
  line-height: 1;
}

.currency-code {
  font-size: 11px;
  font-weight: 600;
  font-family: 'IBM Plex Sans', sans-serif;
  letter-spacing: 0.06em;
  color: rgb(var(--v-theme-foreground-secondary));
  background: rgb(var(--v-theme-border-light));
  padding: 2px 8px;
  border-radius: 3px;
  margin-left: 10px;
  flex-shrink: 0;
  align-self: flex-end;
  line-height: 1.4;
}
</style>
