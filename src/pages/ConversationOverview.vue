<script lang="ts" setup>
import { useChatStore } from '@/stores/chat'
import ConversationHistory from '@/components/ConversationHistory.vue'
import { useRouter } from 'vue-router'

const chatStore = useChatStore();
const router = useRouter();


function newConversation() {
  const currentId = chatStore.createNewConversation();
  router.push({
    path: '/conversation/' + currentId,
  });
}



</script>

<template>

  <v-app>
    <v-navigation-drawer>
      <v-btn @click="newConversation()" rounded="xl" size="x-large" block>New Chat</v-btn>
      <ConversationHistory />
    </v-navigation-drawer>


    <v-main class="scroll-window">
      <Welcome v-if="!chatStore.hasMessages" />
      <Conversation />

      <MessageInput />
    </v-main>
  </v-app>


</template>


<style scoped>
</style>

