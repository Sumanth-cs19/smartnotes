import React, { useEffect, useState } from "react";
import Flashcard from "../components/Flashcard";
import TagInput from "../components/TagInput";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("flashcards") || "[]");
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCard, setEditingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [flippedId, setFlippedId] = useState(null);

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState([]);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setTags([]);
    setPinned(false);
    setEditingCard(null);
    setShowForm(false);
  };

  const startEditing = (id) => {
    const card = flashcards.find((c) => c.id === id);
    if (!card) return;
    setEditingCard(id);
    setQuestion(card.question);
    setAnswer(card.answer);
    setTags(card.tags);
    setPinned(card.pinned);
    setShowForm(true);
  };

  const saveCard = () => {
    if (question.trim() === "") return alert("Question is required");
    if (editingCard) {
      setFlashcards((prev) =>
        prev.map((c) =>
          c.id === editingCard
            ? { ...c, question, answer, tags, pinned }
            : c
        )
      );
    } else {
      setFlashcards((prev) => [
        ...prev,
        { id: generateId(), question, answer, tags, pinned },
      ]);
    }
    resetForm();
  };

  const deleteCard = (id) => {
    if (window.confirm("Delete this flashcard?")) {
      setFlashcards(flashcards.filter((c) => c.id !== id));
    }
  };

  const togglePin = (id) => {
    setFlashcards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      )
    );
  };

  // Sort pinned first, then question
  const sortedCards = [...flashcards].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.question.localeCompare(b.question);
  });

  // Filter by search term (question, answer, tags)
  const filteredCards = sortedCards.filter((card) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      card.question.toLowerCase().includes(lower) ||
      card.answer.toLowerCase().includes(lower) ||
      card.tags.some((tag) => tag.includes(lower))
    );
  });

  // Export / Import handlers
  const exportCards = () => {
    const data = JSON.stringify(flashcards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.download = "flashcards_export.json";
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  const importCards = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (Array.isArray(imported)) {
          setFlashcards(imported);
          alert("Flashcards imported!");
        } else alert("Invalid JSON file");
      } catch {
        alert("Failed to parse JSON");
      }
    };
    reader.readAsText(file);
  };

  // Stats
  const pinnedCount = flashcards.filter((c) => c.pinned).length;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="search"
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow rounded px-4 py-2 border border-purple-400 focus:border-purple-600 focus:outline-none"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
        >
          + Add Flashcard
        </button>
        <button
          onClick={exportCards}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          title="Export flashcards as JSON"
        >
          Export
        </button>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition">
          Import
          <input
            type="file"
            accept=".json"
            onChange={importCards}
            className="hidden"
            title="Import flashcards JSON"
          />
        </label>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            {editingCard ? "Edit Flashcard" : "New Flashcard"}
          </h2>
          <input
            type="text"
            placeholder="Question"
            className="w-full mb-2 px-3 py-2 border border-purple-400 rounded focus:outline-none focus:border-purple-600"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            placeholder="Answer"
            rows={4}
            className="w-full mb-2 px-3 py-2 border border-purple-400 rounded focus:outline-none focus:border-purple-600 resize-y"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
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
              Pin this flashcard
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
              onClick={saveCard}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCards.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No flashcards found.
          </p>
        )}
        {filteredCards.map((card) => (
          <Flashcard
            key={card.id}
            card={card}
            onEdit={startEditing}
            onDelete={deleteCard}
            onTogglePin={togglePin}
            searchTerm={searchTerm}
            flipped={flippedId === card.id}
            onFlip={() =>
              setFlippedId((prev) => (prev === card.id ? null : card.id))
            }
          />
        ))}
      </div>

      <footer className="mt-6 text-center text-gray-600 dark:text-gray-400">
        Total flashcards: {flashcards.length} | Pinned flashcards: {pinnedCount}
      </footer>
    </>
  );
}
