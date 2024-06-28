import { Subtask } from "./subtask";

export interface Todo {
  _id?: string;
  taskTitle: string;
  taskDescription?: string;
  isComplete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  dueDate?: Date;
  subtasks?: Subtask[];
}
