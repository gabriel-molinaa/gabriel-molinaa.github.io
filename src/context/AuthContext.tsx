import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 
  | 'Solicitante' 
  | 'Gestor/Aprovador' 
  | 'Compras' 
  | 'Almoxarifado/Recebimento' 
  | 'Financeiro' 
  | 'Auditoria' 
  | 'Administrador';

interface User {
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser({
      name: 'Usuário Mock',
      role,
      email: 'usuario@apae.org.br'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
