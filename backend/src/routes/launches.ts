import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validateBody.js';
import { launchStorage } from '../services/storage/launches.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const LaunchSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  usp: z.string().min(1, 'Proposta única de valor é obrigatória'),
  price: z.number().positive('Preço deve ser positivo'),
  originalPrice: z.number().positive().optional(),
  captacaoStart: z.string().min(1, 'Data início captação é obrigatória'),
  captacaoEnd: z.string().min(1, 'Data fim captação é obrigatória'),
  liveDate: z.string().min(1, 'Data da aula ao vivo é obrigatória'),
  liveTime: z.string().min(1, 'Horário da aula ao vivo é obrigatório'),
  livePlatform: z.enum(['YouTube', 'Instagram', 'Zoom']),
  instructorName: z.string().min(1, 'Nome do instrutor é obrigatório'),
  instructorBio: z.string().min(1, 'Bio do instrutor é obrigatória'),
  bonuses: z.array(z.string()),
  guarantee: z.string().optional(),
  metaCampaignId: z.string().optional(),
});

const UpdateSchema = LaunchSchema.partial();

// GET /api/launches
router.get('/', async (_req, res, next) => {
  try {
    const launches = await launchStorage.list();
    res.json(launches);
  } catch (err) {
    next(err);
  }
});

// GET /api/launches/:id
router.get('/:id', async (req, res, next) => {
  try {
    const launch = await launchStorage.get(req.params.id);
    if (!launch) throw new AppError(404, 'Lançamento não encontrado');
    res.json(launch);
  } catch (err) {
    next(err);
  }
});

// POST /api/launches
router.post('/', validateBody(LaunchSchema), async (req, res, next) => {
  try {
    const launch = await launchStorage.create(req.body);
    res.status(201).json(launch);
  } catch (err) {
    next(err);
  }
});

// PUT /api/launches/:id
router.put('/:id', validateBody(UpdateSchema), async (req, res, next) => {
  try {
    const launch = await launchStorage.update(req.params.id, req.body);
    if (!launch) throw new AppError(404, 'Lançamento não encontrado');
    res.json(launch);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/launches/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await launchStorage.delete(req.params.id);
    if (!deleted) throw new AppError(404, 'Lançamento não encontrado');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
