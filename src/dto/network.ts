export interface DrugstOneNode {
  id: string;
  group: string;
  label: string;
}

export interface DrugstOneEdge {
  from: string;
  to: string;
  group: string;
}

export interface DrugstOneNetwork {
  nodes: DrugstOneNode[];
  edges: DrugstOneEdge[];
}

export interface DrugstOneGraph {
  network: DrugstOneNetwork;
}