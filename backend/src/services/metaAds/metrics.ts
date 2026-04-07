import { config } from '../../config.js';
import { metaClient } from './client.js';

export interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  objective: string;
}

export interface MetaInsights {
  campaignId: string;
  campaignName: string;
  dateStart: string;
  dateStop: string;
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  conversions: number;
  costPerConversion: number;
  roas: number;
}

export interface MetaMetrics {
  campaign: MetaCampaign;
  insights: MetaInsights;
  daily: MetaInsights[];
}

function mockCampaigns(): MetaCampaign[] {
  return [
    { id: 'mock_1', name: 'Captação - Turma Janeiro', status: 'ACTIVE', objective: 'LEAD_GENERATION' },
    { id: 'mock_2', name: 'Perpétuo - Curso Avançado', status: 'ACTIVE', objective: 'CONVERSIONS' },
    { id: 'mock_3', name: 'Remarketing - Visitantes', status: 'PAUSED', objective: 'CONVERSIONS' },
  ];
}

function mockMetrics(campaignId: string): MetaMetrics {
  const campaign: MetaCampaign = {
    id: campaignId,
    name: 'Captação - Turma Mock',
    status: 'ACTIVE',
    objective: 'LEAD_GENERATION',
  };

  const insights: MetaInsights = {
    campaignId,
    campaignName: campaign.name,
    dateStart: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    dateStop: new Date().toISOString().split('T')[0],
    impressions: 85420,
    reach: 62300,
    clicks: 2134,
    spend: 1250.0,
    ctr: 2.5,
    cpc: 0.59,
    cpm: 14.63,
    frequency: 1.37,
    conversions: 187,
    costPerConversion: 6.68,
    roas: 4.2,
  };

  const daily: MetaInsights[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const randomFactor = 0.7 + Math.random() * 0.6;
    return {
      campaignId,
      campaignName: campaign.name,
      dateStart: dateStr,
      dateStop: dateStr,
      impressions: Math.round(2800 * randomFactor),
      reach: Math.round(2100 * randomFactor),
      clicks: Math.round(71 * randomFactor),
      spend: parseFloat((41.67 * randomFactor).toFixed(2)),
      ctr: parseFloat((2.5 * randomFactor).toFixed(2)),
      cpc: parseFloat((0.59 / randomFactor).toFixed(2)),
      cpm: parseFloat((14.63 / randomFactor).toFixed(2)),
      frequency: parseFloat((1.37 * randomFactor).toFixed(2)),
      conversions: Math.round(6 * randomFactor),
      costPerConversion: parseFloat((6.68 / randomFactor).toFixed(2)),
      roas: parseFloat((4.2 * randomFactor).toFixed(2)),
    };
  });

  return { campaign, insights, daily };
}

function parseInsights(raw: Record<string, string>, campaignId: string, campaignName: string): MetaInsights {
  return {
    campaignId,
    campaignName,
    dateStart: raw.date_start ?? '',
    dateStop: raw.date_stop ?? '',
    impressions: Number(raw.impressions ?? 0),
    reach: Number(raw.reach ?? 0),
    clicks: Number(raw.clicks ?? 0),
    spend: parseFloat(raw.spend ?? '0'),
    ctr: parseFloat(raw.ctr ?? '0'),
    cpc: parseFloat(raw.cpc ?? '0'),
    cpm: parseFloat(raw.cpm ?? '0'),
    frequency: parseFloat(raw.frequency ?? '0'),
    conversions: Number(
      (raw.actions as unknown as Array<{ action_type: string; value: string }>)
        ?.find((a) => a.action_type === 'omni_purchase')
        ?.value ?? 0,
    ),
    costPerConversion: parseFloat(
      (raw.cost_per_action_type as unknown as Array<{ action_type: string; value: string }>)
        ?.find((a) => a.action_type === 'omni_purchase')
        ?.value ?? '0',
    ),
    roas: parseFloat(
      (raw.purchase_roas as unknown as Array<{ action_type: string; value: string }>)
        ?.[0]?.value ?? '0',
    ),
  };
}

export const metaAdsService = {
  async listCampaigns(): Promise<MetaCampaign[]> {
    if (!config.metaAccessToken || !config.metaAdAccountId) {
      return mockCampaigns();
    }
    try {
      const { data } = await metaClient.get(`/${config.metaAdAccountId}/campaigns`, {
        params: { fields: 'id,name,status,objective', limit: 50 },
      });
      return (data.data as MetaCampaign[]) ?? [];
    } catch {
      return mockCampaigns();
    }
  },

  async getCampaignMetrics(campaignId: string): Promise<MetaMetrics> {
    if (!config.metaAccessToken) {
      return mockMetrics(campaignId);
    }
    try {
      const fields = 'impressions,reach,clicks,spend,ctr,cpc,cpm,frequency,actions,cost_per_action_type,purchase_roas';

      const [campaignRes, insightsRes, dailyRes] = await Promise.all([
        metaClient.get(`/${campaignId}`, { params: { fields: 'id,name,status,objective' } }),
        metaClient.get(`/${campaignId}/insights`, {
          params: { fields, date_preset: 'last_30d' },
        }),
        metaClient.get(`/${campaignId}/insights`, {
          params: { fields, date_preset: 'last_7d', time_increment: 1 },
        }),
      ]);

      const campaign = campaignRes.data as MetaCampaign;
      const rawInsights = insightsRes.data.data?.[0] ?? {};
      const rawDaily = (dailyRes.data.data ?? []) as Record<string, string>[];

      const insights = parseInsights(rawInsights, campaign.id, campaign.name);
      const daily = rawDaily.map((d: Record<string, string>) => parseInsights(d, campaign.id, campaign.name));

      return { campaign, insights, daily };
    } catch {
      return mockMetrics(campaignId);
    }
  },
};
