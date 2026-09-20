import { LineItem } from "@/models/Invoice";
import { InvoiceData } from "@/models/Invoice";

export type DocType = "invoice" | "receipt";

export function lineTotal(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function computeTotals(
  data: Pick<InvoiceData, "items" | "taxRate" | "discount">,
) {
  const sub = subtotal(data.items);
  const taxAmount = (sub - data.discount) * (data.taxRate / 100);
  const total = sub - data.discount + taxAmount;
  return { sub, taxAmount, total };
}
