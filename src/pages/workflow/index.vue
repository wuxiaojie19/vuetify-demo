<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow, useEdge } from '@vue-flow/core';
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import MyNode from '@/components/MyNode.vue'
import MyEdge from '@/components/MyEdge.vue'
import type { CustomNode, CustomEdge } from '@/types/workflow'
// const { useEdge } = useVueFlow();

const nodes = ref<CustomNode[]>([
  {
    id: '1',
    // data: { label: 'Node 1' },
    type: "custom",
    data: {
      title: '申请开始',
      events: {
        nodeClick: (a) => {
          console.log(a)
        }
      }
    },
    position: { x: 150, y: 50 },

  },
  {
    id: '2',
    // data: { label: 'Node 2' },
    type: "custom",
    data: {
      title: '审批结束',
      events: {
        nodeClick: (a) => {
          console.log(a)
        }
      }
    },
    position: { x: 150, y: 450 },
  }
])

const edgeClick = (source: CustomNode, target: CustomNode, edgeId: string) => {
  const node = createNode(source.position.x, source.position.y + 200);
  nodes.value.push(node)
  const edge = createEdge(source.id, node.id)
  edges.value.push(edge)
  const selfEdge = edges.value.find(e => e.id === edgeId)
  if (selfEdge) {
    // console.log(selfEdge)
    selfEdge.source = node.id
  }
  console.log(selfEdge)
}


const edges = ref<CustomEdge[]>([
  {
    id: '9999',
    source: '1',
    target: '2',
    type: 'button',
    updatable: true,
    data: {
      events: {
        edgeClick: edgeClick
      }
    }
  }
]);

const createNode = (x: number, y: number) => {
  return {
    id: new Date().getMilliseconds().toString(),
    type: "custom",
    data: {
      title: '审批者',
      events: {
        nodeClick: (a: any) => {
          console.log(a)
        }
      }
    },
    position: { x, y },
  }
}
const createEdge = (sourceId: string, targetId: string) => {
  return {
    id: new Date().getMilliseconds().toString(),
    source: sourceId,
    target: targetId,
    type: 'button',
    data: {
      events: {
        edgeClick: edgeClick
      }
    }
  }
}
</script>

<template>
  <div style="width: calc(100%)+0px;height: 100VH;">
    <VueFlow :nodes="nodes" :edges="edges">
      <template #node-custom="customNodeProps">
        <MyNode v-bind="customNodeProps" />
      </template>
      <template #edge-button="buttonEdgeProps">
        <MyEdge v-bind="buttonEdgeProps" />
      </template>

      <template #edge-custom="customEdgeProps">
        <MyEdge v-bind="customEdgeProps" />
      </template>
      <MiniMap position="top-right" />
      <Background />
    </VueFlow>
  </div>
</template>
<style></style>
