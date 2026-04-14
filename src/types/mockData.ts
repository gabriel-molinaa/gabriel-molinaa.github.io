import { 
  PurchaseRequest, 
  PurchaseOrder, 
  Invoice, 
  Payment, 
  AuditLog,
  User,
  Role,
  Project,
  Agreement,
  Supplier,
  ItemMaster,
  ApprovalThreshold,
  Transfer,
  StockItem,
  StockMovement,
  Inventory,
  StockAdjustment
} from './procurement';

export const mockRequests: PurchaseRequest[] = [
  {
    id: 'SOL-2026-001',
    date: '01/04/2026',
    requester: 'Ana Silva',
    unit: 'Matriz',
    sector: 'Administrativo',
    project: 'Projeto Inclusão Digital',
    costCenter: 'CC-102 (Informática)',
    agreement: 'Convênio Municipal 452/2025',
    fundingSource: 'Recursos Próprios',
    workPlan: 'Meta 1 - Infraestrutura',
    budgetCategory: 'Material de Consumo',
    items: [
      {
        id: '1',
        type: 'Material de Consumo',
        code: 'MAT-001',
        description: '10 resmas de papel A4 75g',
        quantity: 10,
        unitOfMeasure: 'Resma',
        estimatedValue: 300.00,
        expectedDate: '10/04/2026',
        deliveryLocation: 'Almoxarifado Central'
      }
    ],
    justification: 'Necessidade de reposição de estoque para o setor administrativo.',
    urgency: 'Normal',
    status: 'Rascunho',
    history: [
      { date: '01/04/2026 09:00', user: 'Ana Silva', action: 'Criação do Rascunho' }
    ]
  },
  {
    id: 'SOL-2026-002',
    date: '31/03/2026',
    requester: 'Carlos Santos',
    unit: 'Matriz',
    sector: 'Manutenção',
    project: 'Manutenção Predial',
    costCenter: 'CC-205 (Infraestrutura)',
    items: [
      {
        id: '1',
        type: 'Serviço',
        code: 'SRV-042',
        description: 'Manutenção preventiva do ar condicionado central',
        quantity: 1,
        unitOfMeasure: 'Serviço',
        estimatedValue: 4800.00,
        expectedDate: '05/04/2026',
        deliveryLocation: 'Sede Administrativa'
      }
    ],
    justification: 'Manutenção anual obrigatória para garantir o funcionamento dos aparelhos.',
    urgency: 'Urgente',
    status: 'Aguardando aprovação',
    history: [
      { date: '31/03/2026 10:00', user: 'Carlos Santos', action: 'Solicitação Enviada' },
      { date: '31/03/2026 14:00', user: 'Sistema', action: 'Em Análise Técnica' }
    ]
  },
  {
    id: 'SOL-2026-003',
    date: '30/03/2026',
    requester: 'Maria Oliveira',
    unit: 'Unidade 2',
    sector: 'Cozinha',
    project: 'Projeto Alimentação Saudável',
    costCenter: 'CC-301 (Nutrição)',
    agreement: 'Convênio Estadual 123/2024',
    items: [
      {
        id: '1',
        type: 'Material de Consumo',
        code: 'ALM-010',
        description: 'Arroz agulhinha tipo 1 (5kg)',
        quantity: 20,
        unitOfMeasure: 'Pacote',
        estimatedValue: 600.00,
        expectedDate: '03/04/2026',
        deliveryLocation: 'Cozinha Unidade 2'
      },
      {
        id: '2',
        type: 'Material de Consumo',
        code: 'ALM-015',
        description: 'Feijão carioca (1kg)',
        quantity: 30,
        unitOfMeasure: 'Pacote',
        estimatedValue: 240.00,
        expectedDate: '03/04/2026',
        deliveryLocation: 'Cozinha Unidade 2'
      }
    ],
    justification: 'Abastecimento mensal da unidade leste.',
    urgency: 'Emergencial',
    status: 'Em cotação',
    history: [
      { date: '30/03/2026 08:00', user: 'Maria Oliveira', action: 'Solicitação Enviada' },
      { date: '30/03/2026 11:00', user: 'Gestor Unidade', action: 'Aprovado pelo Gestor' },
      { date: '31/03/2026 09:00', user: 'Compras', action: 'Iniciada Cotação' }
    ]
  }
];

