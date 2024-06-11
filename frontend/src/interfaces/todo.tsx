export interface Todo {
  _id?: string;
  taskTitle: string;
  taskDescription?: string;
  isComplete?: boolean;
  createdAt?: Date;
}
