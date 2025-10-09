import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

function detectSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.documentElement.style.setProperty('color-scheme', theme)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, theme)
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as Theme,
    initialized: false,
  }),
  actions: {
    init() {
      if (this.initialized) return
      const stored = readStoredTheme()
      const resolved = stored ?? detectSystemTheme()
      this.theme = resolved
      this.initialized = true
      applyTheme(resolved)
    },
    setTheme(theme: Theme) {
      if (this.theme === theme) return
      this.theme = theme
      applyTheme(theme)
    },
    toggle() {
      const next: Theme = this.theme === 'light' ? 'dark' : 'light'
      this.setTheme(next)
    },
  },
})
