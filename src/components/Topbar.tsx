import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, LogOut, RefreshCw, Menu, Settings } from 'lucide-react';
import { useAuth, UserRole } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

const roles: UserRole[] = [
  'Solicitante',
  'Gestor/Aprovador',
  'Compras',
  'Almoxarifado/Recebimento',
  'Financeiro',
  'Auditoria',
  'Administrador'
];

export default function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logout, switchRole } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg w-64 lg:w-96">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar solicitações, processos..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Role Switcher (Mocked) */}
        <div className="relative">
          <button 
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            {user?.role}
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
              <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Alternar Perfil (Mock)
              </p>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setIsRoleOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                    user?.role === role ? "text-blue-600 font-semibold" : "text-gray-700"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {user?.name}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {user?.email}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <User className="w-4 h-4" /> Perfil
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configurações
              </button>
              <div className="h-px bg-gray-100 my-2" />
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
