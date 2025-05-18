import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import TagInput from "../components/TagInput";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function NotesPage() {
  // Load from localStorage or start empty
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notes") || "[]");
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setPinned(false);
    setEditingNote(null);
    setShowForm(false);
  };

  const startEditing = (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setEditingNote(id);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
    setPinned(note.pinned);
    setShowForm(true);
  };

  const saveNote = () => {
    if (title.trim() === "") return alert("Title is required");
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote
            ? { ...n, title, content, tags, pinned }
            : n
        )
      );
    } else {
      setNotes((prev) => [
        ...prev,
        { id: generateId(), title, content, tags, pinned },
      ]);
    }
    resetForm();
  };

  const deleteNote = (id) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
  };

  // Sort pinned first, then by title
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.title.localeCompare(b.title);
  });

  // Filter by search term (title or content or tags)
  const filteredNotes = sortedNotes.filter((note) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(lower) ||
      note.content.toLowerCase().includes(lower) ||
      note.tags.some((tag) => tag.includes(lower))
    );
  });

  // Export / Import handlers
  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.download = "notes_export.json";
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  const importNotes = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (Array.isArray(imported)) {
          setNotes(imported);
          alert("Notes imported!");
        } else alert("Invalid JSON file");
      } catch {
        alert("Failed to parse JSON");
      }
    };
    reader.readAsText(file);
  };

  // Simple stats
  const pinnedCount = notes.filter((n) => n.pinned).length;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="search"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow rounded px-4 py-2 border border-purple-400 focus:border-purple-600 focus:outline-none"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
        >
          + Add Note
        </button>
        <button
          onClick={exportNotes}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          title="Export notes as JSON"
        >
          Export
        </button>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition">
          Import
          <input
            type="file"
            accept=".json"
            onChange={importNotes}
            className="hidden"
            title="Import notes JSON"
          />
        </label>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            {editingNote ? "Edit Note" : "New Note"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-2 px-3 py-2 border border-purple-400 rounded focus:outline-none focus:border-purple-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content (Markdown supported)"
            rows={5}
            className="w-full mb-2 px-3 py-2 border border-purple-400 rounded focus:outline-none focus:border-purple-600 resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <TagInput tags={tags} setTags={setTags} />
          <div className="mt-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={pinned}
                onChange={() => setPinned(!pinned)}
                className="form-checkbox rounded text-purple-600"
              />
              Pin this note
            </label>
          </div>
          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveNote}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredNotes.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No notes found.
          </p>
        )}
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={startEditing}
            onDelete={deleteNote}
            onTogglePin={togglePin}
            searchTerm={searchTerm}
          />
        ))}
      </div>

      <footer className="mt-6 text-center text-gray-600 dark:text-gray-400">
        Total notes: {notes.length} | Pinned notes: {pinnedCount}
      </footer>
    </>
  );
}
