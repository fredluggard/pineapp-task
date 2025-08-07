import { TaskModalProps } from "@/types/todo";
import React from "react";

export default function TaskModal({
  title,
  setTitle,
  text,
  setText,
  isOpen,
  onClose,
  onAdd,
  isEditing,
}: TaskModalProps) {
  const handleSubmit = () => {
    if (title.trim() && text.trim()) {
      onAdd(title, text);
      setTitle("");
      setText("");
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setTitle("");
    setText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-lightBg/70 backdrop-blur-xs z-50 ">
      <div className="bg-background p-6 rounded-2xl shadow-lg w-[90%] max-w-md space-y-4 border border-darkBg">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit Task" : "Add New To Do"}
        </h2>
        <input
          className="w-full border border-darkBg p-2 rounded outline-darkBg focus:outline-darkBg"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          ref={(el) => {
            if (el) {
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }
          }}
          className="w-full max-h-40 overflow-y-auto border border-darkBg p-2 rounded outline-darkBg focus:outline-darkBg"
          placeholder="Description"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const textarea = e.target;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
        />

        <div className="flex justify-end gap-2">
          <button
            className="bg-red-400 text-white px-4 py-2 rounded-xl"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            onClick={handleSubmit}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
