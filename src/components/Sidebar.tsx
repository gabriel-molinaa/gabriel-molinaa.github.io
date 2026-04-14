import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  ShieldCheck, 
  Database, 
  Settings,
  Menu,
  X,
  Users
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Solicitações', icon: FileText, path: '/solicitacoes' },
  { name: 'Aprovações', icon: CheckSquare, path: '/aprovacoes' },
  { name: 'Compras e Cotações', icon: ShoppingCart, path: '/compras' },
  { name: 'Estoque e Recebimento', icon: Package, path: '/recebimento' },
  { name: 'Financeiro', icon: DollarSign, path: '/financeiro/pagamentos' },
  { name: 'Auditoria', icon: ShieldCheck, path: '/auditoria/log' },
  { name: 'Relatórios', icon: FileText, path: '/auditoria/relatorios' },
  { name: 'Usuários e Perfis', icon: Users, path: '/cadastros/usuarios' },
  { name: 'Cadastros Base', icon: Database, path: '/cadastros/projetos' },
  { name: 'Configurações', icon: Settings, path: '/configuracoes/gerais' },
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                APAE Compras
              </span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Unidade
              </p>
              <p className="text-sm font-medium text-gray-900 truncate">
                Matriz
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
