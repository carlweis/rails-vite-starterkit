import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { ThemeProvider } from '../contexts/ThemeContext'
import '../styles/application.css'

createInertiaApp({
  // Resolve page components
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    return pages[`../pages/${name}.tsx`] as any
  },

  // Setup the app
  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider>
        <App {...props} />
      </ThemeProvider>
    )
  },

  // Optional: Add progress indicator
  progress: {
    color: '#4B5563',
    showSpinner: true,
  },
})
