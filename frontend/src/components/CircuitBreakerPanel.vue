<template>
  <div class="panel">
    <h4>⚡ 熔断器状态</h4>
    <div v-for="cb in breakers" :key="cb.taskId" class="cb-row" :class="(resultDef(cb.state)?.className ?? cb.state.toLowerCase())"
      :style="{ background: resultDef(cb.state)?.breakerBackground }">
      <span class="cb-task">{{ cb.taskId }}</span>
      <span class="cb-state" :style="{ color: resultDef(cb.state)?.color }">{{ cb.state }}</span>
      <span class="cb-count">{{ cb.failureCount }} 次失败</span>
    </div>
    <div v-if="!breakers.length" class="empty">无熔断保护激活</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDAGStore } from '../store/dag'
import { getResultDef } from '../constants/executionResults'
const store = useDAGStore()
const breakers = computed(() => store.execution?.circuitBreakers || [])
const resultDef = getResultDef
</script>
<style scoped>
.panel{background:#1a1a2e;border-radius:8px;padding:10px;border:1px solid #2a2a4a}
.panel h4{color:#f87171;font-size:12px;margin-bottom:6px}
.cb-row{display:flex;gap:8px;padding:4px 6px;border-radius:4px;font-size:11px;margin:2px 0}
.cb-task{color:#ccc;font-weight:600}.cb-state{font-weight:700}.cb-count{color:#888;font-size:10px}
.empty{color:#4a5568;font-size:11px}
</style>
