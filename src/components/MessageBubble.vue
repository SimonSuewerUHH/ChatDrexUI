<script setup lang="ts">

import { ChatMessageType, MessageDTO } from '@/dto/message'

const props = defineProps<{
  message?: MessageDTO
}>()

const { message } = toRefs(props)

if (!message) {
  console.error('Message is required')
}

const messageClass = computed(() => {
  if (!message.value) {
    return ''
  }
  return message.value.messageType === ChatMessageType.HUMAN ? 'message-human' : 'message-system'
})

</script>


<template>

  <v-card v-if="message" :class="messageClass" class="pa-3">
      <div v-if="message.messageType !== ChatMessageType.SYSTEM">
        <v-card-text>{{ message.message }}</v-card-text>
      </div>
      <div v-else>
        <SystemMessage :message="message" />
      </div>
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
  