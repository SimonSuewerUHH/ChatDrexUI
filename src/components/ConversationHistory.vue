<script setup lang="ts">
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

function handleConversationClick(convId: string) {
  chatStore.setCurrentConversation(convId)
}

</script>

<template>
  <v-list v-for="(conv, indexConvId) in chatStore.getConversations"
          :key="indexConvId">
    <v-list-item class="session-item" :title="conv.firstMessage"
                 @click="handleConversationClick(conv.sessionId)"
    ></v-list-item>
  </v-list>
</template>

<style scoped lang="scss">

.session-item {
  padding: 10px;

  &:hover {
    background-color: #494949;
  }
}
</style>