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
        borderWidth: 1,
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
        groupName: 'Seed Nodes',
        color: {
          border: '#f12525',
          background: '#f12525',
          highlight: {
            border: '#f12525',
            background: '#f12525'
          }
        },
        shape: 'triangle',
        type: 'default seed node type'
      }, 
      diamondnode: {
        groupName: 'Diamond Nodes',
        color: {
          border: '#f1bb25',
          background: '#f1bb25',
          highlight: {
            border: '#f1bb25',
            background: '#f1bb25'
          }
        },
        shape: 'diamond',
        type: 'default diamond node type'
      }, 
      founddrug: {
        groupName: 'Drug Nodes',
        color: {
          border: '#f125b0',
          background: '#f125b0',
          highlight: {
            border: '#f125b0',
            background: '#f125b0'
          }
        },
        shape: 'triangle',
        type: 'default drug node type'
      }, 
      gene: {
        groupName: 'Gene Nodes',
        color: {
          border: '#1a9c48',
          background: '#1a9c48',
          highlight: {
            border: '#1a9c48',
            background: '#1a9c48'
          }
        },
        shape: 'circle',
        type: 'default gene node type'
      }, 
      disorder: {
        groupName: 'Disorder Nodes',
        color: {
          border: '#1a459c',
          background: '#1a459c',
          highlight: {
            border: '#1a459c',
            background: '#1a459c'
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
    title: 'Drugst.One',
    showSidebar: 'left',
    showLegendNodes: false,
    showLegendEdges: false,
    showOverview: true,
    showQuery: true,
    identifier: this.identifier,
    nodeShadow: true,
    edgeShadow: true
  };

  ngOnInit() {
    debugger;
    this.networkType = this.network().network.networkType || 'default';
    this.identifier = this.getIdentifier(this.networkType);
    this.config.identifier = this.identifier;
    debugger;
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
