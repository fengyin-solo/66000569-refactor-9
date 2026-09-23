import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
export const useDAGStore = defineStore('dag', () => {
    const loading = ref(false);
    const workflow = ref(null);
    const execution = ref(null);
    const wsConnected = ref(false);
    const workers = ref(3);
    const strategy = ref('fifo');
    let ws = null;
    function connectWS() {
        ws = new WebSocket(`ws://${location.hostname}:8000/ws`);
        ws.onopen = () => { wsConnected.value = true; };
        ws.onmessage = (e) => {
            try {
                const d = JSON.parse(e.data);
                execution.value = d;
            }
            catch { }
        };
    }
    async function createWorkflow(name) {
        loading.value = true;
        try {
            const { data } = await axios.post('/api/workflow', { name });
            workflow.value = data;
        }
        finally {
            loading.value = false;
        }
    }
    async function run() {
        if (!workflow.value)
            return;
        loading.value = true;
        try {
            const { data } = await axios.post('/api/run', { workflowId: workflow.value.id, workers: workers.value, strategy: strategy.value });
            execution.value = data;
        }
        finally {
            loading.value = false;
        }
    }
    function disconnectWS() { ws?.close(); ws = null; }
    return { loading, workflow, execution, wsConnected, workers, strategy, connectWS, createWorkflow, run, disconnectWS };
});
