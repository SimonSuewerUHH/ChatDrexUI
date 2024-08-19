<script lang="ts" setup>
import { useChatStore } from "@/stores/chat";


const chatSore = useChatStore();
chatSore.bindEvents();
chatSore.connect();
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
