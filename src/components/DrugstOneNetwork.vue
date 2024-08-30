<script setup lang="ts">
//import { onMounted } from 'vue';
import { DrugstOneGraph } from '@/dto/network'

const props = defineProps<{
  network?: DrugstOneGraph
}>()
const { network } = toRefs(props)
const groups = {
  'nodeGroups': {
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
    'foundDrug': {
      'type': 'drug',
      'color': '#F12590',
      'font': { 'color': '#000000' },
      'groupName': 'Drug',
      'shape': 'diamond'
    }
  }, 'edgeGroups': { 'default': { 'color': '#000000', 'groupName': 'default edge' } }
}
const config = {
  'identifier': 'symbol',
  'title': 'Breast cancer example network',
  'nodeShadow': true,
  'edgeShadow': false,
  'autofillEdges': false
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