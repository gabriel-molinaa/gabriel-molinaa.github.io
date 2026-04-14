import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  ArrowRight,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const stats = [
  { name: 'Minhas Solicitações', value: '12', icon: FileText, color: 'bg-blue-500' },
  { name: 'Em Aprovação', value: '05', icon: Clock, color: 'bg-amber-500' },
  { name: 'Aprovadas (Mês)', value: '04', icon: CheckCircle2, color: 'bg-emerald-500' },
  { name: 'Devolvidas/Ajuste', value: '03', icon: AlertTriangle, color: 'bg-red-500' },
];

const myRequests = [
  { id: 'SOL-2026-042', title: 'Resmas de Papel A4 (10 un)', date: '01/04/2026', status: 'Devolvida', reason: 'Especificação incompleta', priority: 'Média' },
  { id: 'SOL-2026-040', title: 'Manutenção Preventiva Elevador', date: '30/03/2026', status: 'Em Aprovação', step: 'Gestor de Unidade', priority: 'Alta' },
  { id: 'SOL-2026-038', title: 'Kit Higiene Bucal (50 un)', date: '28/03/2026', status: 'Aprovada', info: 'Em cotação', priority: 'Baixa' },
  { id: 'SOL-2026-035', title: 'Conserto de Cadeira de Rodas', date: '25/03/2026', status: 'Reprovada', reason: 'Fora do orçamento do projeto', priority: 'Alta' },
];

export default function SolicitanteDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Painel do Solicitante</h2>
          <p className="text-sm text-gray-500">Acompanhe suas requisições e status de aprovação.</p>
        </div>
        <button 
          onClick={() => navigate('/solicitacoes/nova')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-4 h-4" /> Nova Solicitação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              if (stat.name === 'Em Aprovação') navigate('/aprovacoes');
              if (stat.name === 'Minhas Solicitações') navigate('/solicitacoes/minhas');
            }}
            className={cn(
              "bg-white p-5 rounded-2xl border border-gray-200 shadow-sm",
              (stat.name === 'Em Aprovação' || stat.name === 'Minhas Solicitações') && "cursor-pointer hover:shadow-md transition-shadow"
            )}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Minhas Solicitações Recentes</h3>
            <button 
              onClick={() => navigate('/solicitacoes/minhas')}
              className="text-xs font-bold text-blue-600 flex items-center gap-1"
            >
              Ver Histórico <History className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">ID / Item</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Detalhes</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{req.id}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{req.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        req.status === 'Devolvida' ? "bg-red-100 text-red-700" :
                        req.status === 'Em Aprovação' ? "bg-amber-100 text-amber-700" :
                        req.status === 'Aprovada' ? "bg-emerald-100 text-emerald-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 italic">
                        {req.reason || req.step || req.info}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/solicitacoes/${req.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
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

        {/* Sidebar Alerts */}
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-red-700 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm">Atenção: Ajustes Necessários</h4>
            </div>
            <p className="text-xs text-red-600 leading-relaxed">
              Você tem <strong>3 solicitações</strong> que foram devolvidas pelo gestor. Clique para ajustar as especificações técnicas.
            </p>
            <button className="mt-4 w-full py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors">
              Corrigir Agora
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-gray-900 mb-4">Dicas de Solicitação</h4>
            <ul className="space-y-3">
              <li className="flex gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Sempre anexe pelo menos 3 orçamentos prévios se o valor exceder R$ 5.000,00.
              </li>
              <li className="flex gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Verifique o saldo do centro de custo antes de enviar.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
