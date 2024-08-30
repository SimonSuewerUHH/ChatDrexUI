<script setup lang="ts">
//import { onMounted } from 'vue';
import { DrugstOneGraph } from '@/dto/network'

const props = defineProps<{
  network?: DrugstOneGraph
}>()
const { network } = toRefs(props)
const groups = {
  "nodeGroups": {
      "default": {
          "groupName": "Default Node Group",
          "color": {
              "border": "#FFFF00",
              "background": "#FFFF00",
              "highlight": {
                  "border": "#FF0000",
                  "background": "#FF0000"
              }
          },
          "shape": "triangle",
          "type": "default type",
          "detailShowLabel": false,
          "font": {
              "color": "#000000",
              "size": 14,
              "face": "arial",
              "strokeWidth": 0,
              "strokeColor": "#ffffff",
              "align": "center",
              "bold": false,
              "ital": false,
              "boldital": false,
              "mono": false
          },
          "borderWidth": 1,
          "borderWidthSelected": 2
      },
      "foundnode": {
          "groupName": "Found Nodes",
          "color": {
              "border": "#F12590",
              "background": "#F12590",
              "highlight": {
                  "border": "#F12590",
                  "background": "#F12590"
              }
          },
          "shape": "circle",
          "type": "default node type"
      },
      'important': {
          'type': 'gene',
          'color': '#ff881f',
          'font': { 'color': '#000000' },
          'groupName': 'Important Gene',
          'shape': 'star'
          },
      'gene': {
          'type': 'gene',
          'color': '#4da300',
          'font': { 'color': '#f0f0f0' },
          'groupName': 'Gene',
          'shape': 'circle'
      },
      "founddrug": {
          "groupName": "Drugs",
          "color": {
              "border": "#F12590",
              "background": "#F12590",
              "highlight": {
                  "border": "#F12590",
                  "background": "#F12590"
              }
          },
          "shape": "diamond",
          "type": "default drug type"
      },
      "seednode": {
          "groupName": "Seed Nodes",
          "shape": "triangle",
          "type": "seed node",
          "color": {
              "border": "#F1111D",
              "background": "#F1111D",
              "highlight": {
                  "border": "#F1111D",
                  "background": "#F1111D"
              }
          },
          "font": {
              "color": "#F1111D",
              "size": 14
          }
      }
  },
  "edgeGroups": {
      "default": {
          "groupName": "Default Edge Group",
          "color": "black",
          "dashes": false
      }
  }
}
const config = {
        "title": "Drugst.One",
        "backendUrl": "",
        "legendUrl": "",
        "legendClass": "legend",
        "legendPos": "left",
        "taskTargetName": "Drug target search",
        "taskDrugName": "Drug search",
        "showSidebar": "left",
        "showLegendNodes": false,
        "showLegendEdges": false,
        "showOverview": true,
        "showQuery": true,
        "showItemSelector": true,
        "showSimpleAnalysis": false,
        "showAdvAnalysis": false,
        "showAdvAnalysisContent": [
            "drug-search", 
            "drug-target-search", 
            "enrichment-gprofiler", 
            "enrichment-digest", 
            "search-ndex"
        ],
        "showSelection": false,
        "showTasks": false,
        "showViews": false,
        "showNetworkMenu": "right",
        "showLegend": true,
        "expandNetworkMenu": true,
        "showNetworkMenuButtonExpression": false,
        "showNetworkMenuButtonScreenshot": true,
        "showNetworkMenuButtonExportGraphml": true,
        "showNetworkMenuButtonAdjacentDrugs": false,
        "activateNetworkMenuButtonAdjacentDrugs": false,
        "showNetworkMenuButtonCenter": false,
        "showNetworkMenuButtonAnimation": true,
        "activateNetworkMenuButtonAdjacentDisorders": false,
        "showNetworkMenuButtonAdjacentDisordersProteins": false,
        "activateNetworkMenuButtonAdjacentDisorderDrugs": false,
        "showNetworkMenuButtonAdjacentDisordersDrugs": false,
        "showConnectGenes": false,
        "networkMenuButtonAdjacentDrugsLabel": "Drugs",
        "networkMenuButtonAdjacentDisordersProteinsLabel": "Disorders (protein)",
        "networkMenuButtonAdjacentDisordersDrugsLabel": "Disorders (drug)",
        "networkMenuButtonAnimationLabel": "Animation",
        "identifier": "entrez",
        "selfReferences": false,
        "customEdges": {
            "default": true,
            "selectable": true
        },
        "interactionDrugProtein": "NeDRex",
        "interactionProteinProtein": "NeDRex",
        "indicationDrugDisorder": "NeDRex",
        "associatedProteinDisorder": "NeDRex",
        "autofillEdges": false,
        "physicsOn": false,
        "physicsInitial": false,
        "nodeShadow": true,
        "edgeShadow": true,
        "licensedDatasets": false,
        "algorithms": {
            "drug": ["trustrank", "closeness", "degree", "proximity"],
            "drug-target": ["trustrank", "multisteiner", "keypathwayminer", "degree", "closeness", "betweenness"]
        }
    }

onMounted(() => {
  if (!document.querySelector('script[src="https://cdn.drugst.one/latest/drugstone.js"]')) {
    const script = document.createElement('script')
    script.src = 'https://cdn.drugst.one/latest/drugstone.js'
    script.async = true
    document.head.appendChild(script)
  }
  if (!document.querySelector('link[href="https://cdn.drugst.one/latest/styles.css"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.drugst.one/latest/styles.css'
    document.head.appendChild(link)
  }
})


</script>


<template>
  <v-container v-if="network">
    <drugst-one
      :groups=groups
      :config=config
      :network=network.network>
    </drugst-one>
  </v-container>
</template>

<style scoped>

</style>