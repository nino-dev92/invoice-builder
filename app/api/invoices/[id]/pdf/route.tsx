import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import InvoiceDocument from "@/components/InvoiceDocument";
import { InvoiceData } from "@/models/Invoice";

// Handles: GET /api/invoices/<some-id>/pdf
// The [id] folder name means Next.js captures whatever is in that
// position of the URL and hands it to us as `params.id`.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await connectDB();
  const invoice = await Invoice.findById(id).lean();

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // renderToBuffer takes our React component and turns it into the
  // raw bytes of an actual PDF file — this is the same InvoiceDocument
  // component we'll reuse for the live preview later.
  const pdfBuffer = await renderToBuffer(
    <InvoiceDocument data={invoice as unknown as InvoiceData} />,
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.docNumber || "document"}.pdf"`,
    },
  });
}
