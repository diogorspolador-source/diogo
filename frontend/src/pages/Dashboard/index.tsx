import React, { useEffect, useState } from 'react';
import { metaAdsApi } from '../../api/metaAds';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { MetaCampaign, MetaMetrics } from '../../types/metaAds';

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {sub && <p className="metric-sub">{sub}</p>}
    </div>
  );
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetaMetrics | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const data = await metaAdsApi.listCampaigns();
        setCampaigns(data);
        if (data.length > 0) {
          setSelectedCampaign(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar campanhas');
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (!selectedCampaign) return;
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      setMetrics(null);
      try {
        const data = await metaAdsApi.getCampaignMetrics(selectedCampaign);
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar métricas');
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, [selectedCampaign]);

  const statusVariant = (status: string) => {
    if (status === 'ACTIVE') return 'success' as const;
    if (status === 'PAUSED') return 'warning' as const;
    return 'default' as const;
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: 'Ativa',
      PAUSED: 'Pausada',
      DELETED: 'Deletada',
      ARCHIVED: 'Arquivada',
    };
    return map[status] ?? status;
  };

  return (
    <div className="page">
      <PageHeader
        title="Meta Ads Dashboard"
        subtitle="Monitore o desempenho das suas campanhas no Facebook e Instagram"
      />

      {error && <div className="alert alert--error">{error}</div>}

      <div className="dashboard-layout">
        {/* Campaign list */}
        <div className="dashboard-sidebar">
          <Card title="Campanhas">
            {loadingCampaigns ? (
              <div className="loading-state">
                <div className="spinner spinner--sm" />
              </div>
            ) : campaigns.length === 0 ? (
              <p className="empty-text">Nenhuma campanha encontrada</p>
            ) : (
              <ul className="campaign-list">
                {campaigns.map((c) => (
                  <li key={c.id}>
                    <button
                      className={`campaign-item ${selectedCampaign === c.id ? 'campaign-item--active' : ''}`}
                      onClick={() => setSelectedCampaign(c.id)}
                    >
                      <div className="campaign-item-name">{c.name}</div>
                      <div className="campaign-item-meta">
                        <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
                        <span className="campaign-objective">{c.objective}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Metrics panel */}
        <div className="dashboard-main">
          {loadingMetrics ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Carregando métricas...</p>
            </div>
          ) : metrics ? (
            <>
              <div className="dashboard-campaign-header">
                <h2 className="dashboard-campaign-name">{metrics.campaign.name}</h2>
                <Badge variant={statusVariant(metrics.campaign.status)}>
                  {statusLabel(metrics.campaign.status)}
                </Badge>
              </div>

              <div className="dashboard-period">
                Período: {new Date(metrics.insights.dateStart + 'T00:00:00').toLocaleDateString('pt-BR')} até{' '}
                {new Date(metrics.insights.dateStop + 'T00:00:00').toLocaleDateString('pt-BR')}
              </div>

              {/* Main metrics grid */}
              <div className="metrics-grid">
                <MetricCard
                  label="Investimento"
                  value={formatCurrency(metrics.insights.spend)}
                />
                <MetricCard
                  label="Impressões"
                  value={formatNumber(metrics.insights.impressions)}
                  sub={`Alcance: ${formatNumber(metrics.insights.reach)}`}
                />
                <MetricCard
                  label="Cliques"
                  value={formatNumber(metrics.insights.clicks)}
                  sub={`CTR: ${formatPercent(metrics.insights.ctr)}`}
                />
                <MetricCard
                  label="CPC"
                  value={formatCurrency(metrics.insights.cpc)}
                />
                <MetricCard
                  label="CPM"
                  value={formatCurrency(metrics.insights.cpm)}
                />
                <MetricCard
                  label="Frequência"
                  value={metrics.insights.frequency.toFixed(2)}
                />
                <MetricCard
                  label="Conversões"
                  value={formatNumber(metrics.insights.conversions)}
                  sub={`Custo/Conv: ${formatCurrency(metrics.insights.costPerConversion)}`}
                />
                <MetricCard
                  label="ROAS"
                  value={`${metrics.insights.roas.toFixed(2)}×`}
                />
              </div>

              {/* Daily table */}
              {metrics.daily.length > 0 && (
                <Card title="Desempenho Diário (Últimos 7 dias)" className="daily-table-card">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Investimento</th>
                          <th>Impressões</th>
                          <th>Cliques</th>
                          <th>CTR</th>
                          <th>CPC</th>
                          <th>Conversões</th>
                          <th>ROAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.daily.map((d, i) => (
                          <tr key={i}>
                            <td>{new Date(d.dateStart + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                            <td>{formatCurrency(d.spend)}</td>
                            <td>{formatNumber(d.impressions)}</td>
                            <td>{formatNumber(d.clicks)}</td>
                            <td>{formatPercent(d.ctr)}</td>
                            <td>{formatCurrency(d.cpc)}</td>
                            <td>{formatNumber(d.conversions)}</td>
                            <td>{d.roas.toFixed(2)}×</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>Selecione uma campanha</h3>
              <p>Escolha uma campanha na lista para ver suas métricas detalhadas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
