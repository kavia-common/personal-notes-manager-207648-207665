"use client";

import React from "react";
import { NotesProvider } from "./notes-context";
import { Header } from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import "./ocean-global.css";

export default function NotesHome() {
  return (
    <NotesProvider>
      <div id="notes-root">
        <Header />
        <div className="ocean-main-layout">
          <Sidebar />
          <NoteEditor />
        </div>
      </div>
    </NotesProvider>
  );
}
