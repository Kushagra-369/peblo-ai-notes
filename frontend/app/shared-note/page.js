"use client";

import { useState, useEffect } from "react";

export default function SharedNotePage({ params }) {
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("peblo-notes");
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      const foundNote = notes.find((n) => n.shareId === params.shareId && n.isPublic);
      if (foundNote) {
        setNote(foundNote);
      } else {
        setError("Note not found or is private");
      }
    } else {
      setError("No shared notes available");
    }
  }, [params.shareId]);

  if (error) {
    return (
      <main className="min-h-screen bg-linear-to-br from-[#0f172a] to-[#111827] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="min-h-screen bg-linear-to-br from-[#0f172a] to-[#111827] flex items-center justify-center">
        <div className="animate-spin text-4xl">🤖</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#111827] to-[#0f1222] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
              🔗 Public Note
            </span>
            <span className="text-gray-500 text-xs">
              Last updated: {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6">{note.title}</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-800">
              {note.tags.map(tag => (
                <span key={tag} className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 text-center text-gray-500 text-sm">
            Shared from Peblo AI Workspace
          </div>
        </div>
      </div>
    </main>
  );
}