export const mockQuotations = [
  {
    id: 'COT-2026-001',
    requestId: 'SOL-2026-003',
    status: 'Em Análise',
    suppliers: [
      {
        id: 'SUP-001',
        name: 'Distribuidora Alimentos S.A.',
        unitPrice: 120.00,
        totalPrice: 12000.00,
        deliveryTime: '3 dias',
        paymentTerms: '30 dias',
        technicalCompliance: true,
        isWinner: true,
        justification: 'Melhor preço e prazo de entrega.'
      },
      {
        id: 'SUP-002',
        name: 'Mercado Atacadista Ltda',
        unitPrice: 125.00,
        totalPrice: 12500.00,
        deliveryTime: '5 dias',
        paymentTerms: '15 dias',
        technicalCompliance: true,
        isWinner: false
      },
      {
        id: 'SUP-003',
        name: 'Cozinha & Cia',
        unitPrice: 130.00,
        totalPrice: 13000.00,
        deliveryTime: '2 dias',
        paymentTerms: 'À vista',
        technicalCompliance: true,
        isWinner: false
      }
    ]
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'OC-2026-045',
    date: '29/03/2026',
    supplier: 'Papelaria Central',
    requests: ['SOL-2026-005'],
    fundingSource: 'Recursos Próprios',
    paymentCondition: '30 dias',
    totalValue: 1250.00,
    expectedDelivery: '05/04/2026',
    status: 'Emitida',
    items: [
      { description: 'Kit de limpeza (Detergente, Desinfetante, Sabão)', quantity: 20, receivedQuantity: 0, unitPrice: 62.50 }
    ]
  },
  {
    id: 'OC-2026-046',
    date: '30/03/2026',
    supplier: 'Distribuidora Alimentos S.A.',
    requests: ['SOL-2026-003'],
    fundingSource: 'Convênio Estadual 123/2024',
    paymentCondition: '30 dias',
    totalValue: 12000.00,
    expectedDelivery: '03/04/2026',
    status: 'Recebimento Parcial',
    items: [
      { description: 'Insumos para cozinha industrial (Arroz, Feijão, Óleo)', quantity: 50, receivedQuantity: 30, unitPrice: 240.00 }
    ]
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'NF-2026-881',
    orderId: 'OC-2026-046',
    number: '881',
    series: '1',
    issueDate: '31/03/2026',
    totalValue: 7200.00,
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAG-2026-001',
    orderId: 'OC-2026-046',
    invoiceId: 'NF-2026-881',
    supplier: 'Distribuidora Alimentos S.A.',
    totalValue: 7200.00,
    status: 'Pendente',
    installments: [
      { number: 1, dueDate: '30/04/2026', value: 7200.00, status: 'Pendente' }
    ]
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '28/03/2026 09:00',
    user: 'Ana Silva',
    module: 'Solicitação',
    action: 'Criação',
    target: 'SOL-2026-005',
    details: 'Solicitação de material de limpeza criada.'
  },
  {
    id: 'LOG-002',
    timestamp: '28/03/2026 14:00',
    user: 'Gestor',
    module: 'Aprovação',
    action: 'Aprovação',
    target: 'SOL-2026-005',
    details: 'Solicitação aprovada pelo gestor.'
  },
  {
    id: 'LOG-003',
    timestamp: '29/03/2026 10:00',
    user: 'Carlos Comprador',
    module: 'Compras',
    action: 'Emissão de Pedido',
    target: 'OC-2026-045',
    details: 'Pedido de compra emitido para Papelaria Central.'
  },
  {
    id: 'LOG-004',
    timestamp: '31/03/2026 15:30',
    user: 'Ricardo Almoxarife',
    module: 'Recebimento',
    action: 'Recebimento Parcial',
    target: 'OC-2026-046',
    details: 'Recebimento de 30 de 50 itens registrado.'
  }
];

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Gabriel Molina', email: 'gabriel@apae.org.br', role: 'Administrador', department: 'TI', status: 'Ativo', lastAccess: '01/04/2026 10:00' },
  { id: 'USR-002', name: 'Ana Silva', email: 'ana.silva@apae.org.br', role: 'Solicitante', department: 'Educação', status: 'Ativo', lastAccess: '01/04/2026 09:30' },
  { id: 'USR-003', name: 'Ricardo Almeida', email: 'ricardo@apae.org.br', role: 'Gestor', department: 'Financeiro', status: 'Ativo', lastAccess: '01/04/2026 08:45' },
  { id: 'USR-004', name: 'Juliana Costa', email: 'juliana@apae.org.br', role: 'Comprador', department: 'Suprimentos', status: 'Ativo', lastAccess: '31/03/2026 17:00' },
];

