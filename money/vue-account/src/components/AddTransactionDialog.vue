<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAccountStore } from '@/stores/account'

const store = useAccountStore()

const amount = ref('')
const desc = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const errorMsg = ref('')

watch(() => store.showDialog, (val) => {
  if (val) {
    amount.value = ''
    desc.value = ''
    date.value = new Date().toISOString().split('T')[0]
    errorMsg.value = ''
  }
})

function submit() {
  const num = parseFloat(amount.value)
  if (!num || num <= 0) {
    errorMsg.value = '请输入有效金额'
    return
  }
  errorMsg.value = ''

  const name = desc.value.trim() || (store.dialogType === 'income' ? '收入' : '支出')
  const dateStr = date.value || new Date().toISOString().split('T')[0]
  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  store.addTransaction({
    type: store.dialogType,
    name,
    amount: num,
    date: `${dateStr} ${timeStr}`,
    status: 'success',
    txNo: `TX${dateStr.replace(/-/g, '')}${String(store.currentTransactions.length + 1).padStart(3, '0')}`,
  })

  store.closeDialog()
}

function close() {
  store.closeDialog()
}
</script>

<template>
  <v-dialog
    :model-value="store.showDialog"
    @update:model-value="store.showDialog = $event"
    max-width="440"
  >
    <v-card rounded="lg">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between modal-head">
        <span class="modal-title">记一笔</span>
        <button class="modal-close" @click="close" aria-label="关闭">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Type toggle — grid layout matching design spec -->
        <div class="type-toggle">
          <button
            type="button"
            class="type-btn"
            :class="{ active: store.dialogType === 'income', 'income-btn': true }"
            @click="store.dialogType = 'income'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
            收入
          </button>
          <button
            type="button"
            class="type-btn"
            :class="{ active: store.dialogType === 'expense', 'expense-btn': true }"
            @click="store.dialogType = 'expense'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75" />
            </svg>
            支出
          </button>
        </div>

        <!-- Amount -->
        <div class="form-group">
          <label class="form-label">金额</label>
          <input
            v-model="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            class="form-input"
            inputmode="decimal"
            autocomplete="off"
          />
          <p class="form-error">{{ errorMsg }}</p>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">备注</label>
          <input
            v-model="desc"
            type="text"
            placeholder="例如：工资、餐饮、交通"
            maxlength="30"
            class="form-input text-input"
            autocomplete="off"
          />
        </div>

        <!-- Date + Account -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">日期</label>
            <input
              v-model="date"
              type="date"
              class="form-input text-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">&nbsp;</label>
            <div class="account-display">
              {{ store.currentAccount.name }} ({{ store.currentAccount.tag }})
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button class="form-submit" @click="submit">确认添加</button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* ── Modal Layout ───────────────────────────────────────── */
.modal-head {
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-foreground));
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 120ms ease, color 120ms ease;
}

.modal-close:hover {
  background: rgb(var(--v-theme-background));
}

.modal-body {
  padding: 20px 24px 24px;
}

/* ── Type Toggle ────────────────────────────────────────── */
.type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
}

.type-btn {
  height: 44px;
  border-radius: 6px;
  border: 2px solid rgb(var(--v-theme-border));
  background: transparent;
  color: rgb(var(--v-theme-muted));
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.type-btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.type-btn.income-btn.active {
  border-color: rgb(var(--v-theme-income));
  background: rgba(var(--v-theme-income), 0.06);
  color: rgb(var(--v-theme-income));
}

.type-btn.expense-btn.active {
  border-color: rgb(var(--v-theme-expense));
  background: rgba(var(--v-theme-expense), 0.06);
  color: rgb(var(--v-theme-expense));
}

/* ── Form ───────────────────────────────────────────────── */
.form-group {
  margin-bottom: 14px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--v-theme-muted));
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgb(var(--v-theme-border));
  border-radius: 6px;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-foreground));
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  transition: border-color 120ms ease;
  -webkit-appearance: none;
  outline: none;
}

.form-input.text-input {
  font-family: 'IBM Plex Sans', sans-serif;
}

.form-input:focus {
  border-color: rgb(var(--v-theme-primary));
}

.form-input::placeholder {
  color: rgb(var(--v-theme-muted));
  font-family: 'IBM Plex Sans', sans-serif;
}

.form-error {
  font-size: 12px;
  color: rgb(var(--v-theme-income));
  margin-top: 3px;
  min-height: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.account-display {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: rgb(var(--v-theme-foreground-secondary));
}

.form-submit {
  width: 100%;
  height: 42px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary-hover)));
  color: rgb(var(--v-theme-onPrimary));
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: opacity 120ms ease;
}

.form-submit:hover {
  opacity: 0.9;
}

.form-submit:focus-visible {
  outline: 2px solid rgb(var(--v-theme-foreground));
  outline-offset: 3px;
}
</style>
