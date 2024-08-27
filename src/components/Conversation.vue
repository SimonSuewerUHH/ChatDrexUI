<script setup lang="ts">

import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()


</script>

<template>
  <ChatHeader v-if="chatStore.hasMessages" />
  <v-container class="main" v-if="chatStore.hasMessages">
    <v-row v-for="(messageId, indexMsgId) in chatStore.getCurrentConversation.getMessagesHistory()"
           :key="indexMsgId" class="test"
    >
      <v-col cols="12">
        <div class="d-flex align-center justify-end">
          <MessageBubble :message="chatStore.getCurrentConversation.getRequestMessage(messageId)"
                         :loaded="true" />
        </div>
      </v-col>

      <v-col cols="12">
        <div class="d-flex align-center justify-start">
          <MessageBubble :messages="chatStore.getCurrentConversation.getResponseMessages(messageId)"
                         :loaded="chatStore.getCurrentConversation.getLoaded(messageId)"
                         :errors="chatStore.getCurrentConversation.getErrors(messageId)"
                         :tools="chatStore.getCurrentConversation.getTools(messageId)"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>

.main {
  overflow-y: auto;
  height: calc(100vh - 64px - 110px);
  box-sizing: border-box;
  margin-top: 10px;
  padding: 0 !important;
}


</style>