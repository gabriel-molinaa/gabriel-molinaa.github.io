import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/src/context/AuthContext';
import { LogIn, ShieldCheck, Info } from 'lucide-react';
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

export default function Login() {
  const { user, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Solicitante');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            A
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Gestão de Compras APAE
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema Interno de Suprimentos e Logística
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione seu Perfil (Mockup)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 border rounded-xl text-sm font-medium transition-all",
                      selectedRole === role 
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600 ring-offset-2" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {role}
                    {selectedRole === role && <ShieldCheck className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Este é um protótipo navegável. Em produção, o acesso será via autenticação centralizada da APAE.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
            >
              Acessar Sistema
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; 2026 APAE - Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
