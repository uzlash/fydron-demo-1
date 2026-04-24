export type InvoiceStatus = "success" | "failed" | "pending";

export type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  date: string;
  amount: string;
};

export type SubscriptionOverview = {
  suiteName: string;
  isActive: boolean;
  statusLabel: string;
  activeClients: number;
  activeDossiers: number;
};

export type BillingData = {
  overview: SubscriptionOverview;
  invoices: InvoiceRow[];
};
