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
  identifier: string = 'uniprot';
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
      }
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
    debugger;
    this.identifier = this.getIdentifier(this.networkType);
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
