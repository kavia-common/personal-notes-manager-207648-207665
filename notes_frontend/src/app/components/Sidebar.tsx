"use client";
import React, { useRef } from "react";
import { useNotes } from "../notes-context";

export default function Sidebar() {
  const {
    notes, selectedId, selectNote, createNote, search, setSearch
  } = useNotes();
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = notes.filter(n=>!search.trim() || n.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <aside className="ocean-sidebar" role="navigation" aria-label="Notelist Sidebar">
      <div className="ocean-sidebar-top">
        <form
          className="ocean-sidebar-search"
          role="search"
          onSubmit={e => {e.preventDefault();inputRef.current?.blur();}}
        >
          <input
            ref={inputRef}
            aria-label="Search notes"
            placeholder="Search…"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            autoComplete="off"
          />
        </form>
        <button
          type="button"
          className="ocean-sidebar-create-btn"
          aria-label="Create new note"
          onClick={createNote}
        >+ New</button>
      </div>
      <nav className="ocean-sidebar-list" aria-label="Notes List">
        <ul>
          {!filtered.length && <li><span style={{color:"#8d99a9"}}>No notes found</span></li>}
          {filtered.map(note =>
            <li key={note.id}>
              <button
                className={`ocean-sidebar-list--item${selectedId===note.id?' selected':''}`}
                onClick={()=>selectNote(note.id)}
                aria-current={selectedId === note.id ? "page" : undefined}
                tabIndex={0}
              >
                <span className="note-title" aria-label={`Note: ${note.title}`}>{note.title || "Untitled"}</span>
                <span style={{
                  fontSize: ".79em",
                  opacity: .8,
                  marginLeft: 7
                }}>{new Date(note.updated).toLocaleDateString()}</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
