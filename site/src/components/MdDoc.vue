<script setup lang="ts">
import { computed } from 'vue'
import { renderMd } from '../md'

const props = defineProps<{
  source: string
  sectionLevel?: number
  tableLabel?: string
}>()
const html = computed(() =>
  renderMd(props.source, {
    sectionLevel: props.sectionLevel,
    tableLabel: props.tableLabel,
  })
)
</script>

<template>
  <div class="md-doc" v-html="html" />
</template>
