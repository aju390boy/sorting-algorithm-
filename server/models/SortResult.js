
const mongoose = require('mongoose');

const sortResultSchema = new mongoose.Schema(
  {
    algorithm: {
      type: String,
      required: true,
      enum: ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'],
    },
    arraySize: {
      type: Number,
      required: true,
    },
    timeTakenMs: {
      type: Number,
      required: true,
    },
    comparisons: {
      type: Number,
      required: true,
    },
    swaps: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('SortResult', sortResultSchema);
