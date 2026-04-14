import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './components/PlaceholderPage';
import SolicitacoesList from './pages/procurement/SolicitacoesList';
import NovaSolicitacao from './pages/procurement/NovaSolicitacao';
import SolicitacaoDetalhe from './pages/procurement/SolicitacaoDetalhe';
import AprovacoesList from './pages/procurement/AprovacoesList';
import AprovacaoAnalise from './pages/procurement/AprovacaoAnalise';
import FilaSolicitacoesAprovadas from './pages/procurement/FilaSolicitacoesAprovadas';
import ConsolidacaoDemandas from './pages/procurement/ConsolidacaoDemandas';
import Cotacao from './pages/procurement/Cotacao';
import ComparativoFornecedores from './pages/procurement/ComparativoFornecedores';
import GeracaoPedidoCompra from './pages/procurement/GeracaoPedidoCompra';
import ListaPedidosCompra from './pages/procurement/ListaPedidosCompra';
import RecebimentoList from './pages/procurement/RecebimentoList';
import RecebimentoConferencia from './pages/procurement/RecebimentoConferencia';
import PagamentosList from './pages/procurement/PagamentosList';
import PagamentoDetalhe from './pages/procurement/PagamentoDetalhe';
import AuditoriaLog from './pages/procurement/AuditoriaLog';
import AuditoriaRelatorios from './pages/procurement/AuditoriaRelatorios';
import UsuariosList from './pages/admin/UsuariosList';
import PerfisPermissoes from './pages/admin/PerfisPermissoes';
import ProjetosList from './pages/admin/ProjetosList';
import ConveniosList from './pages/admin/ConveniosList';
import FornecedoresList from './pages/admin/FornecedoresList';
import ItensList from './pages/admin/ItensList';
import ParametrosAlcada from './pages/admin/ParametrosAlcada';
import ConfiguracoesGerais from './pages/admin/ConfiguracoesGerais';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* Procurement Module */}
            <Route path="solicitacoes">
              <Route index element={<SolicitacoesList />} />
              <Route path="nova" element={<NovaSolicitacao />} />
              <Route path="minhas" element={<SolicitacoesList title="Minhas Solicitações" onlyMyRequests={true} />} />
              <Route path=":id" element={<SolicitacaoDetalhe />} />
            </Route>

            <Route path="aprovacoes">
              <Route index element={<AprovacoesList />} />
              <Route path=":id" element={<AprovacaoAnalise />} />
            </Route>

            <Route path="compras">
              <Route index element={<Navigate to="fila" replace />} />
              <Route path="fila" element={<FilaSolicitacoesAprovadas />} />
              <Route path="consolidacao/:id" element={<ConsolidacaoDemandas />} />
              <Route path="cotacao/:id" element={<Cotacao />} />
              <Route path="comparativo/:id" element={<ComparativoFornecedores />} />
              <Route path="pedido/novo" element={<GeracaoPedidoCompra />} />
              <Route path="pedidos" element={<ListaPedidosCompra />} />
            </Route>

            <Route path="recebimento">
              <Route index element={<RecebimentoList />} />
              <Route path="conferencia/:id" element={<RecebimentoConferencia />} />
            </Route>

            <Route path="financeiro">
              <Route path="pagamentos">
                <Route index element={<PagamentosList />} />
                <Route path=":id" element={<PagamentoDetalhe />} />
              </Route>
            </Route>

            <Route path="auditoria">
              <Route path="log" element={<AuditoriaLog />} />
              <Route path="relatorios" element={<AuditoriaRelatorios />} />
            </Route>
            <Route path="cadastros">
              <Route index element={<Navigate to="usuarios" replace />} />
              <Route path="usuarios" element={<UsuariosList />} />
              <Route path="perfis" element={<PerfisPermissoes />} />
              <Route path="projetos" element={<ProjetosList />} />
              <Route path="convenios" element={<ConveniosList />} />
              <Route path="fornecedores" element={<FornecedoresList />} />
              <Route path="itens" element={<ItensList />} />
            </Route>

            <Route path="configuracoes">
              <Route index element={<Navigate to="gerais" replace />} />
              <Route path="gerais" element={<ConfiguracoesGerais />} />
              <Route path="alcadas" element={<ParametrosAlcada />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
