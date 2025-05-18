import React from "react";
import Highlighter from "react-highlight-words";

export default function Flashcard({
  card,
  onEdit,
  onDelete,
  onTogglePin,
  searchTerm,
  flipped,
  onFlip,
}) {
  return (
    <div
      className={`flashcard relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer select-none
      w-full sm:w-80 h-48 mx-auto flex flex-col justify-center transition-transform duration-500`}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onFlip()}
      aria-pressed={flipped}
    >
      <div
        className={`flashcard-inner ${flipped ? "transform rotate-y-180" : ""} relative w-full h-full`}
      >
        <div className="flashcard-front absolute w-full h-full backface-hidden">
          <h3 className="text-lg font-semibold mb-3">
            <Highlighter
              searchWords={[searchTerm]}
              autoEscape={true}
              textToHighlight={card.question}
              highlightTag={({ children }) => (
                <mark className="bg-yellow-300 dark:bg-yellow-600">{children}</mark>
              )}
            />
          </h3>
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-300 dark:bg-purple-700 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flashcard-back absolute w-full h-full backface-hidden rotate-y-180">
          <p className="whitespace-pre-wrap">
            <Highlighter
              searchWords={[searchTerm]}
              autoEscape={true}
              textToHighlight={card.answer}
              highlightTag={({ children }) => (
                <mark className="bg-yellow-300 dark:bg-yellow-600">{children}</mark>
              )}
            />
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(card.id);
        }}
        title={card.pinned ? "Unpin Flashcard" : "Pin Flashcard"}
        className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400 z-10"
      >
        {card.pinned ? "📌" : "📍"}
      </button>
      <div className="flex justify-end gap-2 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card.id);
          }}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
