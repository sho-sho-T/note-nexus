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

export interface Note {
  note_id: number;
  user_id: number;
  cue: string;
  note_content: string;
  summary: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  category_id: number;
  user_id: number;
  category_name: string;
}

export interface Tag {
  tag_id: number;
  user_id: number;
  tag_name: string;
}

export interface NoteCategory {
  note_id: number;
  category_id: number;
}

export interface NoteTag {
  note_id: number;
  tag_id: number;
}

export interface UserData {
  user: User;
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  noteCategories: NoteCategory[];
  noteTags: NoteTag[];
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
export const mockNotes: Note[] = [
  {
    note_id: 1,
    user_id: 1,
    cue: "関数の抽出",
    note_content: "関数を..........",
    summary: "抽出.....",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
  {
    note_id: 2,
    user_id: 1,
    cue: "変数のインライン下",
    note_content: "変数を.........",
    summary: "インライン化\n2. hogehoge\n3.",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
  {
    note_id: 2,
    user_id: 2,
    cue: "おほげ",
    note_content: "おほげ。。。",
    summary: "hogehoge",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
];

// Categories table
export const mockCategories: Category[] = [
  {
    category_id: 1,
    user_id: 1,
    category_name: "FE",
  },
  {
    category_id: 2,
    user_id: 2,
    category_name: "BE",
  },
];

// Tags table
export const mockTags: Tag[] = [
  {
    tag_id: 1,
    user_id: 1,
    tag_name: "Rails",
  },
  {
    tag_id: 2,
    user_id: 2,
    tag_name: "React",
  },
];

// Note_categories table
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

export const getUserData = (userId: number): Promise<UserData> => {
  return new Promise((resolve) => {
    // ユーザー情報の取得
    const user = mockUsers.find((u) => u.user_id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notes = mockNotes.filter((note) => note.user_id === userId);
    const categories = mockCategories.filter(
      (category) => category.user_id === userId
    );
    const tags = mockTags.filter((tag) => tag.user_id === userId);
    const noteIds = notes.map((note) => note.note_id);
    const noteCategories = mockNoteCategories.filter((nc) =>
      noteIds.includes(nc.note_id)
    );
    const noteTags = mockNoteTags.filter((nt) => noteIds.includes(nt.note_id));

    const userData: UserData = {
      user,
      notes,
      categories,
      tags,
      noteCategories,
      noteTags,
    };

    // 非同期処理をシミュレートするために少し遅延を入れる
    setTimeout(() => {
      resolve(userData);
    }, 100);
  });
};

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
