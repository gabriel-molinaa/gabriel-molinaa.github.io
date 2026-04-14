import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  History, 
  AlertTriangle, 
  ArrowRight,
  Eye,
  UserCheck,
  FileSearch,
  Activity,
  Clock,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const stats = [
  { name: 'Logs de Sistema', value: '1.2k', icon: Activity, color: 'bg-blue-500' },
  { name: 'Divergências', value: '08', icon: AlertTriangle, color: 'bg-red-500' },
  { name: 'Alterações Críticas', value: '03', icon: ShieldCheck, color: 'bg-amber-500' },
  { name: 'Usuários Ativos', value: '24', icon: UserCheck, color: 'bg-emerald-500' },
];

const auditLogs = [
  { id: 'LOG-452', user: 'Carlos Santos', action: 'Alteração de Fornecedor Vencedor', target: 'PROC-2026-015', date: '01/04/2026 10:24', severity: 'Alta' },
  { id: 'LOG-450', user: 'Ana Silva', action: 'Aprovação de Solicitação', target: 'SOL-2026-040', date: '01/04/2026 09:15', severity: 'Baixa' },
  { id: 'LOG-448', user: 'João Pereira', action: 'Exclusão de Item de Cotação', target: 'PROC-2026-012', date: '31/03/2026 16:45', severity: 'Média' },
  { id: 'LOG-445', user: 'Maria Oliveira', action: 'Login no Sistema', target: 'Sessão #882', date: '31/03/2026 14:20', severity: 'Baixa' },
];

const discrepancies = [
  { id: 'DIV-001', type: 'Preço', description: 'NF-e #452 vs Pedido #398', value: 'R$ +450,00', status: 'Em Análise' },
  { id: 'DIV-002', type: 'Quantidade', description: 'Recebimento vs Pedido #402', value: '-10 un', status: 'Pendente' },
];

export default function AuditoriaDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Painel de Auditoria</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
              <Lock className="w-3 h-3" /> Somente Leitura
            </span>
          </div>
          <p className="text-sm text-gray-500">Monitoramento de conformidade, logs e rastreabilidade total.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <FileSearch className="w-4 h-4" /> Relatório de Conformidade
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            <History className="w-4 h-4" /> Exportar Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
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
        {/* Audit Logs Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Log de Eventos Recentes</h3>
            <button className="text-xs font-bold text-blue-600">Ver todos os logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Usuário / Ação</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Alvo</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Severidade</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.action}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">
                      {log.target}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.date}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        log.severity === 'Alta' ? "bg-red-100 text-red-700" :
                        log.severity === 'Média' ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/solicitacoes/${log.target}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discrepancies Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Divergências Detectadas
            </h4>
            <div className="space-y-4">
              {discrepancies.map((div) => (
                <div key={div.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-gray-900">{div.type}: {div.id}</p>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      {div.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{div.description}</p>
                  <p className="text-[10px] font-bold text-red-600 mt-2">
                    Diferença: {div.value}
                  </p>
                  <button className="mt-3 w-full py-1.5 text-[10px] font-bold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                    Investigar Detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-blue-900 mb-2">Dica de Auditoria</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Sempre verifique se a justificativa de escolha do fornecedor está anexada em processos com cotação única.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
