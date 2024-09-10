"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

const SaveIcon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
};
