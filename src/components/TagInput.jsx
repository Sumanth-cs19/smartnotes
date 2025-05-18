import React, { useState } from "react";

export default function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-purple-300 dark:bg-purple-700 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 font-bold hover:text-purple-900 dark:hover:text-purple-300"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder="Add tag and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm w-40 focus:outline-none"
      />
    </div>
  );
}
