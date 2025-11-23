# Rails + Vite + React Starter Kit

A modern Ruby on Rails 8 starter kit with Vite, TypeScript, React, Tailwind CSS, and Shadcn UI. Build full-stack applications quickly with the power of Rails on the backend and a lightning-fast React frontend.

## Tech Stack

- **Ruby on Rails 8.1** - Latest Rails with modern features
- **Vite** - Next generation frontend tooling for lightning-fast builds
- **TypeScript** - Type-safe JavaScript
- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS v3** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible component library
- **Vite Ruby** - Seamless integration between Rails and Vite

## Prerequisites

- Ruby 3.3.6 or higher
- Node.js 22.x or higher
- SQLite3

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd rails-vite-starterkit

# Install Ruby dependencies
bundle install

# Install JavaScript dependencies
npm install

# Setup database
bin/rails db:create db:migrate
```

### 2. Run Development Server

You have two options for running the development server:

**Option A: Single command (recommended)**
```bash
bin/dev
```

**Option B: Separate processes**
```bash
# Terminal 1 - Rails server
bin/rails server

# Terminal 2 - Vite dev server
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
app/frontend/              # All frontend code lives here
├── components/           # React components
│   ├── ui/              # Shadcn UI components
│   │   └── button.tsx   # Example button component
│   └── App.tsx          # Main App component
├── entrypoints/         # Vite entrypoints
│   └── application.tsx  # Main application entrypoint
├── lib/                 # Utilities and helpers
│   └── utils.ts         # Utility functions (cn helper)
└── styles/              # CSS/Tailwind styles
    └── application.css  # Main stylesheet with Tailwind

app/views/               # Rails views
├── layouts/
│   └── application.html.erb  # Includes Vite tags
└── home/
    └── index.html.erb        # React root element

config/
├── vite.json           # Vite Ruby configuration
└── routes.rb           # Rails routes

vite.config.ts          # Vite configuration
tsconfig.json           # TypeScript configuration
tailwind.config.ts      # Tailwind configuration
components.json         # Shadcn UI configuration
```

## Adding Shadcn UI Components

This starter kit comes with Shadcn UI pre-configured. To add new components:

### Manual Installation

Create new components in `app/frontend/components/ui/`. Example components can be found at [shadcn/ui](https://ui.shadcn.com).

### Path Aliases

The following aliases are configured:
- `@/components` → `app/frontend/components`
- `@/lib` → `app/frontend/lib`
- `@/styles` → `app/frontend/styles`

Example usage:
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## Working with React Components

### Creating a New Page

1. **Create a new controller and view:**
```bash
bin/rails generate controller pages dashboard
```

2. **Add the React root element in the view:**
```erb
<!-- app/views/pages/dashboard.html.erb -->
<div id="dashboard-root"></div>
```

3. **Create a new React entrypoint:**
```tsx
// app/frontend/entrypoints/dashboard.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/application.css'
import Dashboard from '../components/Dashboard'

const rootElement = document.getElementById('dashboard-root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  )
}
```

4. **Update the layout to include the new entrypoint:**
```erb
<!-- app/views/pages/dashboard.html.erb -->
<%= vite_javascript_tag 'dashboard' %>
<div id="dashboard-root"></div>
```

### Using Components

```tsx
// app/frontend/components/Dashboard.tsx
import React from 'react'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <Button>Click me</Button>
    </div>
  )
}
```

## Styling with Tailwind CSS

Tailwind CSS is configured with the Shadcn color system. You can customize colors in `app/frontend/styles/application.css` and `tailwind.config.ts`.

### Dark Mode

Dark mode is supported out of the box. Toggle it by adding the `dark` class to the `<html>` element:

```tsx
document.documentElement.classList.toggle('dark')
```

## Building for Production

```bash
# Build assets
npm run build

# Precompile Rails assets
bin/rails assets:precompile

# Run production server
RAILS_ENV=production bin/rails server
```

## TypeScript

TypeScript is fully configured with strict mode enabled. All React components use `.tsx` extension.

Type checking:
```bash
npx tsc --noEmit
```

## Testing

```bash
# Run Rails tests
bin/rails test

# Run system tests
bin/rails test:system
```

## Deployment

This starter kit includes Docker configuration and Kamal setup for easy deployment.

### Docker

```bash
docker build -t rails-vite-app .
docker run -p 3000:3000 rails-vite-app
```

### Kamal

```bash
# Configure your deployment in config/deploy.yml
kamal setup
kamal deploy
```

## Customization

### Change Database

Edit `config/database.yml` and update the `Gemfile` to use PostgreSQL or MySQL:

```ruby
# Gemfile
gem 'pg' # PostgreSQL
# or
gem 'mysql2' # MySQL
```

### Add More Vite Plugins

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RubyPlugin from 'vite-plugin-ruby'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    RubyPlugin(),
    tailwindcss(),
    // Add more plugins here
  ],
})
```

## Troubleshooting

### Vite dev server not connecting

Make sure both the Rails server and Vite dev server are running. If using `bin/dev`, check `Procfile.dev`.

### TypeScript errors

Run `npm install` to ensure all type definitions are installed.

### Tailwind styles not applying

1. Check that the CSS file is imported in your entrypoint
2. Verify the `content` paths in `tailwind.config.ts`
3. Restart the Vite dev server

## Contributing

This is a starter kit template. Feel free to customize it for your needs.

## License

MIT
