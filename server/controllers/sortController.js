// controllers/sortController.js

const SortResult = require('../models/SortResult');

// @desc    Save a completed sort run
// @route   POST /api/sort/run
const saveSortRun = async (req, res) => {
  try {
    const { algorithm, arraySize, timeTakenMs, comparisons, swaps } = req.body;
    const result = await SortResult.create({ algorithm, arraySize, timeTakenMs, comparisons, swaps });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all past sort runs (history)
// @route   GET /api/sort/history
const getHistory = async (req, res) => {
  try {
    const results = await SortResult.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated stats per algorithm
// @route   GET /api/sort/stats
const getStats = async (req, res) => {
  try {
    const stats = await SortResult.aggregate([
      {
        $group: {
          _id: '$algorithm',
          avgTime:         { $avg: '$timeTakenMs' },
          avgComparisons:  { $avg: '$comparisons' },
          avgSwaps:        { $avg: '$swaps' },
          minTime:         { $min: '$timeTakenMs' },
          maxTime:         { $max: '$timeTakenMs' },
          totalRuns:       { $sum: 1 },
        },
      },
      { $sort: { avgTime: 1 } },
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a single sort result by ID
// @route   DELETE /api/sort/history/:id
const deleteRun = async (req, res) => {
  try {
    const deleted = await SortResult.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete ALL sort history
// @route   DELETE /api/sort/history
const clearHistory = async (req, res) => {
  try {
    const result = await SortResult.deleteMany({});
    res.status(200).json({ success: true, message: `Cleared ${result.deletedCount} records` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveSortRun, getHistory, getStats, deleteRun, clearHistory };
