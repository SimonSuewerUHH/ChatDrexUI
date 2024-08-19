<script setup lang="ts">
const examples = ref([
  "examples1",
  "examples2",
  "examples3",
])
const capabilities = ref([
  "capabilities1",
  "capabilities2",
  "capabilities3",
])
const limitations = ref([
  "limitations1",
  "limitations2",
  "limitations3",
])
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="text-h2">Welcome to <span class="text-primary">ChatDrexWebUI</span></h2>
          <p class="text-caption my-5">
            ChatDrexWebUI is an ....
            <br>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="sunny"></v-icon>
                  <h3 class="text-h6">Examples</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="example in examples" :content="example" />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="bolt"></v-icon>
                  <h3 class="text-h6">Capabilities</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="capabilitie in capabilities" :content="capabilitie" />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="warning_amber"></v-icon>
                  <h3 class="text-h6">Limitations</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="limitation in limitations" :content="limitation" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>