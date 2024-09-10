"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between">
        <Link href="#" className="font-medium" prefetch={false}>
          Home
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full">
          <SaveIcon className="w-5 h-5" />
          <span className="sr-only">Save</span>
        </Button>
      </header>
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] gap-4 p-6">
        <div className="border rounded-md p-4 bg-primary/10 transition-colors focus-within:bg-primary/20">
          <Textarea
            placeholder="Cue"
            className="w-full resize-none bg-transparent outline-none"
          />
        </div>
        <div className="border rounded-md p-4 bg-primary/10 transition-colors focus-within:bg-primary/20">
          <Textarea
            placeholder="Note"
            className="w-full h-full resize-none bg-transparent outline-none"
          />
        </div>
        <div className="border rounded-md p-4 bg-primary/10 transition-colors focus-within:bg-primary/20">
          <Textarea
            placeholder="Summary"
            className="w-full resize-none bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function SaveIcon(props: any) {
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
}
