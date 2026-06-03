<script setup lang="ts">
import AppToolbar from '@/components/AppToolbar.vue'
import AccountTabs from '@/components/AccountTabs.vue'
import AccountCard from '@/components/AccountCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import TransactionTable from '@/components/TransactionTable.vue'
import AddTransactionDialog from '@/components/AddTransactionDialog.vue'
</script>

<template>
  <v-app>
    <AppToolbar />
    <v-main>
      <v-container :style="{ maxWidth: '1280px' }" class="pa-6">
        <AccountTabs />
        <AccountCard />
        <FilterBar />
        <TransactionTable />
      </v-container>
    </v-main>
    <AddTransactionDialog />
  </v-app>
</template>
