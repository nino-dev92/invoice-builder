"use client"; // This page needs useState and onClick, so it must run in the browser.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { computeTotals } from "@/lib/types";
import { InvoiceData, LineItem } from "@/models/Invoice";

// The starting values for a brand new, empty form
const emptyInvoice: InvoiceData = {
  docType: "invoice",
  docNumber: "",
  date: new Date().toISOString().slice(0, 10), // e.g. "2026-09-19"
  dueDate: "",

  businessName: "",
  businessAddress: "",
  businessEmail: "",

  clientName: "",
  clientAddress: "",
  clientEmail: "",

  items: [{ description: "", quantity: 1, unitPrice: 0 }],

  taxRate: 0,
  discount: 0,
  currency: "USD",
  notes: "",

  amountPaid: 0,
  paymentMethod: "",
};

export default function NewInvoicePage() {
  // 1. STATE: this object holds everything the user has typed so far.
  // Whenever we call setForm(...), React re-renders with the new values.
  const [form, setForm] = useState<InvoiceData>(emptyInvoice);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // 2. HANDLERS: small functions that update one piece of `form` at a time.

  // Updates any plain text/number/date field by name.
  function updateField<K extends keyof InvoiceData>(
    field: K,
    value: InvoiceData[K],
  ) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  // Updates one field of one line item (items is an array, so this is a bit different).
  function updateItem(
    index: number,
    field: keyof LineItem,
    value: string | number,
  ) {
    setForm((prev: any) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  }

  function addItem() {
    setForm((prev: any) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
    }));
  }

  function removeItem(index: number) {
    setForm((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: any) => i !== index),
    }));
  }

  // 3. SUBMIT: send the form data to our API route, then go to the history page.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/invoices"); // navigate to the history page
    } else {
      alert("Something went wrong saving this. Please try again.");
    }
  }

  const { sub, taxAmount, total } = computeTotals(form);
  const isInvoice = form.docType === "invoice";

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Create a new document</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Document type toggle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="docType"
              checked={isInvoice}
              onChange={() => updateField("docType", "invoice")}
            />
            Invoice
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="docType"
              checked={!isInvoice}
              onChange={() => updateField("docType", "receipt")}
            />
            Receipt
          </label>
        </div>

        {/* Basic details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Document number</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.docNumber}
              onChange={(e) => updateField("docNumber", e.target.value)}
              placeholder="INV-0001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded border p-2"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              required
            />
          </div>

          {isInvoice ? (
            <div>
              <label className="block text-sm font-medium">Due date</label>
              <input
                type="date"
                className="mt-1 w-full rounded border p-2"
                value={form.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium">
                Payment method
              </label>
              <input
                className="mt-1 w-full rounded border p-2"
                value={form.paymentMethod}
                onChange={(e) => updateField("paymentMethod", e.target.value)}
                placeholder="Bank transfer, cash..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Currency</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              placeholder="USD"
            />
          </div>
        </div>

        {/* Business (you) */}
        <fieldset className="rounded border p-4">
          <legend className="px-1 text-sm font-medium">Your business</legend>
          <div className="flex flex-col gap-3">
            <input
              className="rounded border p-2"
              placeholder="Business name"
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              required
            />
            <input
              className="rounded border p-2"
              placeholder="Address"
              value={form.businessAddress}
              onChange={(e) => updateField("businessAddress", e.target.value)}
            />
            <input
              className="rounded border p-2"
              placeholder="Email"
              value={form.businessEmail}
              onChange={(e) => updateField("businessEmail", e.target.value)}
            />
          </div>
        </fieldset>

        {/* Client */}
        <fieldset className="rounded border p-4">
          <legend className="px-1 text-sm font-medium">Bill to</legend>
          <div className="flex flex-col gap-3">
            <input
              className="rounded border p-2"
              placeholder="Client name"
              value={form.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              required
            />
            <input
              className="rounded border p-2"
              placeholder="Address"
              value={form.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
            />
            <input
              className="rounded border p-2"
              placeholder="Email"
              value={form.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
            />
          </div>
        </fieldset>

        {/* Line items */}
        <fieldset className="rounded border p-4">
          <legend className="px-1 text-sm font-medium">Items</legend>
          <div className="flex flex-col gap-2">
            {form.items.map((item: any, index: any) => (
              <div key={index} className="flex gap-2">
                <input
                  className="flex-1 rounded border p-2"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="w-20 rounded border p-2"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  className="w-28 rounded border p-2"
                  placeholder="Unit price"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, "unitPrice", Number(e.target.value))
                  }
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-2 text-gray-400 hover:text-red-600"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="mt-2 self-start text-sm text-blue-600 hover:underline"
            >
              + Add item
            </button>
          </div>
        </fieldset>

        {/* Tax / discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tax rate (%)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={form.taxRate}
              onChange={(e) => updateField("taxRate", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Discount</label>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={form.discount}
              onChange={(e) => updateField("discount", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Live totals summary */}
        <div className="rounded bg-gray-50 p-4 text-sm dark:bg-black">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {form.currency} {sub.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>
              {form.currency} {taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {form.currency} {total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-black py-3 text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving..." : `Save ${isInvoice ? "invoice" : "receipt"}`}
        </button>
      </form>
    </main>
  );
}
