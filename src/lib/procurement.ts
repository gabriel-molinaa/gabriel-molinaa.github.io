import { PurchaseRequest, PurchaseRequestItem, StockItem, UrgencyLevel } from '@/src/types/procurement';

export interface ItemFulfillmentPlan {
  stockQuantity: number;
  purchaseQuantity: number;
  availableStock: number;
  status: 'Estoque' | 'Pedido de compra' | 'Misto';
}

export interface RequestFulfillmentSummary {
  stockItems: number;
  purchaseItems: number;
  mixedItems: number;
}

export function normalizeUrgency(value?: string): UrgencyLevel {
  if (value === 'Emergencial') {
    return 'Urgente';
  }

  return value === 'Urgente' ? 'Urgente' : 'Normal';
}

export function isValidReferenceUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function planItemFulfillment(
  item: Pick<PurchaseRequestItem, 'quantity' | 'code' | 'description'>,
  unit: string,
  stockItems: StockItem[]
): ItemFulfillmentPlan {
  const normalizedCode = item.code?.trim().toLowerCase();
  const normalizedDescription = item.description.trim().toLowerCase();

  const stockItem = stockItems.find((candidate) => {
    const sameCode = normalizedCode && candidate.id.trim().toLowerCase() === normalizedCode;
    const candidateDescription = candidate.description.trim().toLowerCase();
    const sameDescription =
      candidateDescription === normalizedDescription ||
      candidateDescription.includes(normalizedDescription) ||
      normalizedDescription.includes(candidateDescription);
    return sameCode || sameDescription;
  });

  const availableStock = stockItem?.balances.find((balance) => balance.unit === unit)?.balance ?? 0;
  const requestedQuantity = Math.max(0, Number(item.quantity) || 0);
  const stockQuantity = Math.min(availableStock, requestedQuantity);
  const purchaseQuantity = Math.max(0, requestedQuantity - stockQuantity);

  return {
    stockQuantity,
    purchaseQuantity,
    availableStock,
    status:
      purchaseQuantity === 0
        ? 'Estoque'
        : stockQuantity === 0
          ? 'Pedido de compra'
          : 'Misto',
  };
}

export function enrichRequestItemsWithFulfillment(request: PurchaseRequest, stockItems: StockItem[]): PurchaseRequest {
  return {
    ...request,
    urgency: normalizeUrgency(request.urgency),
    items: request.items.map((item) => {
      const fulfillment = planItemFulfillment(item, request.unit, stockItems);

      return {
        ...item,
        stockQuantity: fulfillment.stockQuantity,
        purchaseQuantity: fulfillment.purchaseQuantity,
      };
    }),
  };
}

export function getRequestFulfillmentSummary(request: PurchaseRequest): RequestFulfillmentSummary {
  return request.items.reduce<RequestFulfillmentSummary>(
    (summary, item) => {
      const stockQuantity = item.stockQuantity ?? 0;
      const purchaseQuantity = item.purchaseQuantity ?? 0;

      if (stockQuantity > 0 && purchaseQuantity > 0) {
        summary.mixedItems += 1;
      } else if (stockQuantity > 0) {
        summary.stockItems += 1;
      } else {
        summary.purchaseItems += 1;
      }

      return summary;
    },
    { stockItems: 0, purchaseItems: 0, mixedItems: 0 }
  );
}

export function getRequestPlanningFlag(request: PurchaseRequest): 'Estoque' | 'Compra' | 'Misto' {
  const summary = getRequestFulfillmentSummary(request);

  if (summary.mixedItems > 0 || (summary.stockItems > 0 && summary.purchaseItems > 0)) {
    return 'Misto';
  }

  if (summary.stockItems > 0 && summary.purchaseItems === 0) {
    return 'Estoque';
  }

  return 'Compra';
}