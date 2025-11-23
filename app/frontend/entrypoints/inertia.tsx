import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import '../styles/application.css'

createInertiaApp({
  // Resolve page components
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    return pages[`../pages/${name}.tsx`] as any
  },

  // Setup the app
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },

  // Optional: Add progress indicator
  progress: {
    color: '#4B5563',
    showSpinner: true,
  },
})