export const mockRoles: Role[] = [
  { id: 'ROL-001', name: 'Administrador', description: 'Acesso total ao sistema e configurações.', permissions: ['all'], userCount: 2 },
  { id: 'ROL-002', name: 'Solicitante', description: 'Criação e acompanhamento de solicitações.', permissions: ['solicitacoes.view', 'solicitacoes.create'], userCount: 45 },
  { id: 'ROL-003', name: 'Gestor', description: 'Aprovação de solicitações e visualização de relatórios.', permissions: ['solicitacoes.view', 'aprovacoes.view', 'aprovacoes.execute'], userCount: 12 },
  { id: 'ROL-004', name: 'Comprador', description: 'Gestão de cotações e pedidos de compra.', permissions: ['compras.view', 'compras.execute', 'fornecedores.view'], userCount: 5 },
];

export const mockProjects: Project[] = [
  { id: 'PRJ-001', name: 'Manutenção Predial - Sede', costCenter: '10.01.001', manager: 'Ricardo Almeida', status: 'Ativo' },
  { id: 'PRJ-002', name: 'Projeto Inclusão Digital', costCenter: '20.05.002', manager: 'Ana Silva', status: 'Ativo' },
  { id: 'PRJ-003', name: 'Atendimento Clínico Especializado', costCenter: '30.02.001', manager: 'Maria Oliveira', status: 'Ativo' },
  { id: 'PRJ-004', name: 'Evento Beneficente Anual', costCenter: '40.01.005', manager: 'João Pereira', status: 'Inativo' },
];

export const mockAgreements: Agreement[] = [
  { id: 'CONV-2026-001', name: 'Convênio Municipal Saúde 452/2025', fundingSource: 'Prefeitura SP', totalValue: 500000, balance: 125400, startDate: '01/01/2026', endDate: '31/12/2026', status: 'Vigente' },
  { id: 'CONV-2026-002', name: 'Emenda Parlamentar Educação', fundingSource: 'Governo Federal', totalValue: 250000, balance: 250000, startDate: '01/03/2026', endDate: '28/02/2027', status: 'Vigente' },
  { id: 'CONV-2025-015', name: 'Doação Empresa Parceira X', fundingSource: 'Privado', totalValue: 50000, balance: 5400, startDate: '01/07/2025', endDate: '30/06/2026', status: 'Vigente' },
];

export const mockSuppliers: Supplier[] = [
  { id: 'FOR-001', name: 'Papelaria Central Ltda', cnpj: '12.345.678/0001-90', category: 'Escritório', rating: 4.8, status: 'Ativo', contact: 'Marcos', email: 'vendas@papelariacentral.com' },
  { id: 'FOR-002', name: 'Tech Solutions S.A.', cnpj: '98.765.432/0001-21', category: 'Informática', rating: 4.5, status: 'Ativo', contact: 'Julia', email: 'contato@techsolutions.com' },
  { id: 'FOR-003', name: 'Limpeza & Cia', cnpj: '45.678.901/0001-34', category: 'Serviços', rating: 3.9, status: 'Ativo', contact: 'Roberto', email: 'atendimento@limpezacia.com' },
  { id: 'FOR-004', name: 'Construtora Silva', cnpj: '11.222.333/0001-44', category: 'Obras', rating: 4.2, status: 'Bloqueado', contact: 'Carlos', email: 'obras@construtorasilva.com' },
];

export const mockItemMaster: ItemMaster[] = [
  { id: 'ITM-001', description: 'Papel A4 Branco 75g', type: 'Material de Consumo', category: 'Escritório', unit: 'Resma', status: 'Ativo', lastPrice: 28.50 },
  { id: 'ITM-002', description: 'Notebook i5 16GB SSD 512GB', type: 'Ativo Imobilizado', category: 'Informática', unit: 'Unidade', status: 'Ativo', lastPrice: 4200.00 },
  { id: 'ITM-003', description: 'Manutenção Preventiva Ar Condicionado', type: 'Serviço', category: 'Manutenção', unit: 'Serviço', status: 'Ativo', lastPrice: 350.00 },
  { id: 'ITM-004', description: 'Cesta Básica Tipo 1', type: 'Estoque', category: 'Alimentos', unit: 'Unidade', status: 'Ativo', lastPrice: 185.00 },
];

