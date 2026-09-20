import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import { getNextDocNumber } from "@/lib/getNextDocNumber";

// Handles: GET /api/invoices
export async function GET() {
  await connectDB();
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  return NextResponse.json(invoices);
}

// Handles: POST /api/invoices
export async function POST(request: NextRequest) {
  await connectDB();

  const data = await request.json();

  // The number is assigned here on the server, not trusted from the
  // form — that's what keeps it guaranteed-unique and sequential.
  data.docNumber = await getNextDocNumber(data.docType);

  const invoice = await Invoice.create(data);
  return NextResponse.json(invoice, { status: 201 });
}
