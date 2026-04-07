import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../../config.js';

export interface LaunchInput {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  usp: string;
  price: number;
  originalPrice?: number;
  captacaoStart: string;
  captacaoEnd: string;
  liveDate: string;
  liveTime: string;
  livePlatform: 'YouTube' | 'Instagram' | 'Zoom';
  instructorName: string;
  instructorBio: string;
  bonuses: string[];
  guarantee?: string;
  metaCampaignId?: string;
  createdAt: string;
  updatedAt: string;
}

const dataFile = () => path.join(config.dataDir, 'launches.json');

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(config.dataDir, { recursive: true });
}

async function readAll(): Promise<LaunchInput[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(dataFile(), 'utf-8');
    return JSON.parse(raw) as LaunchInput[];
  } catch {
    return [];
  }
}

async function writeAll(launches: LaunchInput[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(dataFile(), JSON.stringify(launches, null, 2), 'utf-8');
}

function generateId(): string {
  return `launch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const launchStorage = {
  async list(): Promise<LaunchInput[]> {
    return readAll();
  },

  async get(id: string): Promise<LaunchInput | undefined> {
    const all = await readAll();
    return all.find((l) => l.id === id);
  },

  async create(data: Omit<LaunchInput, 'id' | 'createdAt' | 'updatedAt'>): Promise<LaunchInput> {
    const all = await readAll();
    const now = new Date().toISOString();
    const launch: LaunchInput = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    all.push(launch);
    await writeAll(all);
    return launch;
  },

  async update(id: string, data: Partial<Omit<LaunchInput, 'id' | 'createdAt'>>): Promise<LaunchInput | undefined> {
    const all = await readAll();
    const idx = all.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    const updated: LaunchInput = {
      ...all[idx],
      ...data,
      id,
      createdAt: all[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    await writeAll(all);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const all = await readAll();
    const filtered = all.filter((l) => l.id !== id);
    if (filtered.length === all.length) return false;
    await writeAll(filtered);
    return true;
  },
};
