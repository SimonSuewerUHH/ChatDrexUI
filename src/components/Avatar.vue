<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { KeycloakService } from '@/service/keycloak'


const props = defineProps<{
  keycloakService: KeycloakService
}>()

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const initials = computed(() => {
  if (user.value && user.value.firstName && user.value.lastName) {
    return `${user.value.firstName.charAt(0).toUpperCase()}
    ${user.value.lastName.charAt(0).toUpperCase()}`
  }
  return ''
})

const login = () => props.keycloakService.login()
const logout = () => props.keycloakService.logout()
const edit = () => props.keycloakService.manageAccount()

</script>

<template>
  <v-container
    class="avatar-wrapper"
  >
      <v-menu >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar
              size="large"
            >
              <v-icon v-if="authStore.isLoggedIn" icon="mdi-home-account">
              </v-icon>
              <v-icon v-else icon="mdi-login">
              </v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text v-if="authStore.isLoggedIn">
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
                <span class="text-h5">{{ initials }}</span>
              </v-avatar>
              <h3>{{ user?.firstName }}</h3>
              <p class="text-caption mt-1">
                {{ user?.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                @click="edit()"
              >
                <v-icon icon="mdi-account-edit">
                </v-icon>
                Edit Account
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                @click="logout()"
              >
                <v-icon icon="mdi-logout">
                </v-icon>
                Logout
              </v-btn>
            </div>
          </v-card-text>

          <v-card-text v-else>
            <v-btn
              variant="text"
              rounded
              @click="login()"
            >
              <v-icon icon="mdi-login">
              </v-icon>
              Login
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
  </v-container>
</template>


<style scoped>


.avatar-wrapper {
  z-index: 9999;
  position: fixed;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  padding: 0;
}

</style>