import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { zhHans } from 'vuetify/locale'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
  components: {
    VDateInput,
  },
  locale: {
    locale: 'zhHans',
    fallback: 'zhHans',
    messages: { zhHans },
  },
  theme: {
    defaultTheme: 'moneyTheme',
    themes: {
      moneyTheme: {
        colors: {
          primary: '#F59E0B',
          'primary-hover': '#D97706',
          onPrimary: '#0F172A',
          secondary: '#FBBF24',
          accent: '#8B5CF6',
          background: '#F3F4F8',
          surface: '#FFFFFF',
          'surface-hover': '#F9FAFB',
          foreground: '#0F172A',
          'foreground-secondary': '#475569',
          muted: '#94A3B8',
          border: '#E2E8F0',
          'border-light': '#F1F5F9',
          income: '#EF4444',
          'income-bg': '#FEF2F2',
          expense: '#22C55E',
          'expense-bg': '#F0FDF4',
          'tab-active': '#0F172A',
          'tab-inactive': '#94A3B8',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
    },
  },
})
