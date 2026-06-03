<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAccountStore } from '@/stores/account'

const store = useAccountStore()

const amount = ref('')
const desc = ref('')
const date = ref<Date>(new Date())
const errorMsg = ref('')

watch(() => store.showDialog, (val) => {
  if (val) {
    amount.value = ''
    desc.value = ''
    date.value = new Date()
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
  const dateVal = date.value || new Date()
  const dateStr = dateVal.toISOString().substring(0, 10)
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
        <v-btn icon variant="text" size="small" @click="close" aria-label="关闭">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Type toggle -->
        <v-btn-toggle
          v-model="store.dialogType"
          mandatory
          divided
          class="type-toggle"
        >
          <v-btn value="income">
            <v-icon start size="16">mdi-arrow-up</v-icon>
            收入
          </v-btn>
          <v-btn value="expense">
            <v-icon start size="16">mdi-arrow-down</v-icon>
            支出
          </v-btn>
        </v-btn-toggle>

        <!-- Amount -->
        <div class="form-group">
          <v-text-field
            v-model="amount"
            type="number"
            label="金额"
            variant="outlined"
            prefix="¥"
            placeholder="0.00"
            hide-details
            inputmode="decimal"
            autocomplete="off"
            class="amount-field"
          />
          <p class="form-error">{{ errorMsg }}</p>
        </div>

        <!-- Description -->
        <div class="form-group">
          <v-text-field
            v-model="desc"
            label="备注"
            placeholder="例如：工资、餐饮、交通"
            variant="outlined"
            hide-details
            maxlength="30"
            autocomplete="off"
          />
        </div>

        <!-- Date + Account -->
        <div class="form-row">
          <v-date-input
            v-model="date"
            label="日期"
            variant="outlined"
            hide-details
            prepend-icon=""
            append-inner-icon="$calendar"
            input-format="yyyy-MM-dd"
          />
          <div class="account-display">
            {{ store.currentAccount.name }} ({{ store.currentAccount.tag }})
          </div>
        </div>

        <!-- Submit -->
        <v-btn
          color="primary"
          variant="flat"
          block
          size="large"
          class="submit-btn"
          @click="submit"
        >
          确认添加
        </v-btn>
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

.modal-body {
  padding: 20px 24px 24px;
}

/* ── Type Toggle ────────────────────────────────────────── */
.type-toggle {
  width: 100%;
  margin-bottom: 20px;
}

.type-toggle :deep(.v-btn) {
  flex: 1;
  height: 44px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  border: 2px solid rgb(var(--v-theme-border));
}

.type-toggle :deep(.v-btn:first-child.v-btn--active) {
  background: rgba(var(--v-theme-income), 0.06);
  color: rgb(var(--v-theme-income));
  border-color: rgb(var(--v-theme-income));
}

.type-toggle :deep(.v-btn:last-child.v-btn--active) {
  background: rgba(var(--v-theme-expense), 0.06);
  color: rgb(var(--v-theme-expense));
  border-color: rgb(var(--v-theme-expense));
}

/* ── Form ───────────────────────────────────────────────── */
.form-group {
  margin-bottom: 14px;
}

.form-error {
  font-size: 12px;
  color: rgb(var(--v-theme-income));
  margin-top: 3px;
  min-height: 16px;
}

.amount-field :deep(input[type="number"]::-webkit-inner-spin-button),
.amount-field :deep(input[type="number"]::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.amount-field :deep(input[type="number"]) {
  -moz-appearance: textfield;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.account-display {
  font-size: 13px;
  color: rgb(var(--v-theme-foreground-secondary));
  white-space: nowrap;
  padding-top: 18px;
}

/* ── Submit button gradient ─────────────────────────────── */
.submit-btn {
  margin-top: 20px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary-hover))) !important;
  color: rgb(var(--v-theme-onPrimary)) !important;
}
</style>
