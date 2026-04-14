import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import SolicitanteDashboard from '@/src/components/dashboards/SolicitanteDashboard';
import CompradorDashboard from '@/src/components/dashboards/CompradorDashboard';
import FinanceiroDashboard from '@/src/components/dashboards/FinanceiroDashboard';
import AuditoriaDashboard from '@/src/components/dashboards/AuditoriaDashboard';
import DefaultDashboard from '@/src/components/dashboards/DefaultDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Solicitante':
        return <SolicitanteDashboard />;
      case 'Compras':
        return <CompradorDashboard />;
      case 'Financeiro':
        return <FinanceiroDashboard />;
      case 'Auditoria':
        return <AuditoriaDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Olá, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Painel de Controle • Perfil: <span className="font-semibold text-blue-600">{user?.role}</span>
          </p>
        </div>
      </div>

      {renderDashboard()}
    </div>
  );
}
