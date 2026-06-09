import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { simulateRoute } from './routes/simulate.js';
import { datasetRoute } from './routes/dataset.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/simulate', simulateRoute);
app.use('/api/dataset', datasetRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🫀 PulsoSV server running on http://localhost:${PORT}`);
});
