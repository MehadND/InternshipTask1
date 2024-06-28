import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Subtask, SubtaskSchema } from './subtask.schema';

@Schema()
export class Todo extends Document {
  @Prop({ required: true })
  taskTitle: string;

  @Prop()
  taskDescription?: string;

  @Prop({ default: false })
  isComplete?: boolean;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks: Subtask[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
