import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import launchesRouter from './routes/launches.js';
import generateRouter from './routes/generate.js';
import metaAdsRouter from './routes/metaAds.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/launches', launchesRouter);
app.use('/api/generate', generateRouter);
app.use('/api/meta', metaAdsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`);
  console.log(`Anthropic API: ${config.anthropicApiKey ? 'Configurada' : 'NAO configurada (defina ANTHROPIC_API_KEY)'}`);
  console.log(`Meta Ads: ${config.metaAccessToken ? 'Configurada' : 'NAO configurada (usando dados mock)'}`);
});

export default app;
