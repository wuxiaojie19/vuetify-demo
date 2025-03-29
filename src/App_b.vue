<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import SaveRestoreControls from './Controls.vue'
import { MiniMap } from '@vue-flow/minimap'

const nodes = ref([{ id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } }])

const edges = ref([])
</script>

<template>
  <div style="width: 900px;height: 500px;">
    <VueFlow :nodes="nodes" :edges="edges">
      <SaveRestoreControls />
      <Controls>
        <ControlButton>
          <i class="fa fa-plus"></i>
        </ControlButton>
      </Controls>
      <MiniMap />
      <Background />
    </VueFlow>
  </div>
</template>
<style></style>
