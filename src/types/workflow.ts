import type { Node, Edge, CustomEvent } from "@vue-flow/core";
import { v4 as uuidv4 } from "uuid";

export interface CustomeNodeData {
  title: string;
  subtitle?: string;
  events?: CustomEvents;
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
}

export interface CustomEdgeEvents {
  edgeClick: (
    sourceApprovalNode: ApprovalNode,
    source: CustomNode,
    target: CustomNode,
    edgeId: string
  ) => void;
  [key: string]: CustomEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomEdge = Edge<CustomEdgeData>;

export type NodeType = "Applicant" | "Approver" | "Condition" | "End";

export interface ApprovalNode {
  id: string;
  nodeType: NodeType;
  title: string;
  previus?: ApprovalNode;
  next?: ApprovalNode;
}

export interface ApprovalCondition extends ApprovalNode {
  condition: ApprovalNode[];
}

export type AppandNode = {
  source?: ApprovalNode;
  nodeType: NodeType;
};

export function createNode(appandNode: AppandNode) {
  return {
    id: uuidv4(),
    nodeType: appandNode.nodeType,
    title:
      appandNode.nodeType === "Applicant"
        ? "申請者"
        : appandNode.nodeType === "Approver"
        ? "承認"
        : appandNode.nodeType === "Condition"
        ? "条件"
        : "終了",
  };
}

export function appendApprovalNode(source: ApprovalNode, anode: ApprovalNode) {
  if (!source.next) {
    source.next = anode;
  } else {
    const tmp = source.next;
    source.next = anode;
    anode.next = tmp;
  }
}
