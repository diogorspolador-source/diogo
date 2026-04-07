import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchStore } from '../../store/launchStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

function getLaunchStatus(launch: { captacaoStart: string; captacaoEnd: string; liveDate: string }) {
  const now = new Date();
  const captacaoStart = new Date(launch.captacaoStart);
  const captacaoEnd = new Date(launch.captacaoEnd);
  const liveDate = new Date(launch.liveDate);

  if (now < captacaoStart) return { label: 'Aguardando', variant: 'default' as const };
  if (now >= captacaoStart && now <= captacaoEnd) return { label: 'Captação', variant: 'success' as const };
  if (now > captacaoEnd && now < liveDate) return { label: 'Pré-live', variant: 'warning' as const };
  return { label: 'Encerrado', variant: 'danger' as const };
}

export default function HomePage() {
  const { launches, fetchLaunches, deleteLaunch, selectLaunch, loading, error } = useLaunchStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const handleEdit = (id: string) => {
    selectLaunch(id);
    navigate(`/launches/${id}/edit`);
  };

  const handleCreative = (id: string) => {
    selectLaunch(id);
    navigate(`/launches/${id}/creative`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o lançamento "${name}"?`)) {
      await deleteLaunch(id);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Meus Lançamentos"
        subtitle="Gerencie todos os seus lançamentos de cursos"
        actions={
          <Button onClick={() => navigate('/launches/new')}>
            + Novo Lançamento
          </Button>
        }
      />

      {error && (
        <div className="alert alert--error">{error}</div>
      )}

      {loading && launches.length === 0 ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Carregando lançamentos...</p>
        </div>
      ) : launches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <h3>Nenhum lançamento ainda</h3>
          <p>Crie seu primeiro lançamento para começar a gerar copies e criativos com IA.</p>
          <Button onClick={() => navigate('/launches/new')}>
            Criar Primeiro Lançamento
          </Button>
        </div>
      ) : (
        <div className="launch-grid">
          {launches.map((launch) => {
            const status = getLaunchStatus(launch);
            return (
              <Card
                key={launch.id}
                className="launch-card"
                actions={
                  <Badge variant={status.variant}>{status.label}</Badge>
                }
              >
                <div className="launch-card-content">
                  <h3 className="launch-card-title">{launch.name}</h3>
                  <p className="launch-card-desc">{launch.description}</p>

                  <div className="launch-card-meta">
                    <div className="launch-meta-item">
                      <span className="launch-meta-label">Instrutor</span>
                      <span className="launch-meta-value">{launch.instructorName}</span>
                    </div>
                    <div className="launch-meta-item">
                      <span className="launch-meta-label">Aula ao vivo</span>
                      <span className="launch-meta-value">
                        {new Date(launch.liveDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {launch.liveTime}
                      </span>
                    </div>
                    <div className="launch-meta-item">
                      <span className="launch-meta-label">Plataforma</span>
                      <span className="launch-meta-value">{launch.livePlatform}</span>
                    </div>
                    <div className="launch-meta-item">
                      <span className="launch-meta-label">Preço</span>
                      <span className="launch-meta-value launch-price">
                        R$ {launch.price.toFixed(2)}
                        {launch.originalPrice && (
                          <span className="launch-original-price">
                            R$ {launch.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="launch-card-footer">
                    <div className="launch-card-actions">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(launch.id)}>
                        Editar
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleCreative(launch.id)}>
                        Criativos & Copy
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(launch.id, launch.name)}>
                        Excluir
                      </Button>
                    </div>
                    <span className="launch-card-date">
                      Criado em {new Date(launch.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
