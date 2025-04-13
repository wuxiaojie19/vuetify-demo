<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from "uuid";
import { VueFlow, useVueFlow, useEdge, Position } from '@vue-flow/core';
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import MyNode from '@/components/MyNode.vue'
import MyConditionNode from '@/components/MyConditionNode.vue'
import MyConditionNodeEnd from '@/components/MyConditionNodeEnd.vue'
import MyEdge from '@/components/MyEdge.vue'
import MySmoothStepEdge from '@/components/MySmoothStepEdge.vue'
import type { CustomNode, CustomEdge, ApprovalNode, NodeType, ConditionGroup, ConditionGroupEnd, ConditionGroupStart, CustomNodeType } from '@/types/workflow'
import { createAppandNode, appendApprovalNode, isConditionGroup, refixNodePositon, useNodeSize } from '@/types/workflow'

const { removeEdges, removeNodes } = useVueFlow()

const x = 0;
const y = 0;

const approvalNode = ref<ApprovalNode>(createAppandNode({
  nodeType: "Applicant",
  position: {
    x, y
  }
}))

const endApprovalNode = createAppandNode({
  nodeType: "End"
})
appendApprovalNode(approvalNode.value, endApprovalNode)
refixNodePositon(approvalNode.value)
const nodes = ref<CustomNode[]>([])
const edges = ref<CustomEdge[]>([])


const edgeClick = (source: CustomNode, target: CustomNode, edgeId: string, nodeType: NodeType) => {

  let sourceNode = source.data!.approvalNode;
  if (nodeType === "ConditionGroup") {
    const cgStartNode = createAppandNode({ nodeType: "ConditionGroupStart" }) as ConditionGroupStart;
    if (["Approver", "Applicant"].includes(sourceNode?.nodeType as string)) {
      appendApprovalNode(sourceNode, cgStartNode)
      sourceNode = cgStartNode
    } else if (sourceNode.nodeType === "Condition") {
      appendApprovalNode(sourceNode!, cgStartNode)
      sourceNode = cgStartNode
    }
    sourceNode!.next = target.data?.approvalNode

    const cgNode = createAppandNode({ nodeType: nodeType }) as ConditionGroup;
    cgNode.condition = initConditionArr(cgNode, "Condition")


    const cgEndNode = createAppandNode({ nodeType: "ConditionGroupEnd" }) as ConditionGroupEnd;
    cgEndNode.conditionGroupStart = cgStartNode
    cgStartNode.conditionGroupEnd = cgEndNode

    appendApprovalNode(sourceNode!, cgNode, cgEndNode, endApprovalNode)
  } else {
    const aNode = createAppandNode({ nodeType: nodeType });
    appendApprovalNode(sourceNode, aNode)
  }
  refixNodePositon(approvalNode.value)
  console.log(approvalNode.value)
}

const initConditionArr = (cNode: ConditionGroup, nodeType: NodeType) => {

  const cNodeChild1 = createAppandNode({
    nodeType: nodeType,
    title: " - 1",
    parent: cNode
  })
  const cNodeChild2 = createAppandNode({
    nodeType: nodeType,
    title: " - デフォルト",
    parent: cNode
  })
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
    },
    pathOptions: {
      offset: 20,
      borderRadius: 0
    }
  }
}

const connectNodeEdge = (snode: ApprovalNode, tnode: ApprovalNode, sourceHandleId: string, edgeType?: string) => {
  const edge = createEdge(snode, tnode, sourceHandleId, edgeType || "mysmooth")
  edges.value.push(edge)
}

const refreshNodes = (snode: ApprovalNode, tnode: ApprovalNode) => {

  const tNodes: CustomNode[] = []
  if (isConditionGroup(tnode)) {
    const cnode = tnode as ConditionGroup;
    cnode.condition.forEach((element, idx) => {
      tNodes.push(createFlowNode(element))
      let direction = ""
      if (idx === 0) {
        direction = "source-l"
      } else if (cnode.condition.length === 2) {
        direction = "source-r"
      } else {
        direction = "source-t"
      }
      connectNodeEdge(snode, element, direction, 'mysmooth')
      if (element.next) {
        refreshNodes(element, element.next)
      }
    });
    pushFlowNode(tNodes)
  } else {
    // const edgeType = snode.nodeType === "Applicant" || tnode.nodeType === "ConditionGroupStart" ? "button" : "mysmooth" //smoothstep / mysmooth
    connectNodeEdge(snode, tnode, Position.Bottom, "mysmooth")
    tNodes.push(createFlowNode(tnode))
    pushFlowNode(tNodes)
    if (tnode.next) {
      refreshNodes(tnode, tnode.next)
    }
  }

}
const createFlowNode = (anode: ApprovalNode) => {
  const nodeMap = {
    ConditionGroupStart: "special",
    ConditionGroupEnd: "specialEnd",
  } as { [key in NodeType]: string }

  const type = nodeMap[anode.nodeType] || "custom"

  const { width, height } = useNodeSize(type as CustomNodeType)
  return {
    id: anode.id,
    type: type,
    data: {
      title: anode.title,
      events: {
        nodeClick: (a: MouseEvent) => {
          // console.log(a)
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
  pushFlowNode([createFlowNode(approvalNode.value)])

  if (approvalNode.value.next) {
    refreshNodes(approvalNode.value, approvalNode.value.next)
  }

}, { immediate: true, deep: true })

</script>

<template>
  <div style="width: calc(100%)+0px;height: 100VH;">
    <VueFlow :nodes="nodes" :fit-view-on-init="true" :max-zoom="0.8" :edges="edges" :pan-on-scroll="true"
      :zoom-on-double-click="false" :zoom-on-scroll="false" :pan-on-drag="true" :zoom-on-pinch="true"
      :prevent-scrolling="false">
      <template #node-custom="customNodeProps">
        <MyNode v-bind="customNodeProps" />
      </template>
      <template #node-special="specialNodeProps">
        <MyConditionNode v-bind="specialNodeProps" />
      </template>
      <template #node-specialEnd="specialNodeProps">
        <MyConditionNodeEnd v-bind="specialNodeProps" />
      </template>
      <template #edge-button="buttonEdgeProps">
        <MyEdge v-bind="buttonEdgeProps" />
      </template>
      <template #edge-custom="customEdgeProps">
        <MyEdge v-bind="customEdgeProps" />
      </template>
      <template #edge-mysmooth="customEdgeProps">
        <MySmoothStepEdge v-bind="customEdgeProps" />
      </template>
      <MiniMap position="top-right" />
      <Background />
    </VueFlow>
  </div>
</template>
<style></style>
