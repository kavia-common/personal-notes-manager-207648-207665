"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren
} from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  created: number;
  updated: number;
};

type NotesContextType = {
  notes: Note[];
  selectedId: string | null;
  selectNote: (id: string|null) => void;
  createNote: () => Note;
  updateNote: (id: string, fields: {title?: string; content?: string}) => void;
  deleteNote: (id: string) => void;
  search: string;
  setSearch: (v: string) => void;
};

const NotesContext = createContext<NotesContextType|undefined>(undefined);

const NOTES_LOCAL_KEY = "user_notes_store_v1";

function generateId() {
  return "n_" + Math.random().toString(36).substring(2, 12) + Date.now().toString().slice(-4);
}

// PUBLIC_INTERFACE
export function NotesProvider({children}: PropsWithChildren) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [search, setSearch] = useState("");

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(NOTES_LOCAL_KEY);
      if (stored) {
        try {
          const arr: Note[] = JSON.parse(stored);
          setNotes(Array.isArray(arr) ? arr : []);
        } catch {}
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(NOTES_LOCAL_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  // Picking the most recent note as default
  useEffect(() => {
    if (selectedId == null && notes.length > 0) {
      setSelectedId(notes[0].id);
    }
    if (selectedId != null && notes.find(n => n.id === selectedId) == null) {
      setSelectedId(notes.length > 0 ? notes[0].id : null);
    }
  }, [notes, selectedId]);

  // PUBLIC_INTERFACE
  const selectNote = useCallback((id: string|null) => setSelectedId(id), []);
  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    const now = Date.now();
    const note: Note = {
      id: generateId(),
      title: "Untitled Note",
      content: "",
      created: now,
      updated: now
    };
    setNotes(n => [note, ...n]);
    setSelectedId(note.id);
    return note;
  }, []);
  // PUBLIC_INTERFACE
  const updateNote = useCallback((id: string, fields: {title?: string, content?: string}) => {
    setNotes(ns => ns.map(n => n.id === id ? {...n, ...fields, updated: Date.now()} : n));
  }, []);
  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id: string) => {
    setNotes(ns => ns.filter(n => n.id !== id));
    setSelectedId(prev => prev === id ? null : prev);
  }, []);

  return (
    <NotesContext.Provider value={{
      notes,
      selectedId,
      selectNote,
      createNote,
      updateNote,
      deleteNote,
      search,
      setSearch
    }}>
      {children}
    </NotesContext.Provider>
  );
}

// PUBLIC_INTERFACE: useNotes() - for accessing context
export function useNotes() {
  const v = useContext(NotesContext);
  if (!v) throw new Error("useNotes must be used within a NotesProvider");
  return v;
}
