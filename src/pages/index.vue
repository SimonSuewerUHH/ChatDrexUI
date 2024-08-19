<script lang="ts" setup>
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
</script>

<template>

  <v-main>
    <Welcome v-if="!chatStore.hasMessages"/>
    <Conversation />
  </v-main>
</template>


