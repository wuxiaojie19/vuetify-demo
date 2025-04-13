import type { Node, Edge, CustomEvent } from "@vue-flow/core";
import { v4 as uuidv4 } from "uuid";

export interface CustomeNodeData {
  title: string;
  subtitle?: string;
  events?: CustomEvents;
  approvalNode: ApprovalNode;
  width: number;
  height: number;
}

export interface CustomEvents {
  nodeClick: (event: MouseEvent) => void;
  [key: string]: CustomEvent;
}

export type CustomNode = Node<CustomeNodeData>;

export interface CustomEdgeData {
  title?: string;
  events?: CustomEdgeEvents;
  sourceApprovalNode: ApprovalNode;
  targetApprovalNode: ApprovalNode;
}

export interface CustomEdgeEvents {
  edgeClick: (
    source: CustomNode,
    target: CustomNode,
    edgeId: string,
    nodeType: "Approver" | "ConditionGroup"
  ) => void;
  [key: string]: CustomEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomEdge = Edge<CustomEdgeData>;

export type NodeType =
  | "Applicant"
  | "Approver"
  | "ConditionGroupStart"
  | "Condition"
  | "ConditionGroup"
  | "ConditionGroupEnd"
  | "End";

export const nodeWidth = 300;
export const nodeHeight = 150;

export const cnodeWidth = 150;
export const cnodeHeight = 50;

export type CustomNodeType = "custom" | "special" | "specialEnd";

export function useNodeSize(type: CustomNodeType) {
  return type === "custom"
    ? { width: nodeWidth, height: nodeHeight }
    : { width: cnodeWidth, height: cnodeHeight };
}

export interface ApprovalNode {
  id: string;
  nodeType: NodeType;
  title: string;
  position: { x: number; y: number };
  previus?: Set<ApprovalNode>;
  next?: ApprovalNode;
  width: number;
  height: number;
  parent?: ApprovalNode;
}

export interface ConditionGroup extends ApprovalNode {
  condition: ApprovalNode[];
}

export interface ConditionGroupEnd extends ApprovalNode {
  conditionGroupStart: ConditionGroupStart;
}

export interface ConditionGroupStart extends ApprovalNode {
  conditionGroupEnd: ConditionGroupEnd;
}

export type AppandNode = {
  source?: ApprovalNode;
  nodeType: NodeType;
  title?: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  parent?: ApprovalNode;
};

export function createAppandNode(appandNode: AppandNode): ApprovalNode {
  const titleMap = {
    Applicant: "申請者",
    Approver: "承認",
    Condition: "条件",
    ConditionGroupStart: "条件を追加",
    ConditionGroup: "条件グループ",
    ConditionGroupEnd: "条件グループEND",
    End: "End",
  } as { [key in NodeType]: string };
  const node = {
    id: uuidv4(),
    nodeType: appandNode.nodeType,
    title: titleMap[appandNode.nodeType],
    position: appandNode.position || { x: 0, y: 0 },
    width:
      appandNode.width ||
      (appandNode.nodeType === "ConditionGroupStart" ? cnodeWidth : nodeWidth),
    height:
      appandNode.height ||
      (appandNode.nodeType === "ConditionGroupStart"
        ? cnodeHeight
        : nodeHeight),
    previus: new Set<ApprovalNode>(),
  };
  node.title += appandNode.title || "";
  if (appandNode.nodeType === "ConditionGroup") {
    (<ConditionGroup>node).condition = [];
  }
  return node;
}

export function appendApprovalNode(
  source: ApprovalNode,
  anode: ApprovalNode | ConditionGroup,
  cgEndNode?: ApprovalNode,
  endApprovalNode?: ApprovalNode
) {
  if (!source || !anode) {
    return;
  }
  if (!source.next) {
    source.next = anode;
    anode.previus = new Set<ApprovalNode>().add(source);
  } else {
    const tmp = source.next;
    source.next = anode;
    anode.next = tmp;
    tmp.previus?.delete(source);
    if (isConditionGroup(anode)) {
      anode.next = cgEndNode;
      cgEndNode!.next = endApprovalNode!;
      cgEndNode!.next.previus?.add(cgEndNode!);

      const firstC = anode.condition[0];
      const lastC = anode.condition[anode.condition.length - 1];
      firstC.next = cgEndNode;
      lastC.next = cgEndNode;
      lastC.next?.previus?.add(lastC);
      firstC.next?.previus?.add(firstC);
      firstC.previus = source.previus;
    } else {
      anode.next.previus?.add(anode);
      anode.previus = new Set<ApprovalNode>().add(source);
    }
  }
}

export function isConditionGroup(node: ApprovalNode): node is ConditionGroup {
  return node.nodeType === "ConditionGroup";
}

export function findPriviusNode(type: NodeType[], pnode?: ApprovalNode) {
  if (pnode && type.indexOf(pnode.nodeType) > -1) {
    return pnode;
  } else if (pnode === undefined || pnode.previus === undefined) {
    return undefined;
  } else {
    findPriviusNode(type, [...pnode.previus][0]);
  }
}

export function refixNodePositon(rootNode: ApprovalNode): void {
  function getCenterOfPreviusXY(
    pNode: ApprovalNode,
    tNode: ApprovalNode
  ): { x: number; y: number } {
    const x =
      tNode.nodeType === "ConditionGroupStart"
        ? pNode.position.x + pNode.width / 2 - tNode.width / 2
        : pNode.position.x;
    const y =
      (tNode.nodeType === "ConditionGroupStart" ? 100 : 130) +
      pNode.position.y +
      pNode.height;

    return { x, y };
  }

  function getLeftOfPreviusXY(
    pNode: ApprovalNode,
    tNode: ApprovalNode
  ): { x: number; y: number } {
    let bnode = pNode;
    if (["ConditionGroupStart"].includes(pNode.nodeType)) {
      bnode = findPriviusNode(["Applicant", "Approver", "Condition"], pNode)!;
    }

    const x = bnode.position.x - bnode.width;
    const y =
      (tNode.nodeType === "ConditionGroupStart" ? 100 : 200) +
      pNode.position.y +
      pNode.height;
    return { x, y };
  }
  function getCenterForEnd(
    fNode: ApprovalNode,
    pNode: ApprovalNode[]
  ): { x: number; y: number } {
    const x = fNode.position.x;
    // let maxY = 0;
    // pNode.forEach((node) => {
    //   maxY = Math.max(maxY, node.position.y);
    // });

    // const y = maxY + 350;
    let y = 0;
    if (pNode[0]!.nodeType === "ConditionGroupEnd") {
      y = pNode[0]!.position.y + pNode[0]!.height;
    } else {
      y = pNode[0]!.position.y + 300;
    }
    return { x, y };
  }

  function getCenterOfConditionGroupStart(groupEnd: ConditionGroupEnd): {
    x: number;
    y: number;
  } {
    const x = groupEnd.conditionGroupStart.position.x;
    const pnode = [...groupEnd.previus!][0];
    const y = pnode.position.y + pnode.height + 250;
    return { x, y };
  }
  function setNodePositon(anode: ApprovalNode) {
    for (
      let tempNode = anode.next;
      tempNode !== undefined;
      tempNode = tempNode.next
    ) {
      if (tempNode.nodeType === "Applicant") {
        continue;
      }
      if (["Approver", "ConditionGroupStart"].includes(tempNode.nodeType)) {
        tempNode.position = getCenterOfPreviusXY(
          [...tempNode.previus!][0],
          tempNode
        );
      }
      if (["ConditionGroupEnd"].includes(tempNode.nodeType)) {
        tempNode.position = getCenterOfConditionGroupStart(
          tempNode as ConditionGroupEnd
        );
      }
      if (["ConditionGroup"].includes(tempNode.nodeType)) {
        const conditionNode = tempNode as ConditionGroup;
        conditionNode.condition.forEach((cNode, index, nodeArr) => {
          if (index === 0) {
            cNode.position = getLeftOfPreviusXY([...cNode.previus!][0], cNode);
          } else {
            const x =
              nodeArr[index - 1].position.x + nodeArr[index - 1].width * 2;
            const y = nodeArr[index - 1].position.y;
            cNode.position = { x, y };
          }
          if (cNode.next) {
            refixNodePositon(cNode);
          }
        });
      }

      if (["End"].includes(tempNode.nodeType)) {
        tempNode.position = getCenterForEnd(anode, [...tempNode.previus!]);
      }
    }
  }
  setNodePositon(rootNode);
}
