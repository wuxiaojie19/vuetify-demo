<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from "uuid";
import { VueFlow, useVueFlow, useEdge, Position } from '@vue-flow/core';
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import MyNode from '@/components/MyNode.vue'
import MyConditionNode from '@/components/MyConditionNode.vue'
import MyEdge from '@/components/MyEdge.vue'
import type { CustomNode, CustomEdge, ApprovalNode, NodeType, ApprovalCondition, } from '@/types/workflow'
import { createAppandNode, appendApprovalNode, isApprovalConditionNode, refixNodePositon, useNodeSize } from '@/types/workflow'

const { removeEdges, removeNodes } = useVueFlow()

const x = 0;
const y = 0;

const approvalNode = ref<ApprovalNode>(createAppandNode({
  nodeType: "Applicant",
  position: {
    x, y
  }
}))

appendApprovalNode(approvalNode.value, createAppandNode({
  nodeType: "End"
}))
refixNodePositon(approvalNode.value)
const nodes = ref<CustomNode[]>([])
const edges = ref<CustomEdge[]>([])


const edgeClick = (source: CustomNode, target: CustomNode, edgeId: string, nodeType: NodeType) => {

  if (nodeType === "Condition") {
    let sourceNode = source.data?.approvalNode;
    if (source.data?.approvalNode.nodeType === "Approver" || source.data?.approvalNode.nodeType === "Applicant") {
      const coNode = createAppandNode({ nodeType: "ConditionOperator" });
      appendApprovalNode(source.data?.approvalNode, coNode)
      sourceNode = coNode
    }
    const aNode = createAppandNode({ nodeType: nodeType });
    const cNode = aNode as ApprovalCondition
    cNode.condition = initConditionArr(nodeType, target.data?.approvalNode)
    appendApprovalNode(sourceNode, aNode)
  } else {
    const aNode = createAppandNode({ nodeType: nodeType });
    appendApprovalNode(source.data?.approvalNode, aNode)
  }
  refixNodePositon(approvalNode.value)
}

const initConditionArr = (nodeType: NodeType, nextApprovalNode?: ApprovalNode) => {

  const cNodeChild1 = createAppandNode({
    nodeType: nodeType,
    title: " - 1"
  })
  cNodeChild1.next = nextApprovalNode
  const cNodeChild2 = createAppandNode({
    nodeType: nodeType,
    title: " - デフォルト"
  })
  cNodeChild2.next = nextApprovalNode
  return [cNodeChild1, cNodeChild2]
}

const createEdge = (sourceApprovalNode: ApprovalNode, targetApprovalNode: ApprovalNode, sourceHandleId: string, edgeType: string) => {
  return {
    id: uuidv4(),
    source: sourceApprovalNode.id,
    target: targetApprovalNode.id,
    sourceHandle: sourceHandleId,
    // targetHandleId:sourceHandleId,
    type: edgeType,
    data: {
      events: {
        edgeClick: edgeClick
      },
      sourceApprovalNode,
      targetApprovalNode,
    }
  }
}

const connectNodeEdge = (snode: ApprovalNode, tnode: ApprovalNode, sourceHandleId: string, edgeType?: string) => {
  const edge = createEdge(snode, tnode, sourceHandleId, edgeType || "button")
  edges.value.push(edge)
}

const refreshNodes = (snode: ApprovalNode, tnode: ApprovalNode) => {

  const tNodes: CustomNode[] = []
  if (isApprovalConditionNode(tnode)) {
    const cnode = tnode as ApprovalCondition;
    cnode.condition.forEach((element, idx) => {
      tNodes.push(createFlowNode(element, element.nodeType !== "ConditionOperator" ? "custom" : "special"))
      let direction = ""
      if (idx === 0) {
        direction = "source-l"
      } else if (cnode.condition.length === 2) {
        direction = "source-r"
      } else {
        direction = "source-t"
      }
      connectNodeEdge(snode, element, direction, 'smoothstep')
      if (element.next) {
        refreshNodes(element, element.next)
      }
    });
    pushFlowNode(tNodes)
  } else {
    const edgeType = snode.nodeType === "Applicant" ? "button" : "smoothstep"
    connectNodeEdge(snode, tnode, Position.Bottom, edgeType)
    tNodes.push(createFlowNode(tnode, tnode.nodeType !== "ConditionOperator" ? "custom" : "special"))
    pushFlowNode(tNodes)
    if (tnode.next) {
      refreshNodes(tnode, tnode.next)
    }
  }

}
const createFlowNode = (anode: ApprovalNode, type: "custom" | "special") => {
  const { width, height } = useNodeSize(type)
  return {
    id: anode.id,
    type: type,
    data: {
      title: anode.title,
      events: {
        nodeClick: (a: MouseEvent) => {
          console.log(a)
        }
      },
      approvalNode: anode,
      width: width,
      height: height
    },
    position: anode.position,
  }
}

const pushFlowNode = (cnodes: CustomNode[]) => {
  cnodes.forEach(element => {
    if (!nodes.value.find(n => n.id === element.id)) {
      nodes.value.push(element)
    }
  });
}

watch(approvalNode, () => {
  nodes.value.splice(0)
  edges.value.splice(0)
  pushFlowNode([createFlowNode(approvalNode.value, "custom")])

  if (approvalNode.value.next) {
    refreshNodes(approvalNode.value, approvalNode.value.next)
  }

}, { immediate: true, deep: true })

console.log('nodes.value', nodes.value)
console.log('edges.value', edges.value)
</script>

<template>
  <div style="width: calc(100%)+0px;height: 100VH;">
    <VueFlow :nodes="nodes" :fit-view-on-init="true" :max-zoom="0.8" :edges="edges" :pan-on-scroll="true"
      :zoom-on-double-click="false" :zoom-on-scroll="false" :pan-on-drag="false" :zoom-on-pinch="false"
      :prevent-scrolling="false">
      <template #node-custom="customNodeProps">
        <MyNode v-bind="customNodeProps" />
      </template>
      <template #node-special="specialNodeProps">
        <MyConditionNode v-bind="specialNodeProps" />
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
