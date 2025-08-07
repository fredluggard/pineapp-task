"use client";

import { TaskItem } from "@/types/todo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

const Card = ({
  id,
  title,
  text,
  onDelete,
  onEdit,
}: TaskItem & {
  onEdit?: (id: string, title: string, text: string) => void;
}) => {
  const { active, attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: active ? "grabbing" : "grab",
  };

  return (
    <div
      style={style}
      className="w-xs flex flex-col justify-center bg-background p-4 my-4 rounded-2xl shadow min-h-[120px] border border-[#dedede]"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <section style={{ touchAction: "none" }}>
        <h1 className="w-full font-bold text-xl md:text-2xl mb-2">{title}</h1>
        <p className="w-full whitespace-pre-line font-normal text-base md:text-lg">
          {text}
        </p>
        <div className="w-full flex gap-3 justify-end">
          <button
            onClick={() => onEdit?.(id, title, text)}
            className="text-gray-500 mt-6 hover:text-blue-500 text-sm font-bold"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete?.(id)}
            className="text-gray-500 mt-6 hover:text-red-500 text-sm font-bold"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
};

export default Card;
