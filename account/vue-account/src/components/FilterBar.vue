<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '@/stores/account'

const store = useAccountStore()

const dateStart = computed<Date | null>({
  get: () => store.filters.dateStart ? new Date(store.filters.dateStart) : null,
  set: (val: Date | null) => {
    store.filters.dateStart = val ? val.toISOString().substring(0, 10) : ''
  },
})

const dateEnd = computed<Date | null>({
  get: () => store.filters.dateEnd ? new Date(store.filters.dateEnd) : null,
  set: (val: Date | null) => {
    store.filters.dateEnd = val ? val.toISOString().substring(0, 10) : ''
  },
})

const typeItems = [
  { title: '全部', value: '' },
  { title: '收入', value: 'income' },
  { title: '支出', value: 'expense' },
]
</script>

<template>
  <v-card variant="outlined" rounded="md" class="pa-4 filter-bar">
    <div class="filter-row">
      <v-date-input
        v-model="dateStart"
        label="起始日期"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        prepend-icon=""
        append-inner-icon="$calendar"
        input-format="yyyy-MM-dd"
        class="filter-field filter-date"
      />
      <v-date-input
        v-model="dateEnd"
        label="截止日期"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        prepend-icon=""
        append-inner-icon="$calendar"
        input-format="yyyy-MM-dd"
        class="filter-field filter-date"
      />
      <v-text-field
        v-model="store.filters.search"
        label="交易描述"
        placeholder="搜索交易..."
        variant="outlined"
        density="compact"
        hide-details
        append-inner-icon="mdi-magnify"
        class="filter-field filter-search"
      />
      <v-select
        v-model="store.filters.type"
        label="类型"
        :items="typeItems"
        variant="outlined"
        density="compact"
        hide-details
        class="filter-field filter-type"
      />
      <div class="filter-actions">
        <v-btn variant="outlined" size="small" @click="store.resetFilters()">
          <v-icon start>mdi-refresh</v-icon>
          重置
        </v-btn>
        <v-btn variant="outlined" size="small">
          <v-icon start>mdi-download</v-icon>
          导出
        </v-btn>
        <v-btn variant="outlined" size="small" @click="store.openDialog('income')">
          <v-icon start>mdi-plus</v-icon>
          记一笔
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.filter-bar {
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

/* ── Field widths ─────────────────────────────────────── */
.filter-field {
  font-size: 13px;
}

/* Constrain all filter fields to consistent compact height */
.filter-field :deep(.v-field) {
  min-height: 40px;
  max-height: 40px;
}

.filter-field :deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 40px;
}

.filter-date {
  width: 175px;
  flex-shrink: 0;
}

.filter-search {
  width: 200px;
  flex-shrink: 0;
}

.filter-type {
  width: 110px;
  flex-shrink: 0;
}

/* ── Date field monospace ─────────────────────────────── */
.filter-date :deep(.v-field__input) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
}

/* ── Actions ──────────────────────────────────────────── */
.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-date,
  .filter-search,
  .filter-type {
    width: 100%;
  }
  .filter-actions {
    margin-left: 0;
    flex-wrap: wrap;
  }
}
</style>
