import express from 'express';
import { getStats, sampleProfiles } from '../services/sampler.js';

export const datasetRoute = express.Router();

datasetRoute.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dataset stats' });
  }
});

datasetRoute.get('/sample', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const profiles = sampleProfiles(count);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sample profiles' });
  }
});
