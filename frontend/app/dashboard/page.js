"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const saveToLocalStorage = (notesToSave) => {
    localStorage.setItem("peblo-notes", JSON.stringify(notesToSave));
  };

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
    setSidebarOpen(false);
  };

  const toggleArchive = (noteId) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
    if (selectedNote?.id === noteId) setSelectedNote(null);
    if (editingNote?.id === noteId) setEditingNote(null);
  };

  const updateNoteTitle = (noteId, newTitle) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, title: newTitle, updatedAt: new Date() } : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

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

  const removeTag = (noteId, tagToRemove) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove), updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

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

  const generateAIInsights = async (note) => {
    setLoadingAI(true);
    setSelectedNote(note);
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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    const matchesArchive = showArchived ? note.isArchived : !note.isArchived;
    return matchesSearch && matchesTag && matchesArchive;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Menu Button - Right Side */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-12 h-12 bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700 transition-all duration-300 border border-slate-700"
        >
          {!sidebarOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700
        transform transition-transform duration-300 ease-in-out z-40 w-80 overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Peblo AI
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            onClick={createNewNote}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 text-white py-3 rounded-xl font-semibold mb-8 shadow-lg shadow-cyan-500/25"
          >
            + Create Note
          </button>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveView("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                activeView === "dashboard"
                  ? "bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/50"
                  : "hover:bg-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveView("insights");
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                activeView === "insights"
                  ? "bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/50"
                  : "hover:bg-slate-800 text-gray-300 hover:text-white"
              }`}
            >
              <span className="text-xl">🤖</span>
              <span>AI Insights</span>
            </button>
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-sm text-gray-500 mb-3">Filter by Tag</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  !selectedTag ? "bg-cyan-500 text-white" : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                    selectedTag === tag ? "bg-cyan-500 text-white" : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                setShowArchived(!showArchived);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 hover:bg-slate-800 text-gray-300 hover:text-white"
            >
              <span className="text-xl">📦</span>
              <span>{showArchived ? "Show Active Notes" : "View Archived"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {activeView === "dashboard" ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Notes Workspace
                </h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                  {showArchived ? "Archived Notes" : "Active Notes"} • {sortedNotes.length} notes
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="🔍 Search notes by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                />
              </div>

              {/* Notes Grid */}
              {sortedNotes.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                  <div className="text-5xl md:text-6xl mb-4">📝</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">No notes found</h3>
                  <p className="text-gray-400 text-sm md:text-base">Create your first note to get started!</p>
                  <button
                    onClick={createNewNote}
                    className="mt-6 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg"
                  >
                    + Create Note
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {sortedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3 md:mb-4 flex-wrap gap-2">
                        <span className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs">
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
                          className="text-xl md:text-2xl font-bold mb-3 bg-transparent border-b border-slate-600 outline-none focus:border-cyan-500 w-full text-white"
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className="text-xl md:text-2xl font-bold mb-3 cursor-pointer hover:text-cyan-400 transition-colors text-white wrap-break-words"
                          onClick={() => setEditingNote(note)}
                        >
                          {note.title}
                        </h3>
                      )}

                      {editingNote?.id === note.id ? (
                        <textarea
                          value={editingNote.content}
                          onChange={(e) => handleNoteEdit(note, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-gray-300 outline-none focus:border-cyan-500 mb-4 min-h-30 md:min-h-37.5 text-sm md:text-base"
                          placeholder="Start writing your note..."
                        />
                      ) : (
                        <p className="text-gray-400 leading-6 md:leading-7 mb-4 line-clamp-3 text-sm md:text-base">
                          {note.content || "Click to edit..."}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-xs flex items-center gap-1 text-gray-300"
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(note.id, tag)}
                              className="hover:text-red-400 ml-1 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="+ Add tag"
                          className="bg-slate-700/50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-xs outline-none focus:bg-slate-600 w-16 md:w-20 text-gray-300 transition-all"
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
                          className="bg-linear-to-r from-cyan-500 to-purple-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold hover:opacity-90 transition-all"
                        >
                          🤖 AI Summary
                        </button>
                        <button
                          onClick={() => toggleArchive(note.id)}
                          className="border border-slate-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm hover:bg-slate-700 transition-all text-gray-300"
                        >
                          {note.isArchived ? "📤 Unarchive" : "📦 Archive"}
                        </button>
                        <button
                          onClick={() => generateShareLink(note)}
                          className="border border-slate-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm hover:bg-slate-700 transition-all text-gray-300"
                        >
                          🔗 Share
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="border border-red-700/50 text-red-400 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm hover:bg-red-900/20 transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // AI Insights View
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                AI Productivity Insights
              </h1>
              <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">Your workspace analytics at a glance</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl mb-2">📝</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-400">{stats.totalNotes}</h3>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">Total Notes</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl mb-2">📦</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-purple-400">{stats.archivedNotes}</h3>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">Archived Notes</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl mb-2">🏷️</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-400">{stats.totalTags}</h3>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">Unique Tags</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="text-2xl md:text-3xl mb-2">🔄</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-green-400">{stats.recentEdits}</h3>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">Recent Edits</p>
                </div>
              </div>

              {/* Most Used Tags */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🏷️ Most Used Tags</h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {stats.mostUsedTags.map(tag => (
                    <span key={tag} className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 overflow-x-auto">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">📊 Weekly Activity</h2>
                <div className="flex items-end gap-2 md:gap-4 h-48 md:h-64 min-w-75">
                  {stats.weeklyActivity.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 md:gap-2">
                      <div 
                        className="w-full bg-linear-to-t from-cyan-500 to-purple-500 rounded-lg transition-all duration-500"
                        style={{ height: `${Math.max(day.count * 30, 6)}px` }}
                      />
                      <span className="text-xs text-gray-400">{day.day}</span>
                      <span className="text-xs md:text-sm font-semibold text-white">{day.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Usage Stats */}
              <div className="mt-6 md:mt-8 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-2">🤖 AI Usage Statistics</h2>
                <p className="text-gray-300 text-sm md:text-base">Total AI generations: {notes.filter(n => n.content.length > 50).length}</p>
                <p className="text-gray-400 text-xs md:text-sm mt-2">AI helps you summarize, extract actions, and suggest titles for better productivity!</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Summary Modal */}
      {selectedNote && aiResponse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 max-w-2xl w-full rounded-xl md:rounded-2xl border border-slate-700 p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🤖 AI Analysis
              </h2>
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setAiResponse(null);
                }}
                className="text-2xl md:text-3xl hover:text-red-400 transition text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-slate-900 rounded-xl p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-2 md:mb-3">📋 Summary</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{aiResponse.summary}</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2 md:mb-3">✅ Action Items</h3>
                <ul className="space-y-1 md:space-y-2">
                  {aiResponse.action_items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm md:text-base">
                      <span className="text-cyan-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-2 md:mb-3">💡 Suggested Title</h3>
                <p className="text-gray-300 text-base md:text-lg font-semibold">{aiResponse.suggested_title}</p>
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
              className="w-full mt-4 md:mt-6 bg-linear-to-r from-cyan-500 to-purple-500 text-white py-2.5 md:py-3 rounded-xl font-semibold hover:opacity-90 transition-all text-sm md:text-base"
            >
              Apply Suggested Title
            </button>
          </div>
        </div>
      )}

      {loadingAI && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 text-center mx-4">
            <div className="animate-spin text-3xl md:text-4xl mb-4">🤖</div>
            <p className="text-gray-300 text-sm md:text-base">Generating AI insights...</p>
          </div>
        </div>
      )}

      {shareLink && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 text-black px-3 py-2 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg animate-bounce z-50 text-sm md:text-base">
          🔗 Share link copied!
        </div>
      )}
    </div>
  );
}