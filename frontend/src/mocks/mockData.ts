// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Users table
export interface User {
  user_id: number;
  user_name: string;
  password: string; // In a real app, this would be hashed
  created_at: Date;
}

export const mockUsers: User[] = [
  {
    user_id: 1,
    user_name: "john_doe",
    password: "hashed_password_1",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
  {
    user_id: 2,
    user_name: "jane_smith",
    password: "hashed_password_2",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
];

// Notes table
export interface Note {
  note_id: number;
  user_id: number;
  cue: string;
  note_content: string;
  summary: string | null;
  created_at: Date;
  updated_at: Date;
}

export const mockNotes: Note[] = [
  {
    note_id: 1,
    user_id: 1,
    cue: "Project kickoff meeting",
    note_content: "Discussed project timeline and budget. Key points: ...",
    summary: "Timeline set, budget approved, next steps defined",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
  {
    note_id: 2,
    user_id: 2,
    cue: "Brainstorming session",
    note_content:
      "1. User profile customization\n2. In-app notifications\n3. Dark mode",
    summary: "Three main features identified for next sprint",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
];

// Categories table
export interface Category {
  category_id: number;
  user_id: number;
  category_name: string;
}

export const mockCategories: Category[] = [
  {
    category_id: 1,
    user_id: 1,
    category_name: "Work Projects",
  },
  {
    category_id: 2,
    user_id: 2,
    category_name: "Personal Goals",
  },
];

// Tags table
export interface Tag {
  tag_id: number;
  user_id: number;
  tag_name: string;
}

export const mockTags: Tag[] = [
  {
    tag_id: 1,
    user_id: 1,
    tag_name: "Meeting",
  },
  {
    tag_id: 2,
    user_id: 2,
    tag_name: "Ideas",
  },
];

// Note_categories table
export interface NoteCategory {
  note_id: number;
  category_id: number;
}

export const mockNoteCategories: NoteCategory[] = [
  {
    note_id: 1,
    category_id: 1,
  },
  {
    note_id: 2,
    category_id: 2,
  },
];

// Note_tags table
export interface NoteTag {
  note_id: number;
  tag_id: number;
}

export const mockNoteTags: NoteTag[] = [
  {
    note_id: 1,
    tag_id: 1,
  },
  {
    note_id: 2,
    tag_id: 2,
  },
];

// Simulated API functions
export const getNotes = (userId: number): Promise<Note[]> => {
  return Promise.resolve(mockNotes.filter((note) => note.user_id === userId));
};

export const getNote = (noteId: number): Promise<Note | undefined> => {
  return Promise.resolve(mockNotes.find((note) => note.note_id === noteId));
};

export const createNote = (
  note: Omit<Note, "note_id" | "created_at" | "updated_at">
): Promise<Note> => {
  const newNote: Note = {
    ...note,
    note_id: Math.max(...mockNotes.map((n) => n.note_id)) + 1,
    created_at: new Date(),
    updated_at: new Date(),
  };
  mockNotes.push(newNote);
  return Promise.resolve(newNote);
};

export const getNoteWithDetails = (noteId: number) => {
  const note = mockNotes.find((n) => n.note_id === noteId);
  if (!note) return Promise.resolve(null);

  const categories = mockNoteCategories
    .filter((nc) => nc.note_id === noteId)
    .map((nc) => mockCategories.find((c) => c.category_id === nc.category_id));

  const tags = mockNoteTags
    .filter((nt) => nt.note_id === noteId)
    .map((nt) => mockTags.find((t) => t.tag_id === nt.tag_id));

  return Promise.resolve({ ...note, categories, tags });
};
