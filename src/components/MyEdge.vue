<script setup lang="ts">
import type { EdgeProps } from '@vue-flow/core';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'
import type { CustomEdgeData } from '@/types/workflow'

// props were passed from the slot using `v-bind="customEdgeProps"`
const props = defineProps<EdgeProps<CustomEdgeData>>();
const path = computed(() => getBezierPath(props))

const plusApprovalClick = (edgeId: string) => {
  props.data.events?.edgeClick(props.sourceNode, props.targetNode, edgeId, "Approver")
}
const plusConditionClick = (edgeId: string) => {
  props.data.events?.edgeClick(props.sourceNode, props.targetNode, edgeId, "ConditionGroup")
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

      <v-speed-dial location="right center" transition="scale-transition">
        <template v-slot:activator="{ props: activatorProps }">
          <v-fab v-bind="activatorProps" icon="mdi-plus"></v-fab>
        </template>
        <div key="999">
          <v-tooltip key="000" text="条件を追加" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn key="00" v-bind="props" icon="mdi-alpha-c-box-outline" @click="plusConditionClick(id)"
                :flat="false" text="条件" />
            </template>
          </v-tooltip>
          <v-tooltip key="111" text="承認者を追加" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn key="1" v-bind="props" icon="mdi-account-box-multiple-outline" @click="plusApprovalClick(id)"
                :flat="false" text="承認者" />
            </template>
          </v-tooltip>
        </div>
      </v-speed-dial>
    </div>
  </EdgeLabelRenderer>
</template>