export const mockApprovalThresholds: ApprovalThreshold[] = [
  { id: 'THR-001', role: 'Gestor', minValue: 0, maxValue: 5000, module: 'Solicitação', status: 'Ativo' },
  { id: 'THR-002', role: 'Diretor', minValue: 5000.01, maxValue: 50000, module: 'Solicitação', status: 'Ativo' },
  { id: 'THR-003', role: 'Conselho', minValue: 50000.01, maxValue: 9999999, module: 'Solicitação', status: 'Ativo' },
];

export const mockTransfers: Transfer[] = [
  {
    id: 'TRF-2026-001',
    originUnit: 'Matriz',
    destinationUnit: 'Unidade 2',
    requester: 'Ana Silva',
    requestDate: '01/04/2026',
    itemType: 'Material de Escritório',
    totalItems: 50,
    status: 'Em trânsito',
    arrivalForecast: '03/04/2026',
    items: [
      { code: 'MAT-001', description: 'Papel A4 Branco 75g', type: 'Material de Consumo', requestedQuantity: 50, sentQuantity: 50, receivedQuantity: 0 }
    ],
    history: [
      { date: '01/04/2026 09:00', user: 'Ana Silva', action: 'Transferência solicitada' },
      { date: '01/04/2026 14:00', user: 'Ricardo Almoxarife', action: 'Estoque separado na unidade origem' },
      { date: '02/04/2026 10:00', user: 'Ricardo Almoxarife', action: 'Material enviado' }
    ],
    justification: 'Falta de estoque na Unidade 2 para o projeto Inclusão Digital.'
  },
  {
    id: 'TRF-2026-002',
    originUnit: 'Unidade 3',
    destinationUnit: 'Matriz',
    requester: 'Carlos Santos',
    requestDate: '31/03/2026',
    itemType: 'Limpeza',
    totalItems: 20,
    status: 'Recebida',
    arrivalForecast: '01/04/2026',
    items: [
      { code: 'LIM-005', description: 'Detergente Neutro 5L', type: 'Material de Consumo', requestedQuantity: 20, sentQuantity: 20, receivedQuantity: 18, observations: '2 frascos com vazamento' }
    ],
    history: [
      { date: '31/03/2026 08:30', user: 'Carlos Santos', action: 'Transferência solicitada' },
      { date: '31/03/2026 11:00', user: 'João Silva', action: 'Estoque separado na unidade origem' },
      { date: '31/03/2026 16:00', user: 'João Silva', action: 'Material enviado' },
      { date: '01/04/2026 09:15', user: 'Ricardo Almoxarife', action: 'Material recebido' },
      { date: '01/04/2026 10:00', user: 'Ricardo Almoxarife', action: 'Conferência concluída' }
    ],
    justification: 'Reposição emergencial de material de limpeza.',
    divergenceNotes: 'Divergência de 2 unidades devido a danos no transporte.',
    receivingDate: '01/04/2026',
    receiverName: 'Ricardo Almoxarife'
  },
  {
    id: 'TRF-2026-003',
    originUnit: 'Matriz',
    destinationUnit: 'Unidade 3',
    requester: 'Juliana Costa',
    requestDate: '01/04/2026',
    itemType: 'Informática',
    totalItems: 2,
    status: 'Solicitada',
    arrivalForecast: '05/04/2026',
    items: [
      { code: 'ITM-002', description: 'Notebook i5 16GB', type: 'Ativo Imobilizado', requestedQuantity: 2, sentQuantity: 0, receivedQuantity: 0 }
    ],
    history: [
      { date: '01/04/2026 15:00', user: 'Juliana Costa', action: 'Transferência solicitada' }
    ],
    justification: 'Novos funcionários na Unidade 3.'
  }
];

