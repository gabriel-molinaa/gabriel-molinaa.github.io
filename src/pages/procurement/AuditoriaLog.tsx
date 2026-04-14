import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  FileText,
  AlertCircle,
  Download,
  Info,
  History,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockAuditLogs } from '@/src/types/mockData';
import { AuditLog } from '@/src/types/procurement';

const moduleColors: Record<string, string> = {
  'Solicitação': 'bg-blue-50 text-blue-700 border-blue-100',
  'Aprovação': 'bg-amber-50 text-amber-700 border-amber-100',
  'Compras': 'bg-purple-50 text-purple-700 border-purple-100',
  'Recebimento': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Financeiro': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Sistema': 'bg-gray-50 text-gray-700 border-gray-100',
};

export default function AuditoriaLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = mockAuditLogs.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Log de Auditoria</h1>
          <p className="text-sm text-gray-500 mt-1">Rastreabilidade completa de todos os eventos do sistema de compras.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Exportar Log (CSV)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, usuário, processo ou detalhe..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
            <Calendar className="w-4 h-4" /> Período
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
            <Filter className="w-4 h-4" /> Módulos
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Módulo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ação</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Processo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedLog(log)}>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-900">{log.timestamp.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{log.timestamp.split(' ')[1]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                          {log.user.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        moduleColors[log.module]
                      )}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-900">{log.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-blue-600">{log.target}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-all" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <History className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">Nenhum evento encontrado!</p>
                      <p className="text-sm">Tente ajustar seus filtros de busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Detalhes do Evento</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID do Log</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{selectedLog.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data / Hora</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{selectedLog.timestamp}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Usuário Responsável</p>
                  <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shadow-sm">
                      {selectedLog.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{selectedLog.user}</p>
                      <p className="text-[10px] text-gray-400">Perfil: Gestor de Compras</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ação Realizada</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedLog.action} em {selectedLog.module}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processo Vinculado</p>
                  <div className="flex items-center justify-between mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-bold text-blue-700">{selectedLog.target}</span>
                    <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                      Ver Processo <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição Detalhada</p>
                  <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
                    "{selectedLog.details}"
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-3 h-3" /> Timeline do Processo
                </h4>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
                    <p className="text-[10px] font-bold text-gray-900">Evento Atual</p>
                    <p className="text-[10px] text-gray-400">{selectedLog.timestamp}</p>
                  </div>
                  <div className="relative pl-6 opacity-50">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-gray-300 border-4 border-white rounded-full shadow-sm" />
                    <p className="text-[10px] font-bold text-gray-900">Evento Anterior</p>
                    <p className="text-[10px] text-gray-400">24h antes • Sistema</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setSelectedLog(null)}
                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
