import { mockRequests, mockStockItems } from '@/src/types/mockData';
import { PurchaseRequest } from '@/src/types/procurement';
import { enrichRequestItemsWithFulfillment } from '@/src/lib/procurement';

const STORAGE_KEY = 'apae.purchaseRequests';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getSeedRequests(): PurchaseRequest[] {
  return mockRequests.map((request) => enrichRequestItemsWithFulfillment(request, mockStockItems));
}

function normalizeStoredRequests(requests: PurchaseRequest[]): PurchaseRequest[] {
  return requests.map((request) => enrichRequestItemsWithFulfillment(request, mockStockItems));
}

export function getPurchaseRequests(): PurchaseRequest[] {
  if (!canUseStorage()) {
    return getSeedRequests();
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    const seededRequests = getSeedRequests();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededRequests));
    return seededRequests;
  }

  try {
    return normalizeStoredRequests(JSON.parse(storedValue) as PurchaseRequest[]);
  } catch {
    const seededRequests = getSeedRequests();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededRequests));
    return seededRequests;
  }
}

export function getPurchaseRequestById(id?: string): PurchaseRequest | undefined {
  if (!id) {
    return undefined;
  }

  return getPurchaseRequests().find((request) => request.id === id);
}

export function savePurchaseRequest(request: PurchaseRequest): PurchaseRequest {
  const requests = getPurchaseRequests();
  const normalizedRequest = enrichRequestItemsWithFulfillment(request, mockStockItems);
  const requestIndex = requests.findIndex((currentRequest) => currentRequest.id === normalizedRequest.id);
  const nextRequests = requestIndex >= 0
    ? requests.map((currentRequest, index) => (index === requestIndex ? normalizedRequest : currentRequest))
    : [normalizedRequest, ...requests];

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRequests));
  }

  return normalizedRequest;
}

export function generatePurchaseRequestId(): string {
  const requests = getPurchaseRequests();
  const nextNumber = requests.length + 1;
  return `SOL-2026-${String(nextNumber).padStart(3, '0')}`;
}