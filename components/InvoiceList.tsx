"use client"; // needs useState, so it runs in the browser

import { useState } from "react";
import Link from "next/link";
import { computeTotals, DocType } from "@/lib/types";
import { InvoiceData } from "@/models/Invoice";

type Filter = "all" | DocType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "invoice", label: "Invoices" },
  { value: "receipt", label: "Receipts" },
];

export default function InvoiceList({ invoices }: { invoices: InvoiceData[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = invoices.filter((inv) => {
    const matchesType = filter === "all" || inv.docType === filter;

    const term = search.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      inv.clientName.toLowerCase().includes(term) ||
      inv.date.includes(term);

    return matchesType && matchesSearch;
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">History</h1>
        <Link
          href="/new"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-500 dark:bg-gray-800"
        >
          + New
        </Link>
      </div>

      {/* Filter + search controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Segmented pill control instead of bare radio inputs */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900">
          {FILTERS.map((f) => (
            <label
              key={f.value}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-white text-black shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <input
                type="radio"
                name="filter"
                className="sr-only" // visually hidden, but still accessible/keyboard-usable
                checked={filter === f.value}
                onChange={() => setFilter(f.value)}
              />
              {f.label}
            </label>
          ))}
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search client or date..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No invoices or receipts yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No results match your filters.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((inv: any) => {
            const { total } = computeTotals(inv);
            const isInvoice = inv.docType === "invoice";
            return (
              <div
                key={inv._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isInvoice
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                    }`}
                  >
                    {isInvoice ? "Invoice" : "Receipt"}
                  </span>
                  <div>
                    <p className="font-medium">
                      {inv.docNumber} · {inv.clientName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {inv.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {inv.currency} {total.toFixed(2)}
                  </span>
                  <a
                    href={`/api/invoices/${inv._id}/pdf`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {" "}
                    Download PDF
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
