import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const stats = [
  { name: 'Solicitações Pendentes', value: '24', icon: FileText, color: 'bg-blue-500', path: '/solicitacoes' },
  { name: 'Aguardando Aprovação', value: '08', icon: CheckSquare, color: 'bg-amber-500', path: '/aprovacoes' },
  { name: 'Ordens de Compra', value: '15', icon: TrendingUp, color: 'bg-emerald-500', path: '/compras/pedidos' },
  { name: 'Recebimentos Pendentes', value: '06', icon: Clock, color: 'bg-purple-500', path: '/recebimento' },
];

const pendingItems = [
  { id: 'SOL-2026-001', title: 'Material de Escritório - Unidade Leste', requester: 'Ana Silva', date: '01/04/2026', status: 'Pendente', priority: 'Média', value: 'A definir' },
  { id: 'SOL-2026-002', title: 'Manutenção Ar Condicionado', requester: 'Carlos Santos', date: '31/03/2026', status: 'Aprovado', priority: 'Alta', value: 'R$ 4.800,00' },
  { id: 'SOL-2026-003', title: 'Insumos para Cozinha Industrial', requester: 'Maria Oliveira', date: '30/03/2026', status: 'Em Cotação', priority: 'Alta', value: 'R$ 12.400,00' },
  { id: 'SOL-2026-004', title: 'Equipamentos de Informática', requester: 'João Pereira', date: '29/03/2026', status: 'Pendente', priority: 'Baixa', value: 'A definir' },
];

export default function DefaultDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Visão Geral</h2>
          <p className="text-sm text-gray-500">Acompanhamento geral dos processos de compras.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Exportar Relatório
          </button>
          <button 
            onClick={() => navigate('/solicitacoes/nova')}
            className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
          >
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              if (stat.path) navigate(stat.path);
            }}
            className={cn(
              "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
              stat.path && "cursor-pointer"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl text-white", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Solicitações Recentes</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ver todas</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ID / Título</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitante</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{item.id}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{item.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{item.requester}</p>
                      <p className="text-[10px] text-gray-400">{item.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.status === 'Pendente' ? "bg-amber-100 text-amber-700" :
                        item.status === 'Aprovado' ? "bg-emerald-100 text-emerald-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {item.value}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/solicitacoes/${item.id}`)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Budget Progress Card */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-white/20 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider">
                Orçamento 2026
              </span>
            </div>
            <p className="text-sm text-blue-100">Consumo Total (Jaraguá do Sul)</p>
            <p className="text-2xl font-bold mt-1">R$ 1.450.000,00</p>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Progresso Anual</span>
                <span>42%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[42%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
