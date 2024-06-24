import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Subtask, SubtaskSchema } from './subtask.schema';

@Schema()
export class Todo extends Document {
  @Prop({ required: true })
  taskTitle: string;

  @Prop({ maxlength: 255, default: '' })
  taskDescription?: string;

  @Prop({ default: false })
  isComplete?: boolean;

  @Prop({ default: Date.now() })
  createdAt?: Date;

  @Prop({ default: Date.now() })
  updatedAt?: Date;

  @Prop({ default: null })
  dueDate?: Date;

  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks?: Subtask[];
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.methods.toJSON = function () {
  const todoObject = this.toObject();
  if (todoObject.createdAt) {
    todoObject.createdAt = todoObject.createdAt.toISOString().split('T')[0];
  }
  if (todoObject.dueDate) {
    todoObject.dueDate = todoObject.dueDate.toISOString().split('T')[0];
  }
  return todoObject;
};
