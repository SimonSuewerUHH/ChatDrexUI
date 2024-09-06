<script lang="ts" setup>

import { useAuthStore } from '@/stores/auth'
import { KeycloakService } from '@/service/keycloak'
import { useChatStore } from '@/stores/chat'

const userStore = useAuthStore();
const chatStore = useChatStore();
const keycloakService = new KeycloakService(userStore)

chatStore.connect();

const newId = chatStore.createNewConversation();
console.log('create new chat with id', newId);


</script>

<template>
  <v-app>
    <v-main>
      <Avatar :keycloakService="keycloakService"/>
      <Debug />
      <router-view />
    </v-main>
  </v-app>
</template>
