import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface IConversation extends Document {
  userId: mongoose.Schema.Types.ObjectId
  title: string
  messages: IMessage[]
  topic?: string
  savedAt: Date
  updatedAt: Date
  isArchived: boolean
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    topic: String,
    savedAt: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema)
