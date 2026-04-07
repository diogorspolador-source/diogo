import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import HomePage from './pages/Home';
import LaunchFormPage from './pages/LaunchForm';
import CreativePage from './pages/Creative';
import DashboardPage from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/launches/new" element={<LaunchFormPage />} />
              <Route path="/launches/:id/edit" element={<LaunchFormPage />} />
              <Route path="/launches/:id/creative" element={<CreativePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
