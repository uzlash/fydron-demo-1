import { delay } from "@/utils/helpers";
import type { BillingData, InvoiceStatus } from "@/features/billing/types";

const statuses: InvoiceStatus[] = [
  "success",
  "failed",
  "success",
  "pending",
  "success",
  "failed",
  "pending",
  "pending",
  "success",
  "failed",
  "success",
];

const billingData: BillingData = {
  overview: {
    suiteName: "Premium Audit Suite",
    isActive: true,
    statusLabel: "Active Subscription",
    activeClients: 45,
    activeDossiers: 65,
  },
  // Figma: one invoice id column pattern; vary status only
  invoices: statuses.map((status, i) => ({
    id: String(i + 1),
    invoiceNumber: "INV001",
    status,
    date: "12-05-2026",
    amount: "€250.00",
  })),
};

export async function fetchBillingData(): Promise<BillingData> {
  await delay(450);
  return billingData;
}
