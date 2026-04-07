import { api } from './client';
import type { MetaCampaign, MetaMetrics } from '../types/metaAds';

export const metaAdsApi = {
  listCampaigns: () => api.get<MetaCampaign[]>('/meta/campaigns'),
  getCampaignMetrics: (id: string) => api.get<MetaMetrics>(`/meta/campaigns/${id}/metrics`),
};
