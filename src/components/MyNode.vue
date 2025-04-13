<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Handle } from '@vue-flow/core'
import { Position } from '@vue-flow/core'
import type { CustomeNodeData } from '@/types/workflow'
import { EdgeLabelRenderer } from '@vue-flow/core';

const props = defineProps<NodeProps<CustomeNodeData>>()

const nodeClick = (e: MouseEvent) => {
  props.data.events?.nodeClick(e)
}


const plusApprovalClick = (edgeId: string) => {
}
const plusConditionClick = (edgeId: string) => {
}

const showBtn = ref(false)
const upBtn = ref([150, -50])

watch(() => props.data.approvalNode, () => {
  showBtn.value = props.data.approvalNode.previus && props.data.approvalNode.previus.size > 1 || false
}, { immediate: true, deep: true })
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
  name: 'CustomNode',
}
</script>
<template>

  <!-- <div v-if="showBtn" :style="{
    pointerEvents: 'all',
    position: 'absolute',
    transform: `translate(-50%, -50%) translate(${upBtn[0]}px,${upBtn[1]}px)`,
  }" class="nodrag nopan">

    <v-speed-dial location="right center" transition="scale-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" icon="mdi-plus"></v-fab>
      </template>
      <div key="999">
        <v-tooltip key="000" text="条件を追加" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn key="00" v-bind="props" icon="mdi-alpha-c-box-outline" @click="plusConditionClick(id)" :flat="false"
              text="条件" />
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
  </div> -->



  <div>

    <div>
      <p v-for="privirus in data.approvalNode.previus" :key="privirus.id">{{ privirus.id }}</p>
    </div>

    <Handle type="target" :position="Position.Top" />
    <v-card class="mx-auto" :subtitle="data.subtitle" :title="data.title" :flat="false" density="comfortable"
      :width="data.width" :height="data.height">
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


    <div>
      <!-- <p>{{ data.approvalNode.next?.id }}</p> -->
    </div>
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
