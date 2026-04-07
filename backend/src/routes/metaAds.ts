import { Router } from 'express';
import { metaAdsService } from '../services/metaAds/metrics.js';

const router = Router();

// GET /api/meta/campaigns
router.get('/campaigns', async (_req, res, next) => {
  try {
    const campaigns = await metaAdsService.listCampaigns();
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
});

// GET /api/meta/campaigns/:id/metrics
router.get('/campaigns/:id/metrics', async (req, res, next) => {
  try {
    const metrics = await metaAdsService.getCampaignMetrics(req.params.id);
    res.json(metrics);
  } catch (err) {
    next(err);
  }
});

export default router;
