<script setup lang="ts">
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
</script>

<template>
  <div class="pnf-root">
    <AppIcon>error_outline</AppIcon>
    <h1>404</h1>
    <p>Página no encontrada</p>
    <RouterLink
      to="/conductor/login"
      class="sb-btn-primary"
      style="width: auto; padding: 12px 32px; text-decoration: none; display: inline-flex"
    >
      VOLVER AL INICIO
    </RouterLink>
  </div>
</template>

<style scoped>
.pnf-root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: var(--sb-bg); color: var(--sb-white); }
.app-icon { font-size: 64px; width: 64px; height: 64px; color: var(--sb-accent); }
h1 { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 80px; color: var(--sb-accent); line-height: 1; }
p { font-size: 16px; color: var(--sb-gray); }
</style>
