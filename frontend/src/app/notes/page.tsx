"use client";

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationItem } from "@/components/ui/pagination";

const Notes = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-2xl font-bold text-primary"
            prefetch={false}
          >
            Notes
          </Link>
          <Button size="sm" variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4"
          />
        </div>
      </header>
      <div className="flex flex-1">
        <div className="border-r p-6">
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-primary">
              Categories
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>All Categories</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Checkbox />
                  <span className="ml-2">Work</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox />
                  <span className="ml-2">Personal</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox />
                  <span className="ml-2">Shopping</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox />
                  <span className="ml-2">Travel</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-primary">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Work",
                "Personal",
                "Shopping",
                "Travel",
                "Idea",
                "Reminder",
              ].map((tag) => (
                <Button
                  key={tag}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Grocery List",
                content:
                  "Milk, eggs, bread, apples, chicken, rice, broccoli, toilet paper, laundry detergent",
                editedTime: "2 days ago",
              },
              {
                title: "Travel Planning",
                content:
                  "Book flights, reserve hotel, research activities, pack clothes, get travel insurance",
                editedTime: "1 week ago",
              },
              {
                title: "Work Tasks",
                content:
                  "Finish quarterly report, schedule team meeting, follow up with client, update website",
                editedTime: "3 days ago",
              },
              {
                title: "Personal Goals",
                content:
                  "Start exercising 3 times a week, read 1 book per month, save $500 per month, learn a new skill",
                editedTime: "1 month ago",
              },
              {
                title: "Shopping List",
                content:
                  "New jeans, white t-shirts, running shoes, kitchen utensils, bedding set, desk lamp",
                editedTime: "2 weeks ago",
              },
              {
                title: "Idea Brainstorm",
                content:
                  "New product feature, marketing campaign, business expansion, process improvement",
                editedTime: "1 day ago",
              },
            ].map((note, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-lg bg-card p-4 shadow-sm transition-all duration-200 hover:bg-primary/10"
              >
                <div className="mb-2 text-lg font-medium text-primary">
                  {note.title}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.content}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Last edited {note.editedTime}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationItem>
                <Button variant="outline" size="icon">
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon">
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;

// ⇩　Icons

const ChevronDownIcon = (props: any) => {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

const ChevronLeftIcon = (props: any) => {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
};

const ChevronRightIcon = (props: any) => {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};

const PlusIcon = (props: any) => {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

const SearchIcon = (props: any) => {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
};
