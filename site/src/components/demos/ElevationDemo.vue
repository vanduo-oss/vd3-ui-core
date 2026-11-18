<script setup lang="ts">
import { shadowLevels } from '../../spec'
</script>

<template>
  <div class="elev">
    <div v-for="s in shadowLevels" :key="s.level" class="elev-card" :style="{ boxShadow: s.css }">
      {{ s.token }}<br />{{ s.pair }}
    </div>
  </div>
</template>

<style scoped>
.elev { display: flex; gap: var(--vd-space-fib-21); flex-wrap: wrap; align-items: flex-end; margin-block-start: var(--vd-space-fib-13); }
.elev-card {
  inline-size: 132px; background: var(--vd-bg-primary); border-radius: var(--vd-border-radius-md);
  padding: var(--vd-space-fib-8); text-align: center; font-size: 0.75rem;
  color: var(--vd-text-secondary); border: 1px solid var(--vd-border-color);
}
</style>
