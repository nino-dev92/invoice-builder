import Link from "next/link";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import { computeTotals } from "@/lib/types";
import { InvoiceData } from "@/models/Invoice";

// Notice: no "use client" here, and no useState/useEffect.
// This component runs ONLY on the server, and can `await` the database
// directly in the component body. The browser just receives plain HTML.
export default async function InvoicesPage() {
  await connectDB();

  // .lean() returns plain JavaScript objects instead of heavier Mongoose
  // documents — a bit faster, and all we need for just displaying data.
  const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">History</h1>
        <Link
          href="/new"
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          + New
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices or receipts yet.</p>
      ) : (
        <div className="flex flex-col divide-y rounded border">
          {invoices.map((inv) => {
            const { total } = computeTotals(inv as unknown as InvoiceData);
            return (
              <div
                key={String(inv._id)}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">
                    {inv.docNumber} · {inv.clientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {inv.docType === "invoice" ? "Invoice" : "Receipt"} ·{" "}
                    {inv.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {inv.currency} {total.toFixed(2)}
                  </span>
                  {/* A plain <a>, not <Link> — this triggers a file
                      download rather than an in-app page navigation. */}

                  <a
                    href={`/api/invoices/${inv._id}/pdf`}
                    className="text-sm text-blue-600 hover:underline"
                  >
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
