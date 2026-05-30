// routes/sortRoutes.js

const express = require('express');
const router  = express.Router();
const {
  saveSortRun,
  getHistory,
  getStats,
  deleteRun,
  clearHistory,
} = require('../controllers/sortController');

router.post('/run',          saveSortRun);   // Save a new result
router.get('/history',       getHistory);    // Get all history
router.get('/stats',         getStats);      // Aggregated stats
router.delete('/history/:id', deleteRun);   // Delete one record
router.delete('/history',    clearHistory); // Clear all records

module.exports = router;
