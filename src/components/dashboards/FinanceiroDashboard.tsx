import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const stats = [
  { name: 'Pagamentos (Hoje)', value: 'R$ 42.500', icon: CreditCard, color: 'bg-blue-500' },
  { name: 'Notas Pendentes', value: '12', icon: FileText, color: 'bg-amber-500' },
  { name: 'Divergências', value: '03', icon: AlertCircle, color: 'bg-red-500' },
  { name: 'Saldo Projetos', value: 'R$ 1.2M', icon: TrendingUp, color: 'bg-emerald-500' },
];

const payments = [
  { id: 'PAG-2026-102', supplier: 'LimpMax Ltda', value: 'R$ 4.250,00', date: '01/04/2026', status: 'Aguardando Liberação', project: 'Manutenção Geral' },
  { id: 'PAG-2026-105', supplier: 'Tech Solutions', value: 'R$ 12.800,00', date: '02/04/2026', status: 'Divergência de Valor', project: 'Modernização TI' },
  { id: 'PAG-2026-108', supplier: 'Papelaria Central', value: 'R$ 1.250,00', date: '05/04/2026', status: 'Programado', project: 'Administrativo' },
  { id: 'PAG-2026-110', supplier: 'Construtora Silva', value: 'R$ 85.000,00', date: '10/04/2026', status: 'Pendente Documentação', project: 'Reforma Unidade Leste' },
];

export default function FinanceiroDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Painel Financeiro</h2>
          <p className="text-sm text-gray-500">Controle de pagamentos, saldos e conformidade fiscal.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4" /> Fluxo de Caixa
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            <CheckCircle2 className="w-4 h-4" /> Liberar Pagamentos
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
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Próximos Pagamentos</h3>
            <button className="text-xs font-bold text-blue-600">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Fornecedor / ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Valor</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Vencimento</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pag) => (
                  <tr key={pag.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{pag.supplier}</p>
                      <p className="text-xs text-gray-500">{pag.id} • {pag.project}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {pag.value}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {pag.date}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        pag.status === 'Divergência de Valor' ? "bg-red-100 text-red-700" :
                        pag.status === 'Programado' ? "bg-emerald-100 text-emerald-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {pag.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/solicitacoes/${pag.id}`)}
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
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="w-4 h-4" />
              <h4 className="font-bold text-sm">Alerta de Saldo</h4>
            </div>
            <p className="text-xs text-red-600 leading-relaxed">
              O projeto <strong>Inclusão Digital</strong> atingiu 95% do orçamento previsto para o trimestre. Novas compras podem ser bloqueadas.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Pendências Fiscais
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700">NF-e #452 (Falta XML)</p>
                <XCircle className="w-3 h-3 text-red-500" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700">Certidão Negativa (Vencida)</p>
                <XCircle className="w-3 h-3 text-red-500" />
              </div>
            </div>
            <button className="mt-4 w-full py-2 text-xs font-bold text-blue-600 hover:text-blue-700">
              Notificar Fornecedores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
