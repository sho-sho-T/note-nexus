"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationItem } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import React from "react";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import { UserData, getUserData } from "@/mocks/mockData";
import { dateFormatter } from "@/utils/dateFormatter";

const Notes = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<UserData["user"] | null>(null);
  const [notes, setNotes] = React.useState<UserData["notes"]>([]);
  const [categories, setCategories] = React.useState<UserData["categories"]>(
    []
  );
  const [tags, setTags] = React.useState<UserData["tags"]>([]);

  // TODO: ローディング中のアニメーションや、エラーメッセージの表示をやる
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);

        const fetchedUserData = await getUserData(1); // user認証処理を実装していないので現時点ではベタ書きをしておく。
        setUser(fetchedUserData.user);
        setNotes(fetchedUserData.notes);
        setCategories(fetchedUserData.categories);
        setTags(fetchedUserData.tags);
      } catch (e) {
        setError("データの取得に失敗しました");
        console.error("Error fetching notes:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const Header = () => {
    return (
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-2xl font-bold text-primary"
            prefetch={false}
          >
            Notes
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/create")}
          >
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
    );
  };

  const Submenu = () => {
    return (
      <div className="border-r p-6">
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-primary">Categories</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>All Categories</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id}>
                  <Checkbox />
                  <span className="ml-2">{category.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-primary">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const List = () => {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-lg bg-card p-4 shadow-sm transition-all duration-200 hover:bg-primary/10"
            >
              <div className="mb-5 text-lg font-medium text-primary">
                {note.cue}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {note.content}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                更新： {dateFormatter(String(note.updatedAt))}
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
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Submenu />
        <List />
      </div>
    </div>
  );
};

export default Notes;
