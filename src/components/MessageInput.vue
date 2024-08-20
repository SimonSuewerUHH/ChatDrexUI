<script setup lang="ts">
import { isMobile } from 'is-mobile'
import { useChatStore } from '@/stores/chat'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const textArea = ref()
const message = ref('')
const chatStore = useChatStore();


const usePrompt = (prompt: string) => {
  message.value = prompt
  textArea.value.focus()
}

const clickSendBtn = () => {
  send()
}

const enterOnly = (event: any) => {
  event.preventDefault()
  if (!isMobile() && !chatStore.loading) {
    send()
  }
}

const send = () => {
  let msg = message.value
  // remove the last "\n"
  if (msg[msg.length - 1] === "\n") {
    msg = msg.slice(0, -1)
  }
  if (msg.length > 0) {
    chatStore.sendMessage(msg)
    message.value = ""
  }

}


defineExpose({
  usePrompt
})

</script>

<template>
  <v-container fluid class="message-input-container pa-2 d-flex align-center justify-space-between">
    <v-textarea
      ref="textArea"
      v-model="message"
      placeholder="Type your message..."
      auto-grow
      no-resize
      flat
      hide-details
      outlined
      class="rounded-input"
      rows="1"
      @keypress.enter.exact="enterOnly"
    ></v-textarea>
    <v-btn
      :disabled="chatStore.loading"
      icon="mdi-send"
      title="Send"
      class="ml-3"
      @click="clickSendBtn"
    ></v-btn>
  </v-container>
</template>

<style scoped>
.message-input-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);

  width: 800px;
  bottom: 0;
  background-color: black;
  z-index: 10;
  border-radius: 50px;
  margin-bottom: 20px;
}

.rounded-input .v-input__control {
  border-radius: 20px;
  border: 1px solid #e0e0e0;
}

.v-textarea {
  padding-left: 10px;
  padding-right: 10px;
}

.v-textarea__content {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
  