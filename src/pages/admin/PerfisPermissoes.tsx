import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  Lock,
  Eye,
  Edit2,
  Trash2,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRoles } from '@/src/types/mockData';

const permissionGroups = [
  {
    name: 'Solicitações',
    permissions: [
      { id: 'solicitacoes.view', name: 'Visualizar Solicitações', description: 'Permite visualizar a lista e detalhes de solicitações.' },
      { id: 'solicitacoes.create', name: 'Criar Solicitações', description: 'Permite criar novas solicitações de compra.' },
      { id: 'solicitacoes.edit', name: 'Editar Solicitações', description: 'Permite editar solicitações em rascunho ou retornadas.' },
      { id: 'solicitacoes.delete', name: 'Excluir Solicitações', description: 'Permite excluir solicitações em rascunho.' },
    ]
  },
  {
    name: 'Aprovações',
    permissions: [
      { id: 'aprovacoes.view', name: 'Visualizar Aprovações', description: 'Permite visualizar a fila de aprovações pendentes.' },
      { id: 'aprovacoes.execute', name: 'Executar Aprovações', description: 'Permite aprovar, rejeitar ou retornar solicitações.' },
    ]
  },
  {
    name: 'Compras',
    permissions: [
      { id: 'compras.view', name: 'Visualizar Compras', description: 'Permite visualizar a fila de compras e pedidos.' },
      { id: 'compras.execute', name: 'Executar Compras', description: 'Permite realizar cotações e emitir pedidos de compra.' },
    ]
  },
  {
    name: 'Administrativo',
    permissions: [
      { id: 'admin.users', name: 'Gestão de Usuários', description: 'Permite criar, editar e excluir usuários.' },
      { id: 'admin.roles', name: 'Gestão de Perfis', description: 'Permite configurar perfis e permissões.' },
      { id: 'admin.config', name: 'Configurações do Sistema', description: 'Permite alterar parâmetros globais do sistema.' },
    ]
  }
];

import { NavLink } from 'react-router-dom';

export default function PerfisPermissoes() {
  const [selectedRole, setSelectedRole] = useState(mockRoles[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Usuários e Perfis</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de acesso e controle de permissões do sistema.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus className="w-4 h-4" /> Novo Perfil
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <NavLink 
          to="/cadastros/usuarios" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Usuários
        </NavLink>
        <NavLink 
          to="/cadastros/perfis" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Perfis e Permissões
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm">Perfis Disponíveis</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {mockRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "w-full px-6 py-4 flex items-center justify-between transition-all group",
                    selectedRole.id === role.id ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-50"
                  )}
                >
                  <div className="text-left">
                    <p className={cn("text-sm font-bold", selectedRole.id === role.id ? "text-blue-700" : "text-gray-900")}>
                      {role.name}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <Users className="w-3 h-3" /> {role.userCount} usuários
                    </div>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-all", selectedRole.id === role.id ? "text-blue-600 translate-x-1" : "text-gray-300 group-hover:text-gray-400")} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-[10px] text-amber-700 leading-relaxed">
              <strong>Segregação de Funções:</strong> Evite atribuir permissões de <strong>Solicitação</strong> e <strong>Aprovação</strong> ao mesmo perfil para garantir a integridade dos processos.
            </p>
          </div>
        </div>

        {/* Permissions Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Configurar Permissões: <span className="text-blue-600">{selectedRole.name}</span></h3>
                <p className="text-xs text-gray-500 mt-1">{selectedRole.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all">
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                  Salvar Alterações
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {permissionGroups.map((group) => (
                <div key={group.name} className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                    {group.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.permissions.map((perm) => {
                      const isChecked = selectedRole.permissions.includes('all') || selectedRole.permissions.includes(perm.id);
                      return (
                        <div 
                          key={perm.id}
                          className={cn(
                            "p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3",
                            isChecked ? "bg-blue-50/50 border-blue-200" : "bg-gray-50/50 border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-all mt-0.5",
                            isChecked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300"
                          )}>
                            {isChecked && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{perm.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{perm.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
