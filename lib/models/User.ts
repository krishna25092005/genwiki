import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  avatar?: string
  interests: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  bio?: string
  joinedAt: Date
  lastLogin?: Date
  preferences: {
    darkMode: boolean
    emailNotifications: boolean
    privateProfile: boolean
  }
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: String,
    interests: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    bio: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
    preferences: {
      darkMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      privateProfile: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
)

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema)
