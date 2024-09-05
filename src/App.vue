<script lang="ts" setup>

import { useAuthStore } from '@/stores/auth'
import { KeycloakService } from '@/service/keycloak'

const userStore = useAuthStore();
const keycloakService = new KeycloakService(userStore)

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
