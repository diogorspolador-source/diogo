import { Router } from 'express';
import { z } from 'zod';
import { launchStorage } from '../services/storage/launches.js';
import { streamClaudeResponse } from '../services/claude/generate.js';
import {
  buildMetaAdsCopyPrompt,
  buildLandingPageCopyPrompt,
  buildSalesPageCopyPrompt,
  buildYoutubeThumbnailPrompt,
} from '../services/claude/prompts.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const LaunchIdSchema = z.object({ launchId: z.string().min(1) });

async function getLaunch(launchId: string) {
  const launch = await launchStorage.get(launchId);
  if (!launch) throw new AppError(404, 'Lançamento não encontrado');
  return launch;
}

// POST /api/generate/meta-ads-copy (SSE)
router.post('/meta-ads-copy', async (req, res, next) => {
  try {
    const { launchId } = LaunchIdSchema.parse(req.body);
    const launch = await getLaunch(launchId);
    const prompt = buildMetaAdsCopyPrompt(launch);
    await streamClaudeResponse(prompt, res);
  } catch (err) {
    next(err);
  }
});

// POST /api/generate/landing-page-copy (SSE)
router.post('/landing-page-copy', async (req, res, next) => {
  try {
    const { launchId } = LaunchIdSchema.parse(req.body);
    const launch = await getLaunch(launchId);
    const prompt = buildLandingPageCopyPrompt(launch);
    await streamClaudeResponse(prompt, res);
  } catch (err) {
    next(err);
  }
});

// POST /api/generate/sales-page-copy (SSE)
router.post('/sales-page-copy', async (req, res, next) => {
  try {
    const { launchId } = LaunchIdSchema.parse(req.body);
    const launch = await getLaunch(launchId);
    const prompt = buildSalesPageCopyPrompt(launch);
    await streamClaudeResponse(prompt, res);
  } catch (err) {
    next(err);
  }
});

// POST /api/generate/youtube-thumbnail (SSE)
router.post('/youtube-thumbnail', async (req, res, next) => {
  try {
    const { launchId } = LaunchIdSchema.parse(req.body);
    const launch = await getLaunch(launchId);
    const prompt = buildYoutubeThumbnailPrompt(launch);
    await streamClaudeResponse(prompt, res);
  } catch (err) {
    next(err);
  }
});

export default router;
