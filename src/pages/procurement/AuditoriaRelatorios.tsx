import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Filter, 
  ChevronRight,
  Printer,
  Share2,
  Info,
  Clock
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const reports = [
  {
    title: 'Gasto por Projeto',
    description: 'Análise detalhada dos custos por projeto e fonte de financiamento.',
    icon: PieChart,
    color: 'text-blue-600 bg-blue-50',
    lastGenerated: '01/04/2026 09:00'
  },
  {
    title: 'Performance de Fornecedores',
    description: 'Avaliação de prazos de entrega e conformidade técnica.',
    icon: TrendingUp,
    color: 'text-emerald-600 bg-emerald-50',
    lastGenerated: '31/03/2026 18:30'
  },
  {
    title: 'Tempo Médio de Processo',
    description: 'SLA desde a solicitação até a emissão do pedido.',
    icon: BarChart3,
    color: 'text-purple-600 bg-purple-50',
    lastGenerated: '01/04/2026 11:15'
  },
  {
    title: 'Relatório de Auditoria Anual',
    description: 'Consolidado de todos os eventos e documentos para prestação de contas.',
    icon: FileText,
    color: 'text-amber-600 bg-amber-50',
    lastGenerated: '01/01/2026 00:00'
  }
];

export default function AuditoriaRelatorios() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Relatórios e Consultas</h1>
          <p className="text-sm text-gray-500 mt-1">Gere documentos e análises para tomada de decisão e auditoria.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Gasto (Ano)</p>
          <p className="text-2xl font-black text-gray-900 mt-1">R$ 1.245.000,00</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-1 font-bold">
            <TrendingUp className="w-3 h-3" /> +12% vs 2025
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedidos Emitidos</p>
          <p className="text-2xl font-black text-blue-600 mt-1">452</p>
          <p className="text-[10px] text-gray-400 mt-1 font-bold">Média: 38/mês</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SLA Médio</p>
          <p className="text-2xl font-black text-purple-600 mt-1">8.5 dias</p>
          <p className="text-[10px] text-emerald-600 mt-1 font-bold">● Dentro da meta</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Economia Gerada</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">R$ 84.200,00</p>
          <p className="text-[10px] text-gray-400 mt-1 font-bold">Via cotações competitivas</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", report.color)}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all" title="Imprimir">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all" title="Compartilhar">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-8">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{report.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{report.description}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <Clock className="w-3 h-3" /> Atualizado em: {report.lastGenerated}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                <Download className="w-3 h-3" /> Gerar PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Query Placeholder */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-100">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Precisa de uma consulta personalizada?</h2>
          <p className="text-blue-100 text-sm max-w-md">
            Utilize nossa ferramenta de BI para cruzar dados de todos os módulos e gerar relatórios sob medida para sua necessidade.
          </p>
        </div>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg">
          Acessar Painel de BI
        </button>
      </div>
    </div>
  );
}
