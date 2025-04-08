<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle } from '@vue-flow/core'
import { Position } from '@vue-flow/core'
import type { CustomeNodeData } from '@/types/workflow'

const props = defineProps<NodeProps<CustomeNodeData>>()

const nodeClick = (e: MouseEvent) => {
  props.data.events?.nodeClick(e)
}
</script>
<template>
  <div>
    <v-btn text="条件を追加" prepend-icon="mdi-plus" color="paimary" variant="outlined" density="comfortable"
      @click=nodeClick :width="data.width" :height="data.height" />
    <Handle type="target" id="target-t" :position="Position.Top" :connectable="false" />
    <Handle type="source" id="source-l" :position="Position.Left" :connectable="false" />
    <Handle type="source" id="source-r" :position="Position.Right" :connectable="false" />
    <Handle type="source" id="source-b" :position="Position.Bottom" :connectable="false" />
  </div>
</template>
