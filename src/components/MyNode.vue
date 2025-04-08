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
    <Handle type="target" :position="Position.Top" />
    <v-card class="mx-auto" :subtitle="data.subtitle" :title="data.title" :flat="false"
      density="comfortable" :width="data.width" :height="data.height">
      <template v-slot:prepend>
        <v-img :width="20" src="../assets/ODLS_W.png" />
      </template>
      <template v-slot:append>
      </template>
      <v-card-text class="bg-surface-light pt-4">
        {{ id }}
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer />
        <v-btn text="删除" color="paimary" variant="outlined" density="comfortable"></v-btn>
      </v-card-actions>
    </v-card>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>


<style scoped>
.cls_node {
  width: 200px;
  height: 50px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
}
</style>
