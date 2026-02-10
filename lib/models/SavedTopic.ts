import mongoose, { Document, Schema } from 'mongoose'

export interface ISavedTopic extends Document {
  userId: mongoose.Schema.Types.ObjectId
  articleId: mongoose.Schema.Types.ObjectId
  savedAt: Date
  notes?: string
  isBookmarked: boolean
}

const SavedTopicSchema = new Schema<ISavedTopic>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
      index: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
    isBookmarked: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Compound index to prevent duplicate saves
SavedTopicSchema.index({ userId: 1, articleId: 1 }, { unique: true })

export default mongoose.models.SavedTopic ||
  mongoose.model<ISavedTopic>('SavedTopic', SavedTopicSchema)
