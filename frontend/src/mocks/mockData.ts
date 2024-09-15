// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Existing mock data structures
interface User {
  user_id: number;
  user_name: string;
  password: string;
  created_at: Date;
}

interface Note {
  note_id: number;
  user_id: number;
  cue: string;
  note_content: string;
  summary: string | null;
  created_at: Date;
  updated_at: Date;
}

interface Category {
  category_id: number;
  user_id: number;
  category_name: string;
}

interface Tag {
  tag_id: number;
  user_id: number;
  tag_name: string;
}

interface NoteCategory {
  note_id: number;
  category_id: number;
}

interface NoteTag {
  note_id: number;
  tag_id: number;
}

// Mock data
const mockUsers: User[] = [
  {
    user_id: 1,
    user_name: "松原",
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

const mockNotes: Note[] = [
  {
    note_id: 1,
    user_id: 1,
    cue: "サンプル１",
    note_content: "これはサンプル１ですー",
    summary: "サンプルサンプル！",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
  {
    note_id: 2,
    user_id: 1,
    cue: "サンプル２",
    note_content: "これはサンプル２ですー",
    summary: "サンプルサンプル！",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
  {
    note_id: 3,
    user_id: 1,
    cue: "サンプル3",
    note_content: "サンプル",
    summary: "サンプルサンプル",
    created_at: randomDate(new Date(2023, 0, 1), new Date()),
    updated_at: randomDate(new Date(2023, 0, 1), new Date()),
  },
];

const mockCategories: Category[] = [
  {
    category_id: 1,
    user_id: 1,
    category_name: "フロント",
  },
  {
    category_id: 2,
    user_id: 2,
    category_name: "バックエンド",
  },
];

const mockTags: Tag[] = [
  {
    tag_id: 1,
    user_id: 1,
    tag_name: "ミーティング",
  },
  {
    tag_id: 2,
    user_id: 2,
    tag_name: "アイデア",
  },
];

const mockNoteCategories: NoteCategory[] = [
  {
    note_id: 1,
    category_id: 1,
  },
  {
    note_id: 3,
    category_id: 2,
  },
];

const mockNoteTags: NoteTag[] = [
  {
    note_id: 1,
    tag_id: 1,
  },
  {
    note_id: 3,
    tag_id: 2,
  },
];

export interface UserData {
  user: {
    id: number;
    name: string;
    createdAt: Date;
  };
  notes: Array<{
    id: number;
    cue: string;
    content: string;
    summary: string | null;
    createdAt: Date;
    updatedAt: Date;
    categories: Array<{
      id: number;
      name: string;
    }>;
    tags: Array<{
      id: number;
      name: string;
    }>;
  }>;
  categories: Array<{
    id: number;
    name: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
  }>;
}

export const getUserData = (userId: number): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    const user = mockUsers.find((u) => u.user_id === userId);
    if (!user) {
      reject(new Error("User not found"));
      return;
    }

    const notes = mockNotes.filter((note) => note.user_id === userId);
    const categories = mockCategories.filter(
      (category) => category.user_id === userId
    );
    const tags = mockTags.filter((tag) => tag.user_id === userId);

    const notesWithDetails = notes.map((note) => {
      const noteCategories = mockNoteCategories
        .filter((nc) => nc.note_id === note.note_id)
        .map((nc) => categories.find((c) => c.category_id === nc.category_id))
        .filter((c): c is Category => c !== undefined);

      const noteTags = mockNoteTags
        .filter((nt) => nt.note_id === note.note_id)
        .map((nt) => tags.find((t) => t.tag_id === nt.tag_id))
        .filter((t): t is Tag => t !== undefined);

      return {
        id: note.note_id,
        cue: note.cue,
        content: note.note_content,
        summary: note.summary,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        categories: noteCategories.map((c) => ({
          id: c.category_id,
          name: c.category_name,
        })),
        tags: noteTags.map((t) => ({
          id: t.tag_id,
          name: t.tag_name,
        })),
      };
    });

    const userData: UserData = {
      user: {
        id: user.user_id,
        name: user.user_name,
        createdAt: user.created_at,
      },
      notes: notesWithDetails,
      categories: categories.map((c) => ({
        id: c.category_id,
        name: c.category_name,
      })),
      tags: tags.map((t) => ({
        id: t.tag_id,
        name: t.tag_name,
      })),
    };

    setTimeout(() => {
      resolve(userData);
    }, 100);
  });
};

export const getNotes = (userId: number): Promise<UserData["notes"]> => {
  return getUserData(userId).then((userData) => userData.notes);
};

export const getNote = (
  noteId: number
): Promise<UserData["notes"][0] | undefined> => {
  return getUserData(1).then((userData) =>
    userData.notes.find((note) => note.id === noteId)
  );
};

export const createNote = (
  userId: number,
  note: Omit<
    UserData["notes"][0],
    "id" | "createdAt" | "updatedAt" | "categories" | "tags"
  >
): Promise<UserData["notes"][0]> => {
  return new Promise((resolve) => {
    const newNote: UserData["notes"][0] = {
      ...note,
      id: Math.max(...mockNotes.map((n) => n.note_id)) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      tags: [],
    };

    // Add the new note to mockNotes
    mockNotes.push({
      note_id: newNote.id,
      user_id: userId,
      cue: newNote.cue,
      note_content: newNote.content,
      summary: newNote.summary,
      created_at: newNote.createdAt,
      updated_at: newNote.updatedAt,
    });

    setTimeout(() => {
      resolve(newNote);
    }, 100);
  });
};

export const getNoteWithDetails = (
  noteId: number
): Promise<UserData["notes"][0] | null> => {
  return getUserData(1) // Assuming user 1 for this example
    .then(
      (userData) => userData.notes.find((note) => note.id === noteId) || null
    );
};
