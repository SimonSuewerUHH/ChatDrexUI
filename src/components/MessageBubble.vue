<script setup lang="ts">

import { ChatMessageType, MessageDTO } from '@/dto/message'

const props = defineProps<{
  message?: MessageDTO
  messages?: MessageDTO[]
  loaded?: boolean
  errors?: string[]
}>()

let dialog = ref(false)
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

  <v-card v-else-if="loaded !== undefined" class="pa-3 message-system">
    <v-card-title>
      <v-btn v-if="errors && errors.length > 0" icon @click="dialog = true" class="error-btn">
        <v-icon color="red">mdi-alert-circle-outline</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div v-for="(msg, index) in messages" :key="index">
          <span v-if="msg.messageType !== ChatMessageType.SYSTEM">
            {{ msg.message }}
          </span>
        <div v-else>
          <SystemMessage :message="msg" />
        </div>
      </div>
    </v-card-text>
    <v-progress-linear v-if="!loaded"
                       color="white"
                       indeterminate
                       reverse
    ></v-progress-linear>
  </v-card>

  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>Errors</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="(error, index) in errors" :key="index">
            <v-list-item-icon>
              <v-icon color="red">mdi-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ error }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="dialog = false">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped lang="scss">
@use '@/styles/settings';

.error-btn {
  float: right;
}

.message-human {
  background-color: settings.$chat-bg-human;
}

.message-system {
  min-width: 30%;
  max-width: 80%;
  background-color: settings.$chat-bg-system;
}


</style>
  