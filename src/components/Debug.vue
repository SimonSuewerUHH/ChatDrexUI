<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const chatStore = useChatStore()
const authStore = useAuthStore()

const isConnected = computed(() => chatStore.isConnected)
const user = computed(() => authStore.user)

const printUserProperties = () => {
  if (user.value) {
    return Object.entries(user.value)
  }
  return 'User is not logged in'
}

let dialog = ref(false)

const getClass = ref('white')

watch(isConnected, (newVal) => {
  getClass.value = newVal ? 'white' : 'red'
})

</script>

<template>

  <v-btn icon @click="dialog = true" class="debug-btn">
    <v-icon :color="getClass">mdi-bug-outline</v-icon>
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

          <v-list-item
            title="Current Session"
            :subtitle="chatStore.currentConversation"
          >
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend v-if="!authStore.isLoggedIn">
              <v-icon color="red">mdi-alert</v-icon>
            </template>
            <v-list-item-title>
              Logged in
            </v-list-item-title>
            <v-list-item-subtitle v-if="authStore.isLoggedIn" class="login-subtitle">
              <p v-for="el in printUserProperties()">
                <span>{{ el[0]}}:</span> {{ el[1] }}
              </p>
             </v-list-item-subtitle>
            <v-list-item-subtitle v-else>
              User is not logged in
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

.login-subtitle {
  -webkit-line-clamp: initial !important ;
}
.debug-btn {
  z-index: 9999;
  position: fixed;
  top: 10px;
  right: 70px;
}
</style>