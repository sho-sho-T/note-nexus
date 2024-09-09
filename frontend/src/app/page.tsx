"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to NoteNexus
          </h1>
        </div>
        <div className="space-y-4">
          <Button className="w-full" onClick={() => {}}>
            Sign Up
          </Button>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            Log In
          </Button>
        </div>
        <p className="mt-8 text-muted-foreground">
          NoteNexus is a simple and intuitive note-taking app that helps you
          stay organized and productive. Take notes, create to-do lists, and
          never forget important information.
        </p>
      </div>
    </div>
  );
}
