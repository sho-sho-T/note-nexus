"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { SaveIcon } from "@/components/icons";

const CreateNote = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/notes" className="font-medium text-lg" prefetch={false}>
            Notes
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full">
            <SaveIcon className="w-6 h-6" />
            <span className="sr-only">Save</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 flex flex-col">
        <div className="max-w-5xl mx-auto space-y-6 w-full flex-1 flex flex-col">
          <div className="border rounded-lg p-4 bg-card shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary">
            <Textarea
              placeholder="Cue"
              className="w-full resize-none bg-transparent outline-none text-lg rounded-md"
              rows={2}
            />
          </div>
          <div className="border rounded-lg p-4 bg-card shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary flex-1 flex flex-col">
            <Textarea
              placeholder="Note"
              className="w-full flex-1 resize-none bg-transparent outline-none rounded-md text-base leading-relaxed"
              style={{ minHeight: "200px" }}
            />
          </div>
          <div className="border rounded-lg p-4 bg-card shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary">
            <Textarea
              placeholder="Summary"
              className="w-full resize-none bg-transparent outline-none text-lg rounded-md"
              rows={3}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateNote;
