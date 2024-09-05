<script lang="ts" setup>
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

const newId = chatStore.connect();
console.log('create new chat with id', newId);

</script>

<template>

  <v-main class="scroll-window">
    <Welcome v-if="!chatStore.hasMessages" />
    <Conversation />
    <MessageInput  />

  </v-main>
</template>


<style scoped>
</style>

