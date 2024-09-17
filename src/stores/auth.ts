import { defineStore } from "pinia";
import type {KeycloakProfile} from "keycloak-js";


export type AuthStoreReturnType = ReturnType<typeof useAuthStore>


export interface UserStore {
  user: KeycloakProfile | null,
  accessToken: string | null,
  roles: string[],
  errorMsg: string
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () : UserStore => ({
    user: null,
    accessToken: "",
    roles: [],
    errorMsg: "",
  }),
  getters: {
    isLoggedIn(): boolean {
      return !!this.accessToken
    },
    token(): string | undefined {
      return this.accessToken || undefined
    }
  },
  actions: {
    addRole(role: string) : void {
      this.roles.push(role)
    },
  }
});