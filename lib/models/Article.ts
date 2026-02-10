import mongoose, { Document, Schema } from 'mongoose'

export interface IArticle extends Document {
  title: string
  slug: string
  content: string
  summary: string
  author: mongoose.Schema.Types.ObjectId
  category: string
  tags: string[]
  imageUrl?: string
  views: number
  likes: number
  likedBy: mongoose.Schema.Types.ObjectId[]
  publishedAt: Date
  updatedAt: Date
  difficulty: 'easy' | 'medium' | 'hard'
  readingTime: number
  sources?: string[]
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      index: true,
    },
    imageUrl: String,
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    readingTime: {
      type: Number,
      default: 5,
    },
    sources: [String],
  },
  { timestamps: true }
)

export default mongoose.models.Article ||
  mongoose.model<IArticle>('Article', ArticleSchema)
