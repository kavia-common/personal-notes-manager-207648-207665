"use client";
import React, { useState, useRef, useEffect } from "react";
import { useNotes } from "../notes-context";

/**
 * Inline basic md to HTML (ONLY for demo, not full-featured)
 */
function markdownToHtml(md: string) {
  // Only basic: ## H2, # H1, *italic*, **bold**, - li
  let html = md
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/^\- (.*)$/gm, '<li>$1</li>');
  // Replace consecutive <li>...</li> blocks with a <ul>
  if (/<li>/.test(html)) {
    html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, (m) => "<ul>" + m.replace(/\s*$/, "") + "</ul>");
  }
  html = html.replace(/\n/g, "<br/>");
  return html;
}

// PUBLIC_INTERFACE
export default function NoteEditor() {
  const {
    notes, selectedId, updateNote, deleteNote
  } = useNotes();
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [editMode, setEditMode] = useState(true);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const note = notes.find(n=>n.id===selectedId);

  useEffect(()=>{
    if (!note) return;
    setLocalTitle(note.title);
    setLocalContent(note.content);
    setEditMode(true);
  }, [note]);

  if (!note) {
    return (
      <div className="ocean-editor-empty" aria-live="polite">
        <p>
          <span aria-hidden style={{fontSize:"3rem"}}>📝</span><br/>
          Select or create a note to get started.
        </p>
      </div>
    );
  }

  // Update on blur/save
  function handleSave() {
    if (!note) return;
    updateNote(note.id, {title: localTitle, content: localContent});
    setEditMode(false);
  }
  function handleDelete() {
    if (!note) return;
    if (confirm(`Delete this note? This cannot be undone.`))
      deleteNote(note.id);
  }

  return (
    <section className="ocean-main-panel" aria-labelledby="note-editor-header">
      <div className="ocean-editor-header" id="note-editor-header">
        {editMode
          ? <input
              aria-label="Note title"
              value={localTitle}
              onChange={e=>setLocalTitle(e.target.value)}
              onBlur={handleSave}
              maxLength={120}
              className="font-bold text-lg"
              style={{border:"none",background:"transparent",paddingLeft:0,fontWeight:600,maxWidth:"90%"}}
            />
          : <span className="font-bold text-lg">{localTitle||"Untitled"}</span>
        }
        <button
          type="button"
          title={editMode ? "Preview" : "Edit"}
          aria-label={editMode? "Switch to preview" : "Switch to edit"}
          style={{
            marginLeft: "auto",
            border: "none",
            background: "var(--color-primary, #2563eb)",
            color: "#fff",
            borderRadius: 5,
            padding: "0.2rem 0.7rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: ".98rem",
          }}
          onClick={()=>setEditMode(e=>!e)}
        >{editMode ? "Preview" : "Edit"}</button>
        <button
          type="button"
          title="Delete"
          aria-label="Delete note"
          className="delete"
          style={{marginLeft: 9}}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      <div className="ocean-editor-fields">
        {editMode ? (
          <textarea
            ref={contentRef}
            aria-label="Note content"
            value={localContent}
            onChange={e=>setLocalContent(e.target.value)}
            autoFocus
            spellCheck
            onBlur={handleSave}
            style={{minHeight:'240px',fontSize:'1.01rem'}}
          />
        ) : (
          <div
            style={{border:"1px solid #e6ecfe",borderRadius:8,background:"#fff",padding:"1rem 1.2rem",minHeight:"180px",fontSize:"1.07rem"}}
            tabIndex={0}
            aria-label="Markdown note preview"
            dangerouslySetInnerHTML={{__html: markdownToHtml(localContent)}}
          />
        )}
      </div>
    </section>
  );
}
