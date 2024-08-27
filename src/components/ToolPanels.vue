<script setup lang="ts">

import { ToolDTO } from '@/dto/message'

const props = defineProps<{
  tools?: ToolDTO[]
}>()

const { tools } = toRefs(props)

</script>

<template>
  <div class="tool-panel" v-if="tools && tools.length > 0">
    <h2>Tools</h2>
    <v-expansion-panels v-for="(tool, index) in tools" :key="index">
      <v-expansion-panel>
        <v-expansion-panel-title disable-icon-rotate>
          <template v-if="tool.started">
            <v-progress-circular
              indeterminate
            ></v-progress-circular>
          </template>
          <template v-else>
            <v-icon icon="mdi-check-bold">
            </v-icon>
          </template>

          <span class="panel-title-name">
        Call {{ tool.name }}
        </span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <h3>Input</h3>
          <p>{{ tool.input }}</p>
          <h3>Output</h3>
          <p>{{ tool.content }}</p>

        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="scss">

.tool-panel {
  margin: 10px 20px;
}
.panel-title-name {
  margin-left: 10px;
}
</style>