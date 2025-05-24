import mongoose from 'mongoose';

export interface IHabit extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  rules: {
    name: string;
    description?: string;
  }[];
  entries: {
    date: Date;
    values: ('✓' | '✗' | '')[];
  }[];
}

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rules: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  entries: [{
    date: {
      type: Date,
      required: true
    },
    values: [{
      type: String,
      enum: ['✓', '✗', ''],
      default: ''
    }]
  }]
}, {
  timestamps: true
});

// Index for faster queries
habitSchema.index({ userId: 1, 'entries.date': 1 });

export const Habit = mongoose.model<IHabit>('Habit', habitSchema); 