import type { ReactNode } from 'react';

export interface AllocatedOrder {
  orderNumber: string;
  orderLine: string;
  orderSupplier: string;
  allocatedQuantity: number;
  orderCreatedBy: string;
}

export interface AviationPart {
  requirementNumber: string;
  worksOrder: string;
  aircraft: string;
  partNumber: string;
  stockGroup: string;
  partDescription: string;
  requiredQty: number;
  shortageQty: number;
  onOrderQty: number;
  onPickQty: number;
  issuedQty: number;
  returnedQty: number;
  priority: 'High' | 'Medium' | 'Low';
  targetDate: string;
  thirdPartyRef: string;
  remarks: string;
  requestedBy: string;
  createdBy: string;
  unAllocatedQty: number;
  deferredDefect: string;
  stockQtyAvailable: number;
  ipcReference: string;
  originalRequestedPart: string;
  buyersNotes: string;
  allocatedOrders: AllocatedOrder[];
  workCardNumber: string;
  workCardMaterialNote: string;
  requirementAuthorised: 'Approved' | 'Pending' | 'Rejected';
  value: string;
  createdDate: string;
  woAccountCode: string;
  robberyIndicator: string;
  robberyRequirementNumber: string;
}

export interface FilterOptions {
  priority?: string[];
  aircraft?: string[];
  stockGroup?: string[];
  requirementAuthorised?: string[];
}

export interface SortOptions {
  field: keyof AviationPart;
  direction: 'asc' | 'desc';
}

export interface TableColumn {
  key: keyof AviationPart;
  title: string;
  sortable?: boolean;
  render?: (value: AviationPart[keyof AviationPart], part: AviationPart) => ReactNode;
}
