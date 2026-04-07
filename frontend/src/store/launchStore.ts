import { create } from 'zustand';
import type { LaunchInput, LaunchFormData, GeneratedAssets } from '../types/launch';
import { launchesApi } from '../api/launches';

interface LaunchStore {
  launches: LaunchInput[];
  selectedLaunchId: string | null;
  generatedAssets: Record<string, GeneratedAssets>;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLaunches: () => Promise<void>;
  createLaunch: (data: LaunchFormData) => Promise<LaunchInput>;
  updateLaunch: (id: string, data: Partial<LaunchFormData>) => Promise<void>;
  deleteLaunch: (id: string) => Promise<void>;
  selectLaunch: (id: string | null) => void;
  setGeneratedAssets: (launchId: string, assets: Partial<GeneratedAssets>) => void;
  clearError: () => void;
}

export const useLaunchStore = create<LaunchStore>((set, get) => ({
  launches: [],
  selectedLaunchId: null,
  generatedAssets: {},
  loading: false,
  error: null,

  fetchLaunches: async () => {
    set({ loading: true, error: null });
    try {
      const launches = await launchesApi.list();
      set({ launches, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao carregar lançamentos', loading: false });
    }
  },

  createLaunch: async (data: LaunchFormData) => {
    set({ loading: true, error: null });
    try {
      const launch = await launchesApi.create(data);
      set((state) => ({ launches: [...state.launches, launch], loading: false }));
      return launch;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao criar lançamento', loading: false });
      throw err;
    }
  },

  updateLaunch: async (id: string, data: Partial<LaunchFormData>) => {
    set({ loading: true, error: null });
    try {
      const updated = await launchesApi.update(id, data);
      set((state) => ({
        launches: state.launches.map((l) => (l.id === id ? updated : l)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao atualizar lançamento', loading: false });
      throw err;
    }
  },

  deleteLaunch: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await launchesApi.delete(id);
      set((state) => ({
        launches: state.launches.filter((l) => l.id !== id),
        selectedLaunchId: state.selectedLaunchId === id ? null : state.selectedLaunchId,
        loading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao deletar lançamento', loading: false });
      throw err;
    }
  },

  selectLaunch: (id: string | null) => {
    set({ selectedLaunchId: id });
  },

  setGeneratedAssets: (launchId: string, assets: Partial<GeneratedAssets>) => {
    set((state) => ({
      generatedAssets: {
        ...state.generatedAssets,
        [launchId]: {
          ...(state.generatedAssets[launchId] ?? { launchId }),
          ...assets,
        },
      },
    }));
  },

  clearError: () => set({ error: null }),
}));

// Selector helpers
export const selectedLaunch = (state: LaunchStore) =>
  state.launches.find((l) => l.id === state.selectedLaunchId) ?? null;
