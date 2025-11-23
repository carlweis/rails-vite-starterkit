import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export default function Example() {
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