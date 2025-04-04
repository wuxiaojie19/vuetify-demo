<script setup lang="ts">
import type { EdgeProps } from '@vue-flow/core';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'
import type { CustomEdgeData } from '@/types/workflow'

// props were passed from the slot using `v-bind="customEdgeProps"`
const props = defineProps<EdgeProps<CustomEdgeData>>();
const path = computed(() => getBezierPath(props))

const plusClick = (edgeId: string) => {
  props.data.events?.edgeClick(props.sourceNode, props.targetNode, edgeId)
}
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
  name: 'CustomEdge',
}
</script>
<template>

  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />
  <EdgeLabelRenderer>
    <div :style="{
      pointerEvents: 'all',
      position: 'absolute',
      transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
    }" class="nodrag nopan">
      <v-btn icon="mdi-plus" size="30" @click="plusClick(id)" />
    </div>
  </EdgeLabelRenderer>
</template>
