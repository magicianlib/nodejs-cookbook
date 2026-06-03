<script setup lang="ts">
</script>

<template>
  <v-app-bar flat color="surface" height="56" class="app-toolbar">
    <template #prepend>
      <div class="d-flex align-center ga-4 ml-4">
        <div class="d-flex align-center ga-2">
          <div class="logo-icon">
            <v-icon size="18">mdi-cash-multiple</v-icon>
          </div>
          <span class="text-body-1 font-weight-bold">Money</span>
        </div>
        <div class="d-none d-sm-flex align-center text-caption ga-2 breadcrumb">
          <span>资金管理</span>
          <span>/</span>
          <span class="text-foreground-secondary">账户总览</span>
        </div>
      </div>
    </template>

    <template #append>
      <div class="d-flex align-center ga-3 mr-4">
        <v-btn icon variant="outlined" size="36" class="toolbar-btn">
          <v-icon size="16">mdi-bell-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">通知</v-tooltip>
        </v-btn>
        <div class="d-flex align-center ga-2">
          <v-avatar size="30" color="#6366F1" class="text-white text-caption font-weight-bold">
            张
          </v-avatar>
          <span class="text-caption text-foreground-secondary d-none d-sm-inline">张三</span>
        </div>
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
.app-toolbar {
  border-bottom: 1px solid rgb(var(--v-theme-border)) !important;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary-hover)));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-onPrimary));
}

.breadcrumb {
  color: rgb(var(--v-theme-muted));
}

.text-foreground-secondary {
  color: rgb(var(--v-theme-foreground-secondary));
}

.toolbar-btn {
  border-color: rgb(var(--v-theme-border));
  color: rgb(var(--v-theme-muted));
}

.toolbar-btn:hover {
  border-color: rgb(var(--v-theme-muted));
  color: rgb(var(--v-theme-foreground));
}
</style>
