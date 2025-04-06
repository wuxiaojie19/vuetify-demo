import type { Node, Edge, CustomEvent } from "@vue-flow/core";
import { v4 as uuidv4 } from "uuid";

export interface CustomeNodeData {
  title: string;
  subtitle?: string;
  events?: CustomEvents;
  approvalNode: ApprovalNode;
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

export interface ApprovalNode {
  id: string;
  nodeType: NodeType;
  title: string;
  position: { x: number; y: number };
  previus?: ApprovalNode;
  next?: ApprovalNode;
}

export interface ApprovalCondition extends ApprovalNode {
  condition: ApprovalNode[];
}

export type AppandNode = {
  source?: ApprovalNode;
  nodeType: NodeType;
  title?: string;
  position?: { x: number; y: number };
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
  return (<ApprovalCondition>node).condition !== undefined;
}

export function refixNodePositon(anode: ApprovalNode): void {
  const setNodePosition = (tnode: ApprovalNode) => {
    if (tnode.next) {
      tnode.next.position = {
        x: tnode.position.x,
        y: tnode.position.y + 250,
      };
      if (isApprovalConditionNode(tnode.next)) {
        const xs = 300;
        tnode.next.condition.forEach((element, idx) => {
          const txs = idx == 0 ? tnode.position.x - xs : idx * xs;
          element.position = {
            x: txs,
            y: tnode.next?.position.y || 0,
          };
        });
      }
      setNodePosition(tnode.next);
    }
  };
  setNodePosition(anode);
}
