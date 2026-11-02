const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    studentName: {
      type: String,
      required: [true, 'studentName is required'],
      trim: true,
    },
    courseName: {
      type: String,
      required: [true, 'courseName is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'message is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: [1, 'rating must be at least 1'],
      max: [5, 'rating must be at most 5'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Reviewed'],
        message: 'status must be either Pending or Reviewed',
      },
      default: 'Pending',
    },
  },
  { timestamps: true, id: false }
);

feedbackSchema.index({ id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
