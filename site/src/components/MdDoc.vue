<script setup lang="ts">
import { computed } from 'vue'
import { renderMd } from '../md'

const props = defineProps<{ source: string }>()
const html = computed(() => renderMd(props.source))
</script>

<template>
  <div class="md-doc" v-html="html" />
</template>
