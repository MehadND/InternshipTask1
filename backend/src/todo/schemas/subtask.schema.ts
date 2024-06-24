import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subtask extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  isComplete?: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
