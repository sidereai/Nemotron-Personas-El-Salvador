import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { simulateRoute } from './routes/simulate.js';
import { datasetRoute } from './routes/dataset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/simulate', simulateRoute);
app.use('/api/dataset', datasetRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🫀 PulsoSV server running on http://localhost:${PORT}`);
});
