<template>
  <v-app>
    <v-main class="main">
      <router-view />
    </v-main>

    <MessageInput  />

  </v-app>
</template>

<script lang="ts" setup>

</script>
<style scoped lang="scss">
  .main {
    padding: 0 !important;
  }
</style>