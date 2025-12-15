import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ImmichConfig } from '@/types/immich'

const STORAGE_KEY = 'immich-swipe-config'

export const useAuthStore = defineStore('auth', () => {
  const serverUrl = ref<string>('')
  const apiKey = ref<string>('')
  const hasStoredConfig = ref<boolean>(false)
  const proxyBaseUrl = '/api'

  function readStoredConfig(): ImmichConfig | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const config: ImmichConfig = JSON.parse(stored)
        return {
          serverUrl: config.serverUrl || '',
          apiKey: config.apiKey || '',
        }
      } catch {
        console.error('Failed to parse stored config')
      }
    }
    return null
  }

  // Load from localStorage on init or when requested
  function loadConfig() {
    const config = readStoredConfig()
    if (config) {
      serverUrl.value = config.serverUrl
      apiKey.value = config.apiKey
      hasStoredConfig.value = true
    } else {
      serverUrl.value = ''
      apiKey.value = ''
      hasStoredConfig.value = false
    }
  }

  // Save to localStorage
  function saveConfig() {
    const config: ImmichConfig = {
      serverUrl: serverUrl.value,
      apiKey: apiKey.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    hasStoredConfig.value = true
  }

  // Set config
  function setConfig(url: string, key: string) {
    // Normalize URL - remove trailing slash
    serverUrl.value = url.replace(/\/+$/, '')
    apiKey.value = key
    saveConfig()
  }

  // Clear config (logout)
  function clearConfig() {
    serverUrl.value = ''
    apiKey.value = ''
    localStorage.removeItem(STORAGE_KEY)
    hasStoredConfig.value = false
  }

  function getStoredConfig(): ImmichConfig | null {
    return readStoredConfig()
  }

  // Check if logged in
  const isLoggedIn = computed(() => {
    return serverUrl.value.length > 0 && apiKey.value.length > 0
  })

  // Immich server base URL without /api suffix
  const immichBaseUrl = computed(() => {
    if (!serverUrl.value) return ''
    return serverUrl.value.replace(/\/api\/?$/, '')
  })

  // Base URL for direct Immich API calls (always ends with /api)
  const apiBaseUrl = computed(() => {
    if (!serverUrl.value) return ''
    const normalized = serverUrl.value.replace(/\/+$/, '')
    return normalized.endsWith('/api') ? normalized : `${normalized}/api`
  })

  // Initialize
  loadConfig()

  return {
    serverUrl,
    apiKey,
    isLoggedIn,
    hasStoredConfig,
    immichBaseUrl,
    apiBaseUrl,
    proxyBaseUrl,
    setConfig,
    clearConfig,
    loadConfig,
    getStoredConfig,
  }
})
