"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
     

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Welcome to SkillBridge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A modern skill-sharing platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>TypeScript</CardTitle>
                <CardDescription>Type-safe development</CardDescription>
              </CardHeader>
              <CardContent>
                Full TypeScript support for better DX and code quality.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dark Mode</CardTitle>
                <CardDescription>Theme switching enabled</CardDescription>
              </CardHeader>
              <CardContent>
                next-themes integration with class-based dark mode support.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>shadcn/ui</CardTitle>
                <CardDescription>Beautiful components</CardDescription>
              </CardHeader>
              <CardContent>
                Pre-built, accessible UI components ready to use.
              </CardContent>
            </Card>
          </div>

          {/* Status info */}
          <div className="mt-12 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Setup Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your SkillBridge project is ready for development.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
