import type { Node, Edge, CustomEvent } from "@vue-flow/core";
import { v4 as uuidv4 } from "uuid";
import { fi } from "vuetify/locale";

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
    nodeType: "Approver" | "Condition"
  ) => void;
  [key: string]: CustomEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomEdge = Edge<CustomEdgeData>;

export type NodeType =
  | "Applicant"
  | "Approver"
  | "ConditionOperator"
  | "Condition"
  | "End";

export const nodeWidth = 300;
export const nodeHeight = 150;

export const cnodeWidth = 150;
export const cnodeHeight = 50;

export function useNodeSize(type: "custom" | "special") {
  return type === "custom"
    ? { width: nodeWidth, height: nodeHeight }
    : { width: cnodeWidth, height: cnodeHeight };
}

export interface ApprovalNode {
  id: string;
  nodeType: NodeType;
  title: string;
  position: { x: number; y: number };
  previus?: ApprovalNode;
  next?: ApprovalNode;
  width: number;
  height: number;
}

export interface ApprovalCondition extends ApprovalNode {
  condition: ApprovalNode[];
}

export type AppandNode = {
  source?: ApprovalNode;
  nodeType: NodeType;
  title?: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
};

export function createAppandNode(appandNode: AppandNode): ApprovalNode {
  const node = {
    id: uuidv4(),
    nodeType: appandNode.nodeType,
    title:
      appandNode.nodeType === "Applicant"
        ? "申請者"
        : appandNode.nodeType === "Approver"
        ? "承認"
        : appandNode.nodeType === "Condition"
        ? "条件"
        : appandNode.nodeType === "ConditionOperator"
        ? ""
        : "終了",
    position: appandNode.position || { x: 0, y: 0 },
    width:
      appandNode.width ||
      (appandNode.nodeType === "ConditionOperator" ? cnodeWidth : nodeWidth),
    height:
      appandNode.height ||
      (appandNode.nodeType === "ConditionOperator" ? cnodeHeight : nodeHeight),
  };
  node.title += appandNode.title || "";
  if (appandNode.nodeType === "Condition") {
    (<ApprovalCondition>node).condition = [];
  }
  return node;
}

export function appendApprovalNode(
  source?: ApprovalNode,
  anode?: ApprovalNode
) {
  if (!source || !anode) {
    return;
  }
  if (!source.next) {
    source.next = anode;
    anode.previus = source;
  } else {
    const tmp = source.next;
    source.next = anode;
    anode.next = tmp;
    anode.previus = source;
    anode.next.previus = anode;
  }
}

export function isApprovalConditionNode(
  node: ApprovalNode
): node is ApprovalCondition {
  return node.nodeType === "Condition";
}

export function refixNodePositon(anode: ApprovalNode): void {
  const findPriviusNode = (type: NodeType[], pnode?: ApprovalNode) => {
    if (pnode && type.indexOf(pnode.nodeType) > -1) {
      return pnode;
    } else if (pnode === undefined) {
      return undefined;
    } else {
      return findPriviusNode(type, pnode.previus);
    }
  };

  const setNodePosition = (tnode: ApprovalNode) => {
    if (tnode.next) {
      if (tnode.next.nodeType == "End") {
        tnode.next.position.x = 0;
      } else {
        let x = 0;
        if (tnode.nodeType !== "Condition") {
          x =
            tnode.next.nodeType === "ConditionOperator"
              ? tnode.position.x + tnode.width / 2 - tnode.next.width / 2
              : tnode.position.x;
        } else {
          const pnode = findPriviusNode(["ConditionOperator"], tnode.previus);
          x = pnode ? pnode.position.x : 0;
        }
        tnode.next.position.x = x;
      }

      tnode.next.position.y = tnode.position.y + tnode.height + 120;

      if (isApprovalConditionNode(tnode.next)) {
        // const xs = 300;
        tnode.next.condition.forEach((element, idx, arr) => {
          let txs = 0;
          if (idx === 0) {
            const pnode = findPriviusNode(["Applicant", "Approver"], tnode);
            txs = pnode ? pnode.position.x - pnode.width : cnodeWidth;
          } else {
            txs = arr[idx - 1].position.x + arr[idx - 1].width * 2;
          }
          const y = (tnode.next?.position.y || 0) - 100
          element.position = {
            x: txs,
            y: y,
          };
        });
      }
      setNodePosition(tnode.next);
    }
  };
  setNodePosition(anode);
}
