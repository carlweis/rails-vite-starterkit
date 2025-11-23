# Rails + Vite + React Starter Kit (with Auth)

A production-ready Ruby on Rails 8 starter kit with Vite, TypeScript, React, Tailwind CSS, Shadcn UI, **and complete authentication system**. Build full-stack applications quickly with the power of Rails on the backend and a lightning-fast React frontend.

## Tech Stack

### Backend
- **Ruby on Rails 8.1** - Latest Rails with modern features
- **PostgreSQL** - Production-grade database
- **Devise** - Complete authentication solution
- **Devise-Two-Factor** - Two-factor authentication (2FA)
- **Pundit** - Authorization with policies
- **ActiveStorage** - File uploads and attachments
- **Sidekiq** - Background job processing
- **Redis** - In-memory data store for Sidekiq
- **Flipper** - Feature flags for gradual rollouts

### Frontend
- **Vite** - Next generation frontend tooling for lightning-fast builds
- **TypeScript** - Type-safe JavaScript
- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS v3** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible component library
- **Dark Mode** - Built-in theme switching

## Features

✅ **Authentication** - Complete user auth with Devise
✅ **Two-Factor Auth** - Optional 2FA with QR codes
✅ **Authorization** - Policy-based permissions with Pundit
✅ **Database** - PostgreSQL for all environments
✅ **Background Jobs** - Sidekiq + Redis for async processing
✅ **Feature Flags** - Flipper for controlled feature rollouts
✅ **Admin UIs** - Sidekiq & Flipper web dashboards
✅ **Dark Mode** - Theme switching out of the box
✅ **File Uploads** - ActiveStorage configured
✅ **Testing** - RSpec, Capybara, FactoryBot ready
✅ **Modern Frontend** - React + TypeScript + Vite
✅ **UI Components** - Shadcn UI + Tailwind CSS

## Prerequisites

- Ruby 3.3.6 or higher
- Node.js 22.x or higher
- PostgreSQL 14+ (running locally)
- Redis 5.0+ (for background jobs)

## Quick Start

### Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/carlweis/rails-vite-starterkit.git my-app
cd my-app

# Run automated setup (installs dependencies, creates database, seeds demo user, starts server)
bin/setup
```

That's it! The setup script will:
- Install Ruby and JavaScript dependencies
- Start PostgreSQL and Redis if needed
- Create and migrate the database
- Seed a demo admin user
- Start the development server

**Default Demo User:**
- Email: `demo@example.com`
- Password: `demouser1234`
- Role: Admin

**Admin UIs** (login as admin first):
- Sidekiq: `http://localhost:3000/sidekiq`
- Flipper: `http://localhost:3000/flipper`

Visit `http://localhost:3000` and log in with the demo user.

### Manual Setup

If you prefer to run each step manually:

```bash
# Clone the repository
git clone https://github.com/carlweis/rails-vite-starterkit.git my-app
cd my-app

# Install dependencies
bundle install
npm install

# Start PostgreSQL and Redis (if not running)
pg_ctlcluster 16 main start
redis-server --daemonize yes

# Setup database
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed

# Start development server
bin/dev
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

## Background Jobs & Feature Flags

### Sidekiq (Background Jobs)

Sidekiq is configured and ready to use for background job processing.

**Creating a background job:**
```bash
bin/rails generate job example
```

**Using background jobs:**
```ruby
# In your controller or model
ExampleJob.perform_later(arg1, arg2)

# Or with a delay
ExampleJob.set(wait: 5.minutes).perform_later(arg1, arg2)
```

**Monitoring jobs:**
Visit `http://localhost:3000/sidekiq` (admin only) to:
- View job queues and their status
- Monitor failed jobs and retry them
- See real-time job processing statistics

**Running Sidekiq:**
```bash
# Sidekiq starts automatically with bin/dev
# To run it manually:
bundle exec sidekiq
```

### Flipper (Feature Flags)

Flipper is configured for feature flag management.

**Basic usage:**
```ruby
# In your code
if Flipper.enabled?(:new_feature)
  # New feature code
else
  # Old code
end

# Enable for a specific user
Flipper.enable_actor(:new_feature, current_user)

# Enable for a percentage of users
Flipper.enable_percentage_of_actors(:new_feature, 25)

# Enable for everyone
Flipper.enable(:new_feature)
```

**Managing feature flags:**
Visit `http://localhost:3000/flipper` (admin only) to:
- Create new feature flags
- Enable/disable features
- Enable features for specific users or groups
- Set percentage rollouts

**Common patterns:**
```ruby
# Enable for admins only
Flipper.enable(:admin_feature) if current_user.admin?

# Gradual rollout
Flipper.enable_percentage_of_time(:beta_feature, 10)  # 10% of requests
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
