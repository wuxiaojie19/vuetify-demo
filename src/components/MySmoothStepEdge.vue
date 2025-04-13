<template>
  <path :d="path" :style="style" fill="none" class="vue-flow__edge-path" />

  <EdgeLabelRenderer v-if="showBtn">
    <div :style="{
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

<script lang="ts">
export default {
  inheritAttrs: false,
  name: 'CustomStepEdge',
}
</script>
<script lang="ts" setup>
import { EdgeLabelRenderer } from '@vue-flow/core';
import type { EdgeProps } from '@vue-flow/core';
import type { CustomEdgeData } from '@/types/workflow'
const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data, sourceNode, targetNode } = defineProps<EdgeProps<CustomEdgeData>>()

const plusApprovalClick = (edgeId: string) => {
  data.events?.edgeClick(sourceNode, targetNode, edgeId, "Approver")
}
const plusConditionClick = (edgeId: string) => {
  data.events?.edgeClick(sourceNode, targetNode, edgeId, "ConditionGroup")
}

const path = computed(() =>
  getSmartStepPath({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
    sourcePosition: sourcePosition,
    targetPosition: targetPosition,
    fixedDistance: -100,
    sourceExtension: 100
  })
)
// console.log(path)

const upBtn = ref([0, 0])
const showBtn = ref(false)
function getSmartStepPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = 'bottom',
  targetPosition = 'top',
  fixedDistance = 50,
  sourceExtension = 20
}) {


  // 处理源在下目标在上的特殊情况
  if (sourcePosition === 'bottom' && targetPosition === 'top') {
    upBtn.value[0] = sourceX
    upBtn.value[1] = sourceY + 50
    if (data.sourceApprovalNode.nodeType !== "ConditionGroupEnd") {
      showBtn.value = true
    }
    return `M ${sourceX},${sourceY}
            L ${sourceX},${targetY + fixedDistance}
            L ${targetX},${targetY + fixedDistance}
            L ${targetX},${targetY}`
  }
  showBtn.value = false
  // 原有通用路径算法
  const [sx, sy] = (() => {
    switch (sourcePosition) {
      case 'top': return [0, -sourceExtension]
      case 'bottom': return [0, sourceExtension]
      case 'left': return [-sourceExtension, 0]
      case 'right': return [sourceExtension, 0]
      default: return [0, 0]
    }
  })()

  const startX = sourceX + sx
  const startY = sourceY + sy

  // 判断是否需要对齐坐标轴
  const shouldAlignY = ['top', 'bottom'].includes(targetPosition)
  const shouldAlignX = ['left', 'right'].includes(targetPosition)

  let path = `M ${sourceX},${sourceY} L ${startX},${startY}`

  // 水平优先路径
  if (shouldAlignY || ['left', 'right'].includes(sourcePosition)) {
    const midX = shouldAlignY ? targetX : targetX + (startX < targetX ? -fixedDistance : fixedDistance)
    const finalY = shouldAlignY ? targetY : startY

    path += ` L ${midX},${startY}`
    if (shouldAlignY) path += ` L ${midX},${finalY}`
    path += ` L ${targetX},${finalY}`
  }
  // 垂直优先路径
  else {
    const midY = shouldAlignX ? targetY : targetY + (startY < targetY ? -fixedDistance : fixedDistance)
    const finalX = shouldAlignX ? startX : targetX

    path += ` L ${startX},${midY}`
    if (shouldAlignX) path += ` L ${finalX},${midY}`
    path += ` L ${finalX},${targetY}`
  }

  return path
}
</script>
