export type RequestStatus = 
  | 'Rascunho'
  | 'Em análise'
  | 'Aguardando aprovação'
  | 'Retornada para ajuste'
  | 'Aprovada'
  | 'Rejeitada'
  | 'Em cotação'
  | 'Convertida em pedido';

export type UrgencyLevel = 'Normal' | 'Urgente' | 'Emergencial';

export type PurchaseType = 'Material de Consumo' | 'Estoque' | 'Ativo Imobilizado' | 'Serviço';

export interface PurchaseRequestItem {
  id: string;
  type: PurchaseType;
  code?: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedValue: number;
  expectedDate: string;
  deliveryLocation: string;
}

export interface PurchaseRequest {
  id: string;
  date: string;
  requester: string;
  unit: string;
  sector: string;
  project: string;
  costCenter: string;
  agreement?: string;
  fundingSource?: string;
  workPlan?: string;
  budgetCategory?: string;
  items: PurchaseRequestItem[];
  justification: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  history: {
    date: string;
    user: string;
    action: string;
    comment?: string;
  }[];
}

export interface SupplierQuotation {
  id: string;
  name: string;
  unitPrice: number;
  totalPrice: number;
  deliveryTime: string;
  paymentTerms: string;
  technicalCompliance: boolean;
  isWinner?: boolean;
  justification?: string;
}

export interface Quotation {
  id: string;
  requestId: string;
  status: 'Em Aberto' | 'Em Análise' | 'Finalizada';
  suppliers: SupplierQuotation[];
}

export interface PurchaseOrder {
  id: string;
  date: string;
  supplier: string;
  requests: string[]; // IDs of original requests
  fundingSource: string;
  paymentCondition: string;
  totalValue: number;
  expectedDelivery: string;
  status: 'Pendente' | 'Emitida' | 'Recebida' | 'Cancelada' | 'Recebimento Parcial';
  items: {
    description: string;
    quantity: number;
    receivedQuantity: number;
    unitPrice: number;
  }[];
}

export interface Invoice {
  id: string;
  orderId: string;
  number: string;
  series: string;
  issueDate: string;
  totalValue: number;
  xmlFile?: string;
  pdfFile?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  invoiceId: string;
  supplier: string;
  totalValue: number;
  status: 'Pendente' | 'Pago Parcialmente' | 'Pago' | 'Atrasado';
  installments: {
    number: number;
    dueDate: string;
    value: number;
    status: 'Pendente' | 'Pago';
    paymentDate?: string;
  }[];
}

export interface AuditLog {
  id: string;
  processId?: string;
  module: string;
  action: string;
  user: string;
  timestamp: string;
  target: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Ativo' | 'Inativo';
  lastAccess?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export interface Project {
  id: string;
  name: string;
  costCenter: string;
  manager: string;
  status: 'Ativo' | 'Inativo';
}

export interface Agreement {
  id: string;
  name: string;
  fundingSource: string;
  totalValue: number;
  balance: number;
  startDate: string;
  endDate: string;
  status: 'Vigente' | 'Encerrado' | 'Suspenso';
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  category: string;
  rating: number;
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
  contact: string;
  email: string;
}

export interface ItemMaster {
  id: string;
  description: string;
  type: PurchaseType;
  category: string;
  unit: string;
  status: 'Ativo' | 'Inativo';
  lastPrice?: number;
}

export interface StockBalance {
  unit: string;
  balance: number;
  minStock: number;
  status: 'Normal' | 'Baixo' | 'Sem saldo';
}

export interface StockItem extends ItemMaster {
  balances: StockBalance[];
}

export type MovementType = 
  | 'Entrada por compra' 
  | 'Entrada por doação' 
  | 'Saída para consumo' 
  | 'Transferência entre unidades' 
  | 'Ajuste de inventário' 
  | 'Baixa' 
  | 'Devolução';

export interface StockMovement {
  id: string;
  date: string;
  type: MovementType;
  itemCode: string;
  itemDescription: string;
  originUnit?: string;
  destinationUnit?: string;
  quantity: number;
  relatedDocument?: string;
  responsible: string;
  status: string;
  observations?: string;
}

export interface Inventory {
  id: string;
  unit: string;
  responsible: string;
  startDate: string;
  status: 'Em aberto' | 'Em conferência' | 'Concluído' | 'Cancelado';
  itemsChecked: number;
}

export interface StockAdjustment {
  id: string;
  date: string;
  itemCode: string;
  itemDescription: string;
  unit: string;
  previousBalance: number;
  adjustedBalance: number;
  reason: string;
  responsible: string;
}

export type TransferStatus = 'Solicitada' | 'Aguardando separação' | 'Em trânsito' | 'Recebida' | 'Cancelada';

export interface TransferItem {
  code: string;
  description: string;
  type: string;
  requestedQuantity: number;
  sentQuantity: number;
  receivedQuantity: number;
  observations?: string;
}

export interface Transfer {
  id: string;
  originUnit: string;
  destinationUnit: string;
  requester: string;
  requestDate: string;
  itemType: string;
  totalItems: number;
  status: TransferStatus;
  arrivalForecast: string;
  items: TransferItem[];
  history: {
    date: string;
    user: string;
    action: string;
  }[];
  justification: string;
  operationalNotes?: string;
  divergenceNotes?: string;
  receivingDate?: string;
  receiverName?: string;
}

export interface ApprovalThreshold {
  id: string;
  role: string;
  minValue: number;
  maxValue: number;
  module: 'Solicitação' | 'Compras';
  status: 'Ativo' | 'Inativo';
}
