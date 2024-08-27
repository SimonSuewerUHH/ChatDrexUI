<script lang="ts" setup>
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
</script>

<template>

  <v-main class="scroll-window">
    <Welcome v-if="!chatStore.hasMessages" />
    <Conversation />
  </v-main>
</template>


<style scoped>
</style>

