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
  networkType: string;
}

export interface DrugstOneDTO {
  network: DrugstOneNetwork;
  groups: DrugstOneGroupsConfig;
  config: DrugstOneConfig;
}


export interface DrugstOneGroupsConfig {
  nodeGroups: Record<string, DrugstOneGroupsConfigNode>;
  edgeGroups: Record<string, DrugstOneGroupsConfigEdge>;
}

export interface DrugstOneGroupsConfigEdge {
  groupName?: string;
  color?: string;
  dashes?: boolean;
}

export interface DrugstOneGroupsConfigFont {
  color?: string;
  size?: number;
  face?: string;
  strokeWidth?: number;
  strokeColor?: string;
  align?: string;
  bold?: boolean;
  ital?: boolean;
  boldital?: boolean;
  mono?: boolean;
}

export interface DrugstOneGroupsConfigColor {
  background?: string;
  border?: string;
  highlight?: {
    background?: string;
    border?: string;
  };
  hover?: {
    background?: string;
    border?: string;
  };
}

export interface DrugstOneGroupsConfigNode {
  groupName?: string;
  borderWidth?: number;
  color?: DrugstOneGroupsConfigColor;
  shape?: string; // e.g. 'dot' | 'square' | 'triangle'
  type?: string;
  detailShowLabel?: boolean;
  font?: DrugstOneGroupsConfigFont;
  borderWidthSelected?: number;
}


export interface DrugstOneConfig {
  /** Header */
  title: string; // default: "Drugst.One"

  /** Optional backend base URL */
  backendUrl: string; // default: ""

  /** Legend settings */
  legendUrl: string; // default: ""
  legendClass: string; // default: "legend"
  legendPos: 'left' | 'right' | 'off'; // default: 'left'

  /** Labels for main tasks */
  taskTargetName: string; // default: "Target identification"
  taskDrugName: string; // default: "Drug search"
  clusteringName: string; // default: "Clustering"
  pathwayEnrichment: string; // default: "Pathway enrichment"

  /** Sidebar position or hidden */
  showSidebar: 'left' | 'right' | false; // default: 'left'

  /** Legend visibility (only used if legendUrl is empty) */
  showLegendNodes: boolean; // default: true
  showLegendEdges: boolean; // default: true

  /** Panel toggles */
  showOverview: boolean; // default: true
  showQuery: boolean; // default: true
  showItemSelector: boolean; // default: true
  showSimpleAnalysis: boolean; // default: false
  showAdvAnalysis: boolean; // default: true

  /** Which advanced analysis buttons are visible */
  showAdvAnalysisContent: string[]; // e.g. ["drug-search", "drug-target-search", ...]

  showSelection: boolean; // default: true
  showEditNetwork: boolean; // default: false
  showPruning: boolean; // default: false
  showLogger: boolean; // default: false
  showTasks: boolean; // default: true
  showViews: boolean; // default: true

  /** Network menu position or hidden */
  showNetworkMenu: 'left' | 'right' | false; // default: 'right'
  expandNetworkMenu: boolean; // default: true
  showLegend: boolean; // default: true

  /** Network menu buttons */
  showNetworkMenuButtonExpression: boolean;
  showNetworkMenuButtonScreenshot: boolean;
  showNetworkMenuButtonExportGraphml: boolean;
  showNetworkMenuButtonAdjacentDrugs: boolean;
  activateNetworkMenuButtonAdjacentDrugs: boolean;
  showNetworkMenuButtonCenter: boolean;
  showNetworkMenuButtonAnimation: boolean;
  showNetworkMenuButtonLayout: boolean;
  showNetworkMenuButtonSelectionMultiDrag: boolean;
  showNetworkMenuButtonOverlayDirectedEdges: boolean;
  showNetworkMenuButtonUpload: boolean;
  showNetworkMenuButtonLabelIdspace: boolean;
  showNetworkMenuButtonAdjacentDisordersProteins: boolean;
  activateNetworkMenuButtonAdjacentDisorders: boolean;
  showNetworkMenuButtonAdjacentDisordersDrugs: boolean;
  activateNetworkMenuButtonAdjacentDisorderDrugs: boolean;

  /** Sidebar quick-connect */
  showConnectGenes: boolean;

  /** Optional custom labels (empty string = default) */
  networkMenuButtonAdjacentDrugsLabel: string;
  networkMenuButtonAdjacentDisordersProteinsLabel: string;
  networkMenuButtonAdjacentDisordersDrugsLabel: string;
  networkMenuButtonAnimationLabel: string;
  networkMenuButtonLayoutLabel: string;
  networkMenuButtonSelectionMultiDragLabel: string;
  networkMenuButtonOverlayDirectedEdgesLabel: string;
  networkMenuButtonUploadLabel: string;

  /** Identifier settings */
  identifier: 'symbol' | 'uniprot' | 'ensg' | 'ensembl' | 'entrez' | 'ncbigene';
  label: 'symbol' | 'uniprot' | 'ensg' | 'ensembl' | 'entrez' | 'ncbigene';

  /** Edge/node behavior */
  selfReferences: boolean;
  customEdges: DrugstOneCustomEdges;

  /** Databases */
  interactionDrugProtein: string; // e.g., 'NeDRex'
  interactionProteinProtein: string; // e.g., 'NeDRex'
  indicationDrugDisorder: string; // e.g., 'NeDRex'
  associatedProteinDisorder: string; // e.g., 'NeDRex'

  /** Auto/physics/layout */
  autofillEdges: boolean;
  physicsOn: boolean;
  physicsInitial: boolean; // legacy alias for physicsInital handled server-side
  nodeShadow: boolean;
  edgeShadow: boolean;

  /** Data usage constraints */
  licensedDatasets: boolean;
  reviewed: boolean;
  approvedDrugs: boolean;

  /** Derived props & layout */
  calculateProperties: boolean;
  layoutOn: boolean;
  selectionMultiDrag: boolean;
  fullscreen: boolean;
  overlayDirectedEdges: boolean;

  /** Group styles as raw JSON-like map (for "Raw JSON" editor) */
  groups: Record<string, unknown>;

  /** Algorithms available by category */
  algorithms: Record<string, string[]>;
}

export interface DrugstOneCustomEdges {
  /** Whether custom edges are considered by analysis algorithms */
  /** property name mirrors JSON key */
  default: boolean;
  /** Whether custom edges are selectable in the network */
  selectable: boolean;
}
