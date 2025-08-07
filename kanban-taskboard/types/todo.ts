import { ReactNode } from "react";
export interface TaskItem {
  id: string;
  title: string;
  text: string;
  onDelete?: (id: string) => void;
}

export interface BoxesState {
  todo: TaskItem[];
  progress: TaskItem[];
  done: TaskItem[];
}

export interface ColumnProps {
  id: string;
  title: string;
  items: { id: string; title: string; text: string }[];
  onAddItem?: () => void;
  children: ReactNode;
}

export interface TaskModalProps {
  title: string;
  setTitle: (title: string) => void;
  text: string;
  setText: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, text: string) => void;
  editId?: string | null;
  isEditing?: boolean;
}
