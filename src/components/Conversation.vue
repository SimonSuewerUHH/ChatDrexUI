<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { watch } from 'vue';

const route = useRoute()
const router = useRouter()

const chatId = (route.params as any).id;
const chatStore = useChatStore()
if (chatId) {
  const setStoreSuccess = chatStore.setCurrentConversation(chatId);
  if (!setStoreSuccess) {
    router.push({
      path: '/conversation'
    })
  }
}

watch(() => chatStore.hasMessages, (newVal) => {
  if (newVal) {
    router.push({
      path: '/conversation/' + chatStore.currentConversation
    });
  }
});
</script>

<template>
  <ChatHeader v-if="chatStore.hasMessages" />
  <p> Conversation {{ chatId }}</p>
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
  overflow-x: hidden;
}


</style>