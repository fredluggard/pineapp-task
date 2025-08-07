"use client";

import { ColumnProps } from "@/types/todo";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import React from "react";

export default function Column({
  id,
  title,
  children,
  onAddItem,
  items,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="relative min-h-[80vh] flex flex-col flex-1 items-center bg-background p-4 rounded-2xl shadow border border-[#dedede]"
    >
      <div className="w-xs">
        <h2 className="text-xl md:text-3xl font-bold capitalize my-4">
          {title}
        </h2>
      </div>
      <SortableContext items={items.map((item) => item.id)}>
        {React.Children.count(children) > 0 ? (
          <div className="flex flex-col items-center justify-center">
            {children}
          </div>
        ) : (
          <div className="min-h-[150px] flex items-center justify-center p-4">
            <span className="text-gray-400">Drag to add items here</span>
          </div>
        )}
        {id === "todo" ? (
          <div className="w-xs flex flex-col justify-center bg-background p-4 rounded-2xl shadow min-h-[70px] border border-[#dedede]">
            <button
              className="flex gap-2 items-center justify-center"
              onClick={onAddItem}
            >
              <h1 className="font-bold text-2xl">+</h1>
              <h1 className="font-bold text-lg">Add Card</h1>
            </button>
          </div>
        ) : null}
      </SortableContext>
    </div>
  );
}
