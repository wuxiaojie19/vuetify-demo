import type { Node, Edge, CustomEvent } from "@vue-flow/core";
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
}

export interface CustomEdgeEvents {
  edgeClick: (source: CustomNode, target: CustomNode, edgeId: string) => void;
  [key: string]: CustomEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomEdge = Edge<CustomEdgeData>;
