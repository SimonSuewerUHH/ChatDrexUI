<script setup lang="ts">

import { useChatStore } from '@/stores/chat'
import { ChatMessageType } from '@/dto/message'

const chatStore = useChatStore()


</script>

<template>
  <div>
    <div
      v-if="chatStore.loading"
      class="text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div>
      <div
        v-if="chatStore.hasMessages"
        ref="chatWindow"
      >
        <v-container>
          <v-row>
            <v-col
              v-for="(message, index) in chatStore.getCurrentChatMessages" :key="index"
              cols="6"
            >
              <div
                class="d-flex align-center"
                :class="message.messageType == ChatMessageType.HUMAN ? 'justify-end' : 'justify-start'"
              >
                <MessageBubble :message="message" />
              </div>
            </v-col>
            <v-col cols="6">
              <Network />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>


  <v-footer
    app
    class="footer"
  >
    <div class="d-flex align-center">
      <MessageInput ref="editor" />
    </div>

  </v-footer>

</template>


<style scoped>

</style>