export const mockStockItems: StockItem[] = [
  {
    id: 'ITM-001',
    description: 'Papel A4 Branco 75g',
    type: 'Material de Consumo',
    category: 'Escritório',
    unit: 'Resma',
    status: 'Ativo',
    balances: [
      { unit: 'Matriz', balance: 150, minStock: 50, status: 'Normal' },
      { unit: 'Unidade 2', balance: 12, minStock: 20, status: 'Baixo' },
      { unit: 'Unidade 3', balance: 0, minStock: 10, status: 'Sem saldo' }
    ]
  },
  {
    id: 'ITM-002',
    description: 'Notebook i5 16GB SSD 512GB',
    type: 'Ativo Imobilizado',
    category: 'Informática',
    unit: 'Unidade',
    status: 'Ativo',
    balances: [
      { unit: 'Matriz', balance: 5, minStock: 2, status: 'Normal' },
      { unit: 'Unidade 3', balance: 2, minStock: 1, status: 'Normal' }
    ]
  },
  {
    id: 'ITM-004',
    description: 'Cesta Básica Tipo 1',
    type: 'Estoque',
    category: 'Alimentos',
    unit: 'Unidade',
    status: 'Ativo',
    balances: [
      { unit: 'Matriz', balance: 500, minStock: 100, status: 'Normal' },
      { unit: 'Unidade 2', balance: 80, minStock: 100, status: 'Baixo' }
    ]
  },
  {
    id: 'LIM-005',
    description: 'Detergente Neutro 5L',
    type: 'Material de Consumo',
    category: 'Limpeza',
    unit: 'Galao',
    status: 'Ativo',
    balances: [
      { unit: 'Unidade 3', balance: 45, minStock: 15, status: 'Normal' }
    ]
  }
];

export const mockMovements: StockMovement[] = [
  {
    id: 'MOV-001',
    date: '01/04/2026 10:30',
    type: 'Entrada por compra',
    itemCode: 'ITM-001',
    itemDescription: 'Papel A4 Branco 75g',
    destinationUnit: 'Matriz',
    quantity: 100,
    relatedDocument: 'OC-2026-045',
    responsible: 'Ricardo Almoxarife',
    status: 'Concluído'
  },
  {
    id: 'MOV-002',
    date: '01/04/2026 14:20',
    type: 'Saída para consumo',
    itemCode: 'ITM-001',
    itemDescription: 'Papel A4 Branco 75g',
    originUnit: 'Matriz',
    quantity: 10,
    relatedDocument: 'REQ-882',
    responsible: 'Ana Silva',
    status: 'Concluído'
  },
  {
    id: 'MOV-003',
    date: '02/04/2026 09:15',
    type: 'Transferência entre unidades',
    itemCode: 'MAT-001',
    itemDescription: 'Papel A4 Branco 75g',
    originUnit: 'Matriz',
    destinationUnit: 'Unidade 2',
    quantity: 50,
    relatedDocument: 'TRF-2026-001',
    responsible: 'Ricardo Almoxarife',
    status: 'Em trânsito'
  },
  {
    id: 'MOV-004',
    date: '31/03/2026 16:00',
    type: 'Ajuste de inventário',
    itemCode: 'LIM-005',
    itemDescription: 'Detergente Neutro 5L',
    originUnit: 'Unidade 3',
    quantity: -2,
    relatedDocument: 'INV-2026-001',
    responsible: 'João Silva',
    status: 'Concluído',
    observations: 'Divergência encontrada no inventário trimestral.'
  }
];

export const mockInventories: Inventory[] = [
  {
    id: 'INV-2026-001',
    unit: 'Unidade 3',
    responsible: 'João Silva',
    startDate: '31/03/2026',
    status: 'Concluído',
    itemsChecked: 45
  },
  {
    id: 'INV-2026-002',
    unit: 'Matriz',
    responsible: 'Ricardo Almoxarife',
    startDate: '01/04/2026',
    status: 'Em conferência',
    itemsChecked: 120
  }
];

export const mockAdjustments: StockAdjustment[] = [
  {
    id: 'AJU-001',
    date: '31/03/2026 16:00',
    itemCode: 'LIM-005',
    itemDescription: 'Detergente Neutro 5L',
    unit: 'Unidade 3',
    previousBalance: 47,
    adjustedBalance: 45,
    reason: 'Avaria / Vazamento',
    responsible: 'João Silva'
  }
];

