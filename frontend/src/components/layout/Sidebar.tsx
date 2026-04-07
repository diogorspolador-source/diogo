import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLaunchStore } from '../../store/launchStore';
import { Button } from '../ui/Button';

export function Sidebar() {
  const { launches, fetchLaunches, selectedLaunchId, selectLaunch } = useLaunchStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const handleSelectLaunch = (id: string) => {
    selectLaunch(id);
    navigate(`/launches/${id}/creative`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🚀</span>
        </div>
        <div>
          <p className="sidebar-brand-name">Prof. Diogo Spolador</p>
          <p className="sidebar-brand-sub">Gerenciador de Lançamentos</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
        >
          <span className="sidebar-nav-icon">🏠</span>
          Início
        </NavLink>
        <NavLink
          to="/launches/new"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
        >
          <span className="sidebar-nav-icon">➕</span>
          Novo Lançamento
        </NavLink>
      </nav>

      {launches.length > 0 && (
        <div className="sidebar-section">
          <p className="sidebar-section-title">Lançamentos</p>
          <ul className="sidebar-launch-list">
            {launches.map((launch) => (
              <li key={launch.id}>
                <button
                  className={`sidebar-launch-item ${selectedLaunchId === launch.id ? 'sidebar-launch-item--active' : ''}`}
                  onClick={() => handleSelectLaunch(launch.id)}
                >
                  <span className="sidebar-launch-name">{launch.name}</span>
                  <span className="sidebar-launch-date">
                    {new Date(launch.liveDate).toLocaleDateString('pt-BR')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sidebar-footer">
        <Button
          variant="ghost"
          size="sm"
          className="sidebar-footer-btn"
          onClick={() => navigate('/dashboard')}
        >
          <span className="sidebar-nav-icon">📊</span>
          Meta Ads Dashboard
        </Button>
      </div>
    </aside>
  );
}
