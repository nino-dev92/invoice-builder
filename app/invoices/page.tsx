import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import InvoiceList from "@/components/InvoiceList";

export const dynamic = "force-dynamic";

// Still a Server Component: fetches once, on the server, then hands
// the data down as props to a Client Component for the interactive part.
export default async function InvoicesPage() {
  await connectDB();

  const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();

  // Props passed from a Server Component to a Client Component must be
  // plain, serializable data — no Mongoose ObjectId instances, no Date
  // objects. JSON.stringify + JSON.parse strips both down to plain
  // strings, which is all InvoiceList actually needs.
  const plainInvoices = JSON.parse(JSON.stringify(invoices));

  return <InvoiceList invoices={plainInvoices} />;
}
