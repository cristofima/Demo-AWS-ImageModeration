import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ModerationLabel } from 'aws-sdk/clients/rekognition';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
    @Prop({ required: true })
    imagePath: string;

    @Prop({ default: [] })
    moderationLabels: ModerationLabel[];

    @Prop({ default: false })
    imageIsBlurred: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
