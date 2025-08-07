"use client";

import { useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Card from "@/components/card";
import Column from "@/components/column";
import { BoxesState, TaskItem } from "@/types/todo";
import TaskModal from "@/components/modal";
import ThemeToggle from "@/components/themeToggle";
import { arrayMove } from "@dnd-kit/sortable";

const defaultColumns: BoxesState = {
  todo: [
    { id: "1", title: "Task 1", text: "This is your first task" },
    { id: "2", title: "Task 2", text: "Summary of task 2" },
    { id: "3", title: "Task 3", text: "Task 3" },
  ],
  progress: [
    { id: "4", title: "Task 4", text: "This is the fourth task" },
    { id: "5", title: "Task 5", text: "Task 5" },
  ],
  done: [
    { id: "6", title: "Task 6", text: "This is the sixth task" },
    { id: "7", title: "Task 7", text: "Details of the seventh task" },
  ],
};

export default function Home() {
  const [columns, setColumns] = useState<BoxesState>(() => {
    const saved = localStorage.getItem("columns");
    return saved ? JSON.parse(saved) : defaultColumns;
  });
  const [activeItem, setActiveItem] = useState<null | TaskItem>(null);
  const [currentColumnId, setCurrentColumnId] = useState<
    keyof BoxesState | null
  >(null);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor)
  );

  const findContainer = (id: string | number) => {
    if (columns[id as keyof typeof columns]) return id;
    return Object.keys(columns).find((key) =>
      columns[key as keyof typeof columns].some((item) => item.id === id)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromColumn = findContainer(active.id);
    const toColumn = findContainer(over.id);

    if (!fromColumn || !toColumn) return;

    // Same column = reorder
    if (fromColumn === toColumn) {
      const items = [...columns[fromColumn as keyof BoxesState]];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(items, oldIndex, newIndex);
        setColumns({
          ...columns,
          [fromColumn]: reordered,
        });
      }

      return;
    }

    // Moving to a different column
    const fromItems = [...columns[fromColumn as keyof BoxesState]];
    const toItems = [...columns[toColumn as keyof BoxesState]];

    const movingItemIndex = fromItems.findIndex(
      (item) => item.id === active.id
    );
    const [movedItem] = fromItems.splice(movingItemIndex, 1);

    const overIndex = toItems.findIndex((item) => item.id === over.id);
    if (overIndex >= 0) {
      toItems.splice(overIndex, 0, movedItem);
    } else {
      toItems.push(movedItem);
    }

    setColumns({
      ...columns,
      [fromColumn]: fromItems,
      [toColumn]: toItems,
    });
  };

  const handleAddOrEditTodo = (newTitle: string, newText: string) => {
    if (isEditing && editId) {
      const updatedColumns = { ...columns };
      for (const key in updatedColumns) {
        updatedColumns[key as keyof BoxesState] = updatedColumns[
          key as keyof BoxesState
        ].map((task) =>
          task.id === editId
            ? { ...task, title: newTitle, text: newText }
            : task
        );
      }

      setColumns(updatedColumns);
      setEditId(null);
      setIsEditing(false);
    } else if (currentColumnId) {
      const newItem: TaskItem = {
        id: Date.now().toString(),
        title: newTitle,
        text: newText,
      };

      setColumns((prev) => ({
        ...prev,
        [currentColumnId]: [newItem, ...prev[currentColumnId]],
      }));
    }

    setModalOpen(false);
    setTitle("");
    setText("");
    setCurrentColumnId(null);
  };

  const deleteTodo = (taskId: string) => {
    setColumns((prevColumns) => {
      const updatedColumns: BoxesState = { ...prevColumns };

      for (const [columnId, tasks] of Object.entries(prevColumns)) {
        updatedColumns[columnId as keyof BoxesState] = tasks.filter(
          (task: TaskItem) => task.id !== taskId
        );
      }

      localStorage.setItem("columns", JSON.stringify(updatedColumns));
      return updatedColumns;
    });
  };

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  return (
    <div className="min-h-screen w-full flex flex-col gap-5 items-center justify-center bg-lightBg p-3 md:p-12">
      <div className="w-full flex md:gap-60 justify-between">
        <h2 className="text-xl md:text-3xl font-bold capitalize my-4">
          Fred&apos;s Taskboard
        </h2>
        <ThemeToggle />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => {
          const { active } = event;
          const containerId = findContainer(active.id);
          const task = columns[containerId as keyof BoxesState]?.find(
            (item: TaskItem) => item.id === active.id
          );
          if (task) setActiveItem(task);
        }}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setActiveItem(null);
        }}
        onDragCancel={() => setActiveItem(null)}
      >
        <div className="relative flex flex-col md:flex-row gap-4 w-full">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <Column
              key={columnId}
              id={columnId}
              title={
                columnId === "todo"
                  ? "To Do"
                  : columnId === "progress"
                  ? "In Progress"
                  : "Done"
              }
              items={tasks}
              onAddItem={() => {
                setCurrentColumnId(columnId as keyof BoxesState);
                setModalOpen(true);
              }}
            >
              {tasks.map((task: TaskItem) => (
                <Card
                  key={task.id}
                  {...task}
                  onDelete={deleteTodo}
                  onEdit={(id, title, text) => {
                    setEditId(id);
                    setTitle(title);
                    setText(text);
                    setIsEditing(true);
                    setModalOpen(true);
                  }}
                />
              ))}
            </Column>
          ))}

          <DragOverlay>
            {activeItem ? (
              <Card
                id={activeItem.id}
                title={activeItem.title}
                text={activeItem.text}
              />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
      <TaskModal
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditId(null);
          setIsEditing(false);
        }}
        onAdd={handleAddOrEditTodo}
        editId={editId}
        isEditing={isEditing}
      />
    </div>
  );
}
