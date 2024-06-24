export interface Subtask {
  title: string;
  isComplete?: boolean;
}

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
