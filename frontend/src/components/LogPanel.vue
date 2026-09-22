<template>
  <div class="panel">
    <h4>📜 执行日志</h4>
    <div class="log-list">
      <div v-for="(l,i) in logs" :key="i" class="log-row" :class="resultClass(l.status)" :style="logRowStyle(l.status)">
        <span class="l-status">{{ resultLabel(l.status) }}</span>
        <span class="l-task">{{ l.taskId }}</span>
        <span class="l-msg">{{ l.message }}</span>
      </div>
      <div v-if="!logs.length" class="empty">等待执行...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDAGStore } from '../store/dag'
import { resultClass, resultLabel, logRowStyle } from '../utils/executionResult'
const store = useDAGStore()
const logs = computed(() => store.execution?.logs || [])
</script>
<style scoped>
.panel{background:#1a1a2e;border-radius:8px;padding:10px;border:1px solid #2a2a4a;flex:1}
.panel h4{color:#bb86fc;font-size:12px;margin-bottom:6px}
.log-list{max-height:280px;overflow-y:auto;font-size:10px;font-family:monospace}
.log-row{display:flex;gap:6px;padding:2px 4px;border-radius:2px;margin:1px 0}
.l-status{font-weight:700;min-width:60px}.l-task{color:#888;min-width:70px}.l-msg{color:#ccc}.empty{color:#4a5568}
</style>