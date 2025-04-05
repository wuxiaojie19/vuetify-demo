<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from "uuid";
import { VueFlow, useVueFlow, useEdge, } from '@vue-flow/core';
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import MyNode from '@/components/MyNode.vue'
import MyEdge from '@/components/MyEdge.vue'
import type { CustomNode, CustomEdge, ApprovalNode, Approval, ApprovalCondition } from '@/types/workflow'
import { createNode, appendApprovalNode } from '@/types/workflow'
// const { useEdge } = useVueFlow();

const { removeEdges, removeNodes } = useVueFlow()

const approvalNode = ref<ApprovalNode>(createNode({
  nodeType: "Applicant",
}))

appendApprovalNode(approvalNode.value, createNode({
  nodeType: "End",
}))
const x = 0;
const y = 10;
const s = 280;

const nodes = ref<CustomNode[]>(
  []
  //   [
  //   {
  //     id: '1',
  //     // data: { label: 'Node 1' },
  //     type: "custom",
  //     data: {
  //       title: '申请开始',
  //       events: {
  //         nodeClick: (a) => {
  //           console.log(a)
  //         }
  //       }
  //     },
  //     position: { x: 150, y: 50 },

  //   },
  //   {
  //     id: '2',
  //     // data: { label: 'Node 2' },
  //     type: "custom",
  //     data: {
  //       title: '审批结束',
  //       events: {
  //         nodeClick: (a) => {
  //           console.log(a)
  //         }
  //       }
  //     },
  //     position: { x: 150, y: 450 },
  //   }
  // ]
)

const edgeClick = (sourceApprovalNode: ApprovalNode, source: CustomNode, target: CustomNode, edgeId: string) => {

  const aNode = createNode({
    nodeType: "Approver",
  });
  appendApprovalNode(sourceApprovalNode, aNode)
  // const node = createNode(source.position.x, source.position.y + 200);
  // nodes.value.push(node)
  // const edge = createEdge(source.id, node.id)
  // edges.value.push(edge)
  // const selfEdge = edges.value.find(e => e.id === edgeId)
  // if (selfEdge) {
  //   // console.log(selfEdge)
  //   selfEdge.source = node.id
  // }
  // console.log(selfEdge)
}


const edges = ref<CustomEdge[]>([
  // {
  //   id: '9999',
  //   source: '1',
  //   target: '2',
  //   type: 'button',
  //   updatable: true,
  //   data: {
  //     events: {
  //       edgeClick: edgeClick
  //     }
  //   }
  // }
]);

// const createNode = (x: number, y: number) => {
//   return {
//     id: new Date().getMilliseconds().toString(),
//     type: "custom",
//     data: {
//       title: '审批者',
//       events: {
//         nodeClick: (a: any) => {
//           console.log(a)
//         }
//       }
//     },
//     position: { x, y },
//   }
// }
const createEdge = (sourceApprovalNode: ApprovalNode, sourceId: string, targetId: string) => {
  return {
    id: uuidv4(),
    source: sourceId,
    target: targetId,
    type: 'button',
    data: {
      events: {
        edgeClick: edgeClick
      },
      sourceApprovalNode
    }
  }
}

const refreshNodes = (anodes: ApprovalNode, y: number) => {
  nodes.value.push({
    id: anodes.id,
    // data: { label: 'Node 1' },
    type: "custom",
    data: {
      title: anodes.title,
      events: {
        nodeClick: (a) => {
          console.log(a)
        }
      }
    },
    position: { x: x, y: y + s },

  },)

  if (anodes.next) {
    const edge = createEdge(anodes, anodes.id, anodes.next.id)
    edges.value.push(edge)
    refreshNodes(anodes.next, y + s)
    return
  }
  console.log(nodes.value)
}

watch(approvalNode, () => {
  nodes.value.splice(0)
  edges.value.splice(0)
  nodes.value.push(
    {
      id: approvalNode.value.id,
      // data: { label: 'Node 1' },
      type: "custom",
      data: {
        title: approvalNode.value.title,
        events: {
          nodeClick: (a) => {
            console.log(a)
          }
        }
      },
      position: { x: x, y: y },

    },
  )

  if (approvalNode.value.next) {
    const edge = createEdge(approvalNode.value, approvalNode.value.id, approvalNode.value.next.id)
    edges.value.push(edge)
    refreshNodes(approvalNode.value.next, y)
  }
}, { immediate: true, deep: true })


</script>

<template>
  <div style="width: calc(100%)+0px;height: 100VH;">
    <VueFlow :nodes="nodes" :fit-view-on-init="true" :max-zoom="1" :edges="edges" :pan-on-scroll="true"
      :zoom-on-double-click="false" :zoom-on-scroll="false" :pan-on-drag="false" :zoom-on-pinch="false"
      :prevent-scrolling="false">
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
