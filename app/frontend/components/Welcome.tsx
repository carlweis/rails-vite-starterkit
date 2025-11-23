import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export default function Welcome() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-8">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Rails Vite Starterkit
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A modern full-stack development starter
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main welcome card */}
        <Card className="max-w-3xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Getting Started</CardTitle>
            <CardDescription className="text-base">
              You're all set up with Rails 7, Vite, React, and Tailwind CSS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current theme indicator */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Current theme: <span className="font-bold uppercase">{theme}</span> mode
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Try toggling the theme with the button above!
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                What's Included:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Rails 7 API</li>
                    <li>Devise Authentication</li>
                    <li>Sidekiq Background Jobs</li>
                    <li>Redis Caching</li>
                    <li>Flipper Feature Flags</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Vite Build Tool</li>
                    <li>React 18</li>
                    <li>TypeScript Support</li>
                    <li>Tailwind CSS</li>
                    <li>Theme Switching</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="default" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
              <Button variant="ghost" size="lg">
                Explore Examples
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Built with ❤️ using modern web technologies
          </p>
        </div>
      </div>
    </div>
  );
}
