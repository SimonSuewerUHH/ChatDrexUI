<script setup lang="ts">

import { ChatMessageType, MessageDTO } from '@/dto/message'

const props = defineProps<{
  message?: MessageDTO
}>()

const { message } = toRefs(props);

if (!message) {
  console.error("Message is required");
}

const messageClass = computed(() => {
  return message.value.messageType === ChatMessageType.HUMAN ? 'message-human' : 'message-system'
})

</script>


<template>
      <v-card :class="messageClass" class="pa-3">
        <v-card-text>{{ message.message }}</v-card-text>
      </v-card>
</template>


<style scoped lang="scss">
@use '@/styles/settings';

.message-human {
  background-color: settings.$chat-bg-human;
}

.message-system {
  background-color: settings.$chat-bg-system;
}

</style>
  