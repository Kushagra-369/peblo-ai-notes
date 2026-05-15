"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [shareLink, setShareLink] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("peblo-notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes.map(note => ({
        ...note,
        updatedAt: new Date(note.updatedAt),
        createdAt: new Date(note.createdAt)
      })));
    } else {
      // Sample initial data
      const initialNotes = [
        {
          id: "1",
          title: "Project Planning",
          content: "Discussed dashboard improvements, API integration and frontend workflow. Need to focus on responsive design and performance optimization.",
          tags: ["work", "meeting", "planning"],
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isArchived: false,
          isPublic: false
        },
        {
          id: "2",
          title: "UI Ideas",
          content: "Modern glassmorphism layout with AI-powered productivity widgets. Consider using Tailwind CSS for styling.",
          tags: ["design", "frontend", "ui"],
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isArchived: false,
          isPublic: false
        },
        {
          id: "3",
          title: "AI Integration",
          content: "Implement LLM for note summarization, action item extraction, and title generation.",
          tags: ["ai", "productivity", "backend"],
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isArchived: false,
          isPublic: false
        }
      ];
      setNotes(initialNotes);
      saveToLocalStorage(initialNotes);
    }
  }, []);

  // Save to localStorage helper
  const saveToLocalStorage = (notesToSave) => {
    localStorage.setItem("peblo-notes", JSON.stringify(notesToSave));
  };

  // Auto-save note content
  const handleNoteEdit = (note, newContent) => {
    const updatedNote = { ...note, content: newContent, updatedAt: new Date() };
    
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    
    const timer = setTimeout(() => {
      const updatedNotes = notes.map(n => n.id === note.id ? updatedNote : n);
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      if (editingNote) setEditingNote(updatedNote);
    }, 1000);
    
    setAutoSaveTimer(timer);
    setEditingNote(updatedNote);
  };

  // Create new note
  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      updatedAt: new Date(),
      createdAt: new Date(),
      isArchived: false,
      isPublic: false
    };
    setNotes([newNote, ...notes]);
    saveToLocalStorage([newNote, ...notes]);
    setEditingNote(newNote);
  };

  // Archive/Unarchive note
  const toggleArchive = (noteId) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  // Delete note
  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
    if (selectedNote?.id === noteId) setSelectedNote(null);
    if (editingNote?.id === noteId) setEditingNote(null);
  };

  // Update note title
  const updateNoteTitle = (noteId, newTitle) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, title: newTitle, updatedAt: new Date() } : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  // Add tag to note
  const addTag = (noteId, tag) => {
    if (!tag.trim()) return;
    const updatedNotes = notes.map(note =>
      note.id === noteId && !note.tags.includes(tag)
        ? { ...note, tags: [...note.tags, tag], updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  // Remove tag from note
  const removeTag = (noteId, tagToRemove) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove), updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  // Generate share link
  const generateShareLink = (note) => {
    const shareId = note.shareId || Math.random().toString(36).substring(7);
    if (!note.shareId) {
      const updatedNotes = notes.map(n =>
        n.id === note.id ? { ...n, shareId, isPublic: true } : n
      );
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
    }
    const link = `${window.location.origin}/shared-note/${shareId}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
    setTimeout(() => setShareLink(null), 3000);
  };

  // AI Generation
  const generateAIInsights = async (note) => {
    setLoadingAI(true);
    setSelectedNote(note);
    
    // Simulate AI API call
    setTimeout(() => {
      const mockAIResponse = {
        summary: `📝 ${note.content.substring(0, 150)}... This note covers key aspects of ${note.title.toLowerCase()}. The main focus areas include implementation strategies and best practices.`,
        action_items: [
          "Review and prioritize tasks mentioned in the note",
          "Schedule follow-up meeting to discuss progress",
          "Create detailed timeline for implementation",
          "Share updates with relevant stakeholders"
        ],
        suggested_title: note.title.includes("AI") ? "AI Strategy & Implementation Plan" : 
                         note.title.includes("Design") ? "Creative Direction & UI/UX Vision" :
                         `${note.title} - Actionable Insights`
      };
      setAiResponse(mockAIResponse);
      setLoadingAI(false);
    }, 1500);
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    const matchesArchive = showArchived ? note.isArchived : !note.isArchived;
    return matchesSearch && matchesTag && matchesArchive;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  // Stats
  const stats = {
    totalNotes: notes.filter(n => !n.isArchived).length,
    archivedNotes: notes.filter(n => n.isArchived).length,
    totalTags: allTags.length,
    recentEdits: notes.filter(n => (new Date().getTime() - n.updatedAt.getTime()) < 7 * 24 * 60 * 60 * 1000).length,
    mostUsedTags: allTags.slice(0, 5),
    weeklyActivity: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: notes.filter(n => n.updatedAt.toDateString() === date.toDateString()).length
      };
    }).reverse()
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#111827] to-[#0f1222] text-white flex">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-[#111827]/80 backdrop-blur-xl border-r border-gray-800 p-6 flex-col fixed h-full overflow-y-auto">
        <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-10">
          Peblo AI
        </h1>

        <button
          onClick={createNewNote}
          className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition text-white py-3 rounded-xl font-semibold mb-8 shadow-lg shadow-cyan-500/25"
        >
          + Create Note
        </button>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeView === "dashboard"
                ? "bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/50"
                : "hover:bg-gray-800/50 text-gray-300"
            }`}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView("insights")}
            className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeView === "insights"
                ? "bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/50"
                : "hover:bg-gray-800/50 text-gray-300"
            }`}
          >
            <span>🤖</span>
            <span>AI Insights</span>
          </button>
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="text-sm text-gray-500 mb-3">Filter by Tag</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag("")}
              className={`px-3 py-1 rounded-full text-sm transition ${
                !selectedTag ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedTag === tag ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${
              showArchived ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-gray-800/50 text-gray-300"
            }`}
          >
            <span>📦</span>
            <span>{showArchived ? "Show Active Notes" : "View Archived"}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex-1 ml-0 md:ml-72 p-6 md:p-10 overflow-y-auto">
        {activeView === "dashboard" ? (
          <>
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Notes Workspace
                </h1>
                <p className="text-gray-400 mt-3 text-lg">
                  {showArchived ? "Archived Notes" : "Active Notes"} • {sortedNotes.length} notes
                </p>
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="🔍 Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#1e293b] border border-gray-700 rounded-xl px-5 py-3 outline-none focus:border-cyan-500 transition w-64"
                />
              </div>
            </div>

            {/* NOTES GRID */}
            {sortedNotes.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold mb-2">No notes found</h3>
                <p className="text-gray-400">Create your first note to get started!</p>
                <button
                  onClick={createNewNote}
                  className="mt-6 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  + Create Note
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs">
                        {note.isPublic ? "🔗 Public" : "🔒 Private"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {editingNote?.id === note.id ? (
                      <input
                        type="text"
                        value={editingNote.title}
                        onChange={(e) => updateNoteTitle(note.id, e.target.value)}
                        className="text-2xl font-bold mb-3 bg-transparent border-b border-gray-700 outline-none focus:border-cyan-500 w-full"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        className="text-2xl font-bold mb-3 cursor-pointer hover:text-cyan-400 transition"
                        onClick={() => setEditingNote(note)}
                      >
                        {note.title}
                      </h3>
                    )}

                    {editingNote?.id === note.id ? (
                      <textarea
                        value={editingNote.content}
                        onChange={(e) => handleNoteEdit(note, e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-gray-300 outline-none focus:border-cyan-500 mb-4 min-h-37.5"
                        placeholder="Start writing your note..."
                      />
                    ) : (
                      <p className="text-gray-400 leading-7 mb-4 line-clamp-3">
                        {note.content || "Click to edit..."}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-800 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(note.id, tag)}
                            className="hover:text-red-400 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="+ Add tag"
                        className="bg-gray-800/50 px-2 py-1 rounded-md text-xs outline-none focus:bg-gray-700 w-20"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(note.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => generateAIInsights(note)}
                        className="bg-linear-to-r from-cyan-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                      >
                        🤖 AI Summary
                      </button>
                      <button
                        onClick={() => toggleArchive(note.id)}
                        className="border border-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition"
                      >
                        {note.isArchived ? "📤 Unarchive" : "📦 Archive"}
                      </button>
                      <button
                        onClick={() => generateShareLink(note)}
                        className="border border-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition"
                      >
                        🔗 Share
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="border border-red-700/50 text-red-400 px-3 py-1.5 rounded-lg text-sm hover:bg-red-900/20 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {shareLink && (
              <div className="fixed bottom-6 right-6 bg-green-500 text-black px-6 py-3 rounded-xl font-semibold shadow-lg animate-bounce">
                🔗 Share link copied!
              </div>
            )}
          </>
        ) : (
          /* AI INSIGHTS DASHBOARD */
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
              AI Productivity Insights
            </h1>
            <p className="text-gray-400 mb-10">Your workspace analytics at a glance</p>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="text-3xl font-bold text-cyan-400">{stats.totalNotes}</h3>
                <p className="text-gray-400 mt-1 text-sm">Total Notes</p>
              </div>

              <div className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-3xl font-bold text-purple-400">{stats.archivedNotes}</h3>
                <p className="text-gray-400 mt-1 text-sm">Archived Notes</p>
              </div>

              <div className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-2">🏷️</div>
                <h3 className="text-3xl font-bold text-blue-400">{stats.totalTags}</h3>
                <p className="text-gray-400 mt-1 text-sm">Unique Tags</p>
              </div>

              <div className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="text-3xl font-bold text-green-400">{stats.recentEdits}</h3>
                <p className="text-gray-400 mt-1 text-sm">Recent Edits</p>
              </div>
            </div>

            {/* Most Used Tags */}
            <div className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">🏷️ Most Used Tags</h2>
              <div className="flex flex-wrap gap-3">
                {stats.mostUsedTags.map(tag => (
                  <span key={tag} className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">📊 Weekly Activity</h2>
              <div className="flex items-end gap-4 h-48">
                {stats.weeklyActivity.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-linear-to-t from-cyan-500 to-purple-500 rounded-lg transition-all duration-500"
                      style={{ height: `${Math.max(day.count * 30, 4)}px` }}
                    />
                    <span className="text-xs text-gray-400">{day.day}</span>
                    <span className="text-sm font-semibold">{day.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Usage Stats */}
            <div className="mt-6 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-2">🤖 AI Usage Statistics</h2>
              <p className="text-gray-300">Total AI generations: {notes.filter(n => n.content.length > 50).length}</p>
              <p className="text-gray-400 text-sm mt-2">AI helps you summarize, extract actions, and suggest titles for better productivity!</p>
            </div>
          </div>
        )}
      </section>

      {/* AI SUMMARY MODAL */}
      {selectedNote && aiResponse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#1e293b] max-w-2xl w-full rounded-2xl border border-gray-700 p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🤖 AI Analysis
              </h2>
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setAiResponse(null);
                }}
                className="text-3xl hover:text-red-400 transition"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0f172a] rounded-xl p-5">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">📋 Summary</h3>
                <p className="text-gray-300 leading-relaxed">{aiResponse.summary}</p>
              </div>

              <div className="bg-[#0f172a] rounded-xl p-5">
                <h3 className="text-xl font-bold text-purple-400 mb-3">✅ Action Items</h3>
                <ul className="space-y-2">
                  {aiResponse.action_items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="text-cyan-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0f172a] rounded-xl p-5">
                <h3 className="text-xl font-bold text-blue-400 mb-3">💡 Suggested Title</h3>
                <p className="text-gray-300 text-lg font-semibold">{aiResponse.suggested_title}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedNote) {
                  updateNoteTitle(selectedNote.id, aiResponse.suggested_title);
                }
                setSelectedNote(null);
                setAiResponse(null);
              }}
              className="w-full mt-6 bg-linear-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Apply Suggested Title
            </button>
          </div>
        </div>
      )}

      {loadingAI && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1e293b] rounded-2xl p-8 text-center">
            <div className="animate-spin text-4xl mb-4">🤖</div>
            <p className="text-gray-300">Generating AI insights...</p>
          </div>
        </div>
      )}
    </main>
  );
}