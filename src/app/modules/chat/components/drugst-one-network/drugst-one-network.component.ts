import {Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit} from '@angular/core';
import {DrugstOneGraph} from '../../dto/network';

@Component({
  selector: 'app-drugst-one-network',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './drugst-one-network.component.html',
  styleUrl: './drugst-one-network.component.scss'
})
export class DrugstOneNetworkComponent implements OnInit {
  readonly network = input.required<DrugstOneGraph>();

  networkType: string = 'default';
  identifier: string = 'entrez';
  formattedNetwork: any = {nodes: [], edges: []};

  groups = {
    nodeGroups: {
      default: {
        groupName: 'Default Node Group',
        borderWidth: 3,
        color: {
          border: '#FFFF00',
          background: '#FFFF00',
          highlight: {
            border: '#FF0000',
            background: '#FF0000'
          }
        },
        shape: 'triangle',
        type: 'default type',
        detailShowLabel: false,
        font: {
          color: '#000000',
          size: 14,
          face: 'arial',
          strokeWidth: 0,
          strokeColor: '#ffffff',
          align: 'center',
          bold: false,
          ital: false,
          boldital: false,
          mono: false
        },
        borderWidthSelected: 2
      },
      foundnode: {
        groupName: 'Found Nodes',
        color: {
          border: '#F12590',
          background: '#F12590',
          highlight: {
            border: '#F12590',
            background: '#F12590'
          }
        },
        shape: 'circle',
        type: 'default node type'
      }, 
      seednode: {
        groupName: 'Seeds',
        borderWidth: 3,
        color: {
          border: '#978117',
          background: '#E4C326',
          highlight: {
            border: '#978117',
            background: '#E4C326'
          }
        },
        shape: 'star',
        type: 'default seed node type'
      }, 
      diamondnode: {
        groupName: 'Diamond Nodes',
        borderWidth: 3,
        color: {
          border: '#13367A',
          background: '#3F78C1',
          highlight: {
            border: '#13367A',
            background: '#3F78C1'
          }
        },
        shape: 'diamond',
        type: 'default diamond node type'
      }, 
      founddrug: {
        groupName: 'Drugs',
        borderWidth: 3,
        color: {
          border: '#9c195d',
          background: '#F12590',
          highlight: {
            border: '#9c195d',
            background: '#F12590'
          }
        },
        shape: 'diamond',
        type: 'default drug node type'
      },
      gene: {
        groupName: 'Genes',
        borderWidth: 3,
        color: {
          border: '#356920',
          background: '#7EC16A',
          highlight: {
            border: '#356920',
            background: '#7EC16A'
          }
        },
        shape: 'circle',
        type: 'default gene node type'
      }, 
      disorder: {
        groupName: 'Disorders',
        borderWidth: 3,
        color: {
          border: '#d18b19',
          background: '#f1a223',
          highlight: {
            border: '#d18b19',
            background: '#f1a223'
          }         
        },
        shape: 'triangle',
        type: 'default gene node type'
      }, 
    },
    edgeGroups: {
      default: {
        groupName: 'Default Edge Group',
        color: 'black',
        dashes: false
      }
    }
  };

  config = {
    title: "Drugst.One",
    backendUrl: "",
    legendUrl:  "assets/drugstone_legend.png",
    legendClass: "legend",
    legendPos: "left",
    taskTargetName: "Drug target search",
    taskDrugName: "Drug search",
    showSidebar: "left",
    showLegendNodes: true,
    showLegendEdges: true,
    showOverview: true,
    showQuery: true,
    showItemSelector: true,
    showSimpleAnalysis: true,
    showAdvAnalysis: true,
    showAdvAnalysisContent: ["drug-search", "drug-target-search", "enrichment-gprofiler", "enrichment-digest", "search-ndex"],
    showSelection: true,
    showTasks: true,
    showViews: true,
    showNetworkMenu: "right",
    showLegend: true,
    expandNetworkMenu: true,
    showNetworkMenuButtonExpression: true,
    showNetworkMenuButtonScreenshot: true,
    showNetworkMenuButtonExportGraphml: true,
    showNetworkMenuButtonAdjacentDrugs: true,
    activateNetworkMenuButtonAdjacentDrugs: false,
    showNetworkMenuButtonCenter: true,
    showNetworkMenuButtonAnimation: true,
    activateNetworkMenuButtonAdjacentDisorders: false,
    showNetworkMenuButtonAdjacentDisordersProteins: true,
    activateNetworkMenuButtonAdjacentDisorderDrugs: false,
    showNetworkMenuButtonAdjacentDisordersDrugs: true,
    showConnectGenes: true,
    networkMenuButtonAdjacentDrugsLabel: "Drugs",
    networkMenuButtonAdjacentDisordersProteinsLabel: "Disorders (protein)",
    networkMenuButtonAdjacentDisordersDrugsLabel: "Disorders (drug)",
    networkMenuButtonAnimationLabel: "Animation",
    identifier: this.identifier,
    selfReferences: false,
    customEdges: {default: true, selectable: true},
    interactionDrugProtein: "NeDRex",
    interactionProteinProtein: "NeDRex",
    indicationDrugDisorder: "NeDRex",
    associatedProteinDisorder: "NeDRex",
    autofillEdges: true,
    physicsOn: false,
    physicsInitial: true,
    nodeShadow: true,
    edgeShadow: true,
    licensedDatasets: false,
    algorithms: {
      drug: ["trustrank", "closeness", "degree", "proximity"],
      "drug-target": ["trustrank", "multisteiner", "keypathwayminer", "degree", "closeness", "betweenness"]
    }
  };

  ngOnInit() {
    this.networkType = this.network().network.networkType || 'default';
    this.identifier = this.getIdentifier(this.networkType);
    this.config.identifier = this.identifier;

    this.formattedNetwork = {
      nodes: this.network().network.nodes || [],
      edges: this.network().network.edges || []
    };
  }
  

  private getIdentifier(networkType: string): string {
    switch (networkType) {
      case 'diamond_tool':
        return 'entrez';
      case 'trustrank_tool':
        return 'uniprot';
      case 'cypher_qa_tool':
        return 'symbol';
      default:
        return 'uniprot';
    }
  }
}
