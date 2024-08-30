<script setup lang="ts">
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

const isConnected = chatStore.isSocketConnected
let dialog = ref(false)

const getClass = () => {
  if(!isConnected) {
    return 'red';
  }
  return 'white';

}
</script>

<template>

  <v-btn icon @click="dialog = true" class="debug-btn">
    <v-icon :color="getClass()">mdi-bug-outline</v-icon>
  </v-btn>


  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>Debug</v-card-title>
      <v-card-text>
        <v-list lines="one">
          <v-list-item>
            <template v-slot:prepend v-if="!isConnected">
              <v-icon color="red">mdi-alert</v-icon>
            </template>
            <v-list-item-title>
              Socket Connection
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ isConnected ? 'The socket is connected' : 'The socket is not connected' }}
            </v-list-item-subtitle>

          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<style scoped>

.debug-btn {
  z-index: 9999;
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>