import React from "react";
import Highlighter from "react-highlight-words";

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  searchTerm,
}) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex flex-col justify-between
      hover:shadow-lg transition-shadow duration-300 relative"
    >
      <button
        onClick={() => onTogglePin(note.id)}
        title={note.pinned ? "Unpin Note" : "Pin Note"}
        className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400"
      >
        {note.pinned ? "📌" : "📍"}
      </button>

      <h3 className="font-semibold mb-1 text-lg">
        <Highlighter
          searchWords={[searchTerm]}
          autoEscape={true}
          textToHighlight={note.title}
        />
      </h3>

      <div className="prose dark:prose-invert max-w-none mb-2 max-h-40 overflow-auto">
        <Highlighter
          searchWords={[searchTerm]}
          autoEscape={true}
          textToHighlight={note.content}
          highlightTag={({ children }) => (
            <mark className="bg-yellow-300 dark:bg-yellow-600">{children}</mark>
          )}
        />
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="bg-purple-300 dark:bg-purple-700 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(note.id)}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
