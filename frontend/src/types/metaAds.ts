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
