import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
