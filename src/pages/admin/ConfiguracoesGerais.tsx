import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Bell, 
  Mail, 
  Globe, 
  Lock, 
  Database, 
  FileText, 
  ShieldCheck,
  Info,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const configSections = [
  { id: 'geral', name: 'Geral', icon: Settings, description: 'Configurações básicas da instituição.' },
  { id: 'notificacoes', name: 'Notificações', icon: Bell, description: 'Alertas por email e sistema.' },
  { id: 'seguranca', name: 'Segurança', icon: Lock, description: 'Políticas de senha e acesso.' },
  { id: 'integracoes', name: 'Integrações', icon: Globe, description: 'Conexão com ERP e bancos.' },
  { id: 'documentos', name: 'Documentos', icon: FileText, description: 'Modelos e anexos obrigatórios.' },
];

import { NavLink } from 'react-router-dom';

export default function ConfiguracoesGerais() {
  const [activeSection, setActiveSection] = useState('geral');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configurações do Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">Parâmetros globais e regras de negócio do fluxo de compras.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Save className="w-4 h-4" /> Salvar Configurações
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <NavLink 
          to="/configuracoes/gerais" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Gerais
        </NavLink>
        <NavLink 
          to="/configuracoes/alcadas" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Alçadas de Aprovação
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {configSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full p-4 flex items-start gap-3 rounded-2xl border transition-all text-left group",
                activeSection === section.id 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                activeSection === section.id ? "bg-white/20" : "bg-gray-50 group-hover:bg-blue-100"
              )}>
                <section.icon className={cn("w-5 h-5", activeSection === section.id ? "text-white" : "text-gray-400 group-hover:text-blue-600")} />
              </div>
              <div className="flex-1">
                <p className={cn("text-sm font-bold", activeSection === section.id ? "text-white" : "text-gray-900")}>
                  {section.name}
                </p>
                <p className={cn("text-[10px] mt-0.5 leading-relaxed", activeSection === section.id ? "text-blue-100" : "text-gray-400")}>
                  {section.description}
                </p>
              </div>
              <ChevronRight className={cn("w-4 h-4 mt-1 transition-all", activeSection === section.id ? "text-white translate-x-1" : "text-gray-300 group-hover:text-gray-400")} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
              <h3 className="font-bold text-gray-900">Configurações de {configSections.find(s => s.id === activeSection)?.name}</h3>
            </div>
            
            <div className="p-8 space-y-8">
              {activeSection === 'geral' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome da Instituição</label>
                      <input type="text" defaultValue="APAE Jaraguá do Sul" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CNPJ Principal</label>
                      <input type="text" defaultValue="12.345.678/0001-90" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moeda Padrão</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium">
                        <option>BRL (R$)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fuso Horário</label>
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium">
                        <option>Brasília (GMT-3)</option>
                        <option>Manaus (GMT-4)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-[10px] text-blue-700 leading-relaxed">
                      Estas informações serão utilizadas no cabeçalho de todos os documentos gerados pelo sistema (Ordens de Compra, Relatórios, etc).
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'notificacoes' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Alertas por Email</h4>
                    <div className="space-y-3">
                      {[
                        'Nova solicitação aguardando aprovação',
                        'Solicitação aprovada ou rejeitada',
                        'Pedido de compra emitido',
                        'Recebimento de mercadoria registrado',
                        'Vencimento de parcela de pagamento'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-sm font-medium text-gray-700">{item}</span>
                          <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'seguranca' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiração de Senha (Dias)</label>
                      <input type="number" defaultValue={90} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tentativas de Login</label>
                      <input type="number" defaultValue={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Autenticação em Duas Etapas (2FA)</p>
                      <p className="text-[10px] text-gray-500 mt-1">Obrigatório para todos os usuários administrativos.</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Backup do Sistema</p>
                <p className="text-[10px] text-gray-400">Último backup realizado em: 01/04/2026 03:00</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all">
              Executar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
