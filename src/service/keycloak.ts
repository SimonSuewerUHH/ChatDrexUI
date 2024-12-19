import { keycloakJsConfig, serviceConfig, ServiceConfigType } from '@/service/keycloak/config'
import { AuthStoreReturnType } from '@/stores/auth'
import Keycloak from 'keycloak-js'

export class KeycloakService {
  protected keycloakInstance: Keycloak;
  protected conf: ServiceConfigType;
  private enabled: boolean = true

  constructor(
    protected userStore: AuthStoreReturnType,
  ) {
    this.keycloakInstance = new Keycloak(keycloakJsConfig)
    this.conf = serviceConfig
    this.enabled = import.meta.env.VITE_APP_KEYCLOAK_ENABLED;
  }

  async login(): Promise<void> {
    if (!this.enabled) {
      return
    }
    this.userStore.errorMsg = ''
    try {
      const auth = await this.keycloakInstance.init({ onLoad: 'login-required', checkLoginIframe: false })
      if (auth) {
        this.userStore.accessToken = this.keycloakInstance.token as string
        await this.refreshToken()
        await this.fetchUserProfile()

        const roleKey = this.keycloakInstance.clientId ?? ''
        this.extractClientRoles(roleKey)
      } else {
        this.userStore.errorMsg = 'Auth failed. Unknown error occurred'
      }
    } catch (error: unknown) {
      this.userStore.errorMsg = error as string
    }
  }

  logout(): void {
    this.keycloakInstance.logout()
  }

  manageAccount(): void {
    this.keycloakInstance.accountManagement()
  }

  async fetchUserProfile(): Promise<void> {
    try {
      this.userStore.user = await this.keycloakInstance.loadUserProfile()
    } catch (error: unknown) {
      this.userStore.errorMsg = error as string
    }
  }

  extractClientRoles(roleKey: string): void {
    if (this.keycloakInstance.resourceAccess && Object.prototype.hasOwnProperty.call(this.keycloakInstance.resourceAccess, roleKey)) {
      this.keycloakInstance.resourceAccess[roleKey].roles.forEach((group: string) => {
        this.userStore.addRole(group)
      })
    }
  }

  async refreshToken(): Promise<void> {
    const refreshed = await this.keycloakInstance.updateToken(5)

    if (refreshed) {
      this.userStore.accessToken = this.keycloakInstance.token as string
    }

    setTimeout(async () => {
      await this.refreshToken()
    }, this.conf.refreshTokenMilliseconds)
  }

}