# 🎨 Theme Switcher Tutorial: Learn React Context API

**What you'll build:** A dark/light mode toggle system using React Context API
**What you'll learn:** Context API, custom hooks, TypeScript, Tailwind dark mode, localStorage
**Time:** 30-45 minutes

---

## 📚 What is Context API?

React Context API allows you to share data across your component tree without "prop drilling" (passing props through multiple levels). It's perfect for global state like:
- Theme preferences
- User authentication
- Language settings
- Shopping cart data

**The Pattern:**
1. **Create** a Context
2. **Provide** values through a Provider component
3. **Consume** values with the useContext hook

---

## 🎯 Step 1: Set up Tailwind Dark Mode

First, we need to configure Tailwind to support dark mode.

**Open:** `tailwind.config.js`

**Find** the config object and add the `darkMode` setting:

```js
export default {
  darkMode: 'class', // ← Add this line (enables class-based dark mode)
  content: [
    "./index.html",
    "./app/frontend/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of config
}
```

**💡 Why?** This tells Tailwind to enable dark mode when a `dark` class is present on a parent element (usually `<html>`).

---

## 🎯 Step 2: Create the Theme Context

Create a new file for our theme context and provider.

**Create:** `app/frontend/contexts/ThemeContext.tsx`

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Define the shape of our context
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// 2. Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Create the Provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'light';
  });

  // Update the DOM and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add the current theme class
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle between light and dark
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Function to set a specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Provide the theme state and functions to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Create a custom hook for consuming the context
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
```

**💡 What's happening here?**

- **Lines 4-10:** TypeScript types define what our context looks like
- **Line 13:** Creates the context object
- **Line 16:** Provider component that will wrap our app
- **Lines 18-21:** Initialize state from localStorage (persists across page refreshes)
- **Lines 24-35:** Side effect that updates the DOM class and localStorage
- **Lines 38-44:** Helper functions to change the theme
- **Line 47:** Provider makes the value available to children
- **Lines 53-61:** Custom hook with error checking (ensures it's used correctly)

---

## 🎯 Step 3: Wrap Your App with ThemeProvider

Now we need to wrap our app with the provider so all components can access the theme.

**Open:** `app/frontend/App.tsx`

**Update it to:**

```tsx
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import HelloWorld from './components/HelloWorld';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <HelloWorld />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

**💡 Notice:**
- `<ThemeProvider>` wraps everything
- `bg-white dark:bg-gray-900` - background is white in light mode, gray-900 in dark mode
- `transition-colors` - smooth color transitions when switching themes

---

## 🎯 Step 4: Create a Theme Toggle Component

Let's create a beautiful toggle button using shadcn/ui.

**Create:** `app/frontend/components/ThemeToggle.tsx`

```tsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label="Toggle theme"
    >
      {/* Sun icon - visible in dark mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

      {/* Moon icon - visible in light mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

**💡 What's happening?**

- **Line 7:** We consume the theme context using our custom hook
- **Lines 18-20:** Two icons that swap visibility based on dark mode
- **Tailwind classes:** `dark:scale-0` hides elements in dark mode, creating a swap effect
- **Line 23:** Screen reader text for accessibility

---

## 🎯 Step 5: Update HelloWorld to Use the Theme

Let's update the HelloWorld component to use our theme toggle and show dark mode support.

**Open:** `app/frontend/components/HelloWorld.tsx`

**Replace with:**

```tsx
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export default function HelloWorld() {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto p-8">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Rails + Vite + React
        </h1>
        <ThemeToggle />
      </div>

      {/* Info card showing current theme */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Theme Switcher Tutorial</CardTitle>
          <CardDescription>
            You're learning React Context API!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Current theme: <span className="font-bold uppercase">{theme}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              What you just learned:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Creating a Context with TypeScript</li>
              <li>Building a Provider component</li>
              <li>Using the useContext hook</li>
              <li>Tailwind dark mode classes</li>
              <li>localStorage persistence</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**💡 Notice:**
- We consume `theme` from our context
- Dark mode classes everywhere: `dark:text-white`, `dark:bg-blue-950`, etc.
- The current theme is displayed in the card
- All shadcn/ui components automatically support dark mode

---

## 🎯 Step 6: Test Your Theme Switcher!

Now let's see it in action:

1. **Start your dev server:**
   ```bash
   bin/dev
   ```

2. **Open your browser:** Visit `http://localhost:5173`

3. **Click the theme toggle button** and watch:
   - Background color changes
   - Text colors invert
   - Icons swap smoothly
   - The theme persists when you refresh!

---

## 🎓 Understanding What You Built

### Context API Pattern

```
ThemeContext (createContext)
    ↓
ThemeProvider (manages state)
    ↓
App (wrapped in provider)
    ↓
Components (consume with useTheme)
```

### Data Flow

1. **ThemeProvider** holds the theme state
2. **Any component** can call `useTheme()` to get current theme and functions
3. **No prop drilling** needed - components deep in the tree can access theme directly
4. **All consumers re-render** when theme changes

---

## 🚀 Challenge: Extend Your Learning

Try these exercises to deepen your understanding:

### Easy
- [ ] Add a third theme option: 'system' (uses OS preference)
- [ ] Add a keyboard shortcut (Ctrl+Shift+D) to toggle theme
- [ ] Create a settings page that shows radio buttons for theme selection

### Medium
- [ ] Add animated transitions when switching themes
- [ ] Create a color picker that lets users choose custom theme colors
- [ ] Add a "theme preview" that shows both themes side-by-side

### Advanced
- [ ] Create a second context for user preferences (font size, language)
- [ ] Combine theme + preferences into a single SettingsContext
- [ ] Add theme scheduling (dark mode from 8pm-6am automatically)

---

## 📖 Key Concepts Review

**Context API:**
```tsx
// 1. Create
const MyContext = createContext<MyType | undefined>(undefined);

// 2. Provide
<MyContext.Provider value={data}>
  {children}
</MyContext.Provider>

// 3. Consume
const data = useContext(MyContext);
```

**Custom Hook Pattern:**
```tsx
// Encapsulates context logic + error handling
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Must be used within Provider');
  return context;
}
```

**TypeScript Best Practices:**
- Define clear interfaces for your context shape
- Use union types for limited options (`'light' | 'dark'`)
- Make context undefined by default, check in custom hook

**Tailwind Dark Mode:**
- Use `dark:` prefix for dark mode styles
- Class-based mode gives you full control
- Apply to `<html>` or root element

---

## 🎉 Congratulations!

You've successfully built a theme switcher and learned:
- ✅ React Context API fundamentals
- ✅ Custom hooks for context consumption
- ✅ TypeScript with React Context
- ✅ Tailwind dark mode implementation
- ✅ localStorage for persistence
- ✅ Component composition patterns

**Next Steps:**
- Try the challenges above
- Build a Todo app with Context for state management
- Learn about `useReducer` for complex state logic
- Explore Context with API data fetching

---

## 💡 Tips & Best Practices

**When to use Context:**
- ✅ Global UI state (theme, locale, sidebar open/closed)
- ✅ User authentication state
- ✅ Data needed by many components at different nesting levels

**When NOT to use Context:**
- ❌ All state (use local state for component-specific data)
- ❌ High-frequency updates (can cause performance issues)
- ❌ Server state (use React Query, SWR, or similar instead)

**Performance tip:** Context consumers re-render when value changes. For complex apps, split contexts by update frequency (theme changes rarely, cart updates frequently).

---

Happy coding! 🚀
