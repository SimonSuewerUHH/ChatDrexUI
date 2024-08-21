<script setup lang="ts">

import { useChatStore } from '@/stores/chat'

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
          <v-row v-for="(messageId, indexMsgId) in chatStore.getCurrentConversation.getMessagesHistory()"
                 :key="indexMsgId" class="test"
          >
          <p>test {{messageId}} ID: {{ indexMsgId }}</p>
            <v-col cols="12">
              <div class="d-flex align-center justify-end">
                <MessageBubble :message="chatStore.getCurrentConversation.getRequestMessage(messageId)" />
              </div>
            </v-col>

            <v-col cols="12">
              <div class="d-flex align-center justify-start">
                <MessageBubble :messages="chatStore.getCurrentConversation.getResponseMessages(messageId)" />
              </div>
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

.test{
  background-color: red;
  margin-bottom: 20px;
}
</style>