<script setup lang="ts">
import { ChatMessageType, MessageDTO, SystemMessageDTO } from '@/dto/message'

const props = defineProps<{
  message?: MessageDTO
}>()

const { message } = toRefs(props)

const hasSystemMessage = computed(() => {
  if (!message.value || message.value.messageType !== ChatMessageType.SYSTEM) {
    return false
  }
})

const getSystemMessage = computed(() => {
  return message.value!.message as SystemMessageDTO
})


const hasDrugstOneNetwork = computed(() => {
  if (!hasSystemMessage) {
    return false
  }
  return !!getSystemMessage.value.drugstOneNetwork
})

</script>

<template>
  <v-container v-if="hasDrugstOneNetwork">
    <DrugstOneNetwork :network="getSystemMessage.drugstOneNetwork" />
  </v-container>
</template>

<style scoped>

</style>