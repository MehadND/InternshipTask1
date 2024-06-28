import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Subtask {
  @Prop({ type: Types.ObjectId, auto: true, default: new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  isComplete?: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
