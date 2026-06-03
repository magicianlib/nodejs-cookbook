<script setup lang="ts">
import { useAccountStore } from '@/stores/account'

const store = useAccountStore()
</script>

<template>
  <v-card variant="outlined" rounded="md" class="py-4 px-5 filter-bar">
    <div class="d-flex flex-wrap align-end ga-3">
      <div class="filter-group">
        <label class="filter-label">起始日期</label>
        <input
          v-model="store.filters.dateStart"
          type="date"
          class="filter-input"
        />
      </div>
      <div class="filter-group">
        <label class="filter-label">截止日期</label>
        <input
          v-model="store.filters.dateEnd"
          type="date"
          class="filter-input"
        />
      </div>
      <div class="filter-group">
        <label class="filter-label">交易描述</label>
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="store.filters.search"
            placeholder="搜索交易..."
            class="filter-input has-icon"
            type="text"
          />
        </div>
      </div>
      <div class="filter-group">
        <label class="filter-label">类型</label>
        <select v-model="store.filters.type" class="filter-input">
          <option value="">全部</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
      </div>
      <div class="filter-actions">
        <button class="btn btn-ghost" @click="store.resetFilters()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          重置
        </button>
        <button class="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          导出
        </button>
        <button class="btn btn-add" @click="store.openDialog('income')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          记一笔
        </button>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.filter-bar {
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--v-theme-muted));
}

.filter-input {
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgb(var(--v-theme-border));
  border-radius: 6px;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-foreground));
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 120ms ease;
  -webkit-appearance: none;
}

.filter-input:focus {
  border-color: rgb(var(--v-theme-primary));
}

.filter-input::placeholder {
  color: rgb(var(--v-theme-muted));
}

.filter-input[type="date"] {
  font-family: 'IBM Plex Mono', monospace;
  width: 140px;
}

.filter-input[type="text"] {
  width: 160px;
}

select.filter-input {
  width: 120px;
  cursor: pointer;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgb(var(--v-theme-muted));
  pointer-events: none;
}

.has-icon {
  padding-left: 32px;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-left: auto;
}

.btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  border: none;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 120ms ease;
}

.btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.btn-ghost {
  background: transparent;
  color: rgb(var(--v-theme-primary));
  border: 1px solid rgb(var(--v-theme-border));
}

.btn-ghost:hover {
  background: rgb(var(--v-theme-border-light));
}

.btn-add {
  background: transparent;
  color: rgb(var(--v-theme-foreground-secondary));
  border: 1px solid rgb(var(--v-theme-border));
}

.btn-add:hover {
  background: rgb(var(--v-theme-border-light));
  color: rgb(var(--v-theme-foreground));
}

@media (max-width: 768px) {
  .filter-bar :deep(.d-flex) {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-input[type="date"],
  .filter-input[type="text"],
  select.filter-input {
    width: 100%;
  }
  .filter-actions {
    margin-left: 0;
  }
}
</style>
