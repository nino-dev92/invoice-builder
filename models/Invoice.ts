import mongoose, { Schema, models, model } from "mongoose";
import { DocType } from "@/lib/types";

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  docType: DocType;
  docNumber: string;
  date: string; // ISO date string
  dueDate?: string; // invoices only

  businessName: string;
  businessAddress?: string;
  businessEmail?: string;

  clientName: string;
  clientAddress?: string;
  clientEmail?: string;

  items: LineItem[];

  taxRate: number; // percentage, e.g. 7.5
  discount: number; // flat amount
  currency: string; // e.g. "USD", "NGN"
  notes?: string;

  amountPaid?: number; // receipts only
  paymentMethod?: string; // receipts only

  createdAt?: string;
}

const LineItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false },
);

const InvoiceSchema = new Schema(
  {
    docType: { type: String, enum: ["invoice", "receipt"], required: true },
    docNumber: { type: String, required: true },
    date: { type: String, required: true },
    dueDate: { type: String },

    businessName: { type: String, required: true },
    businessAddress: { type: String },
    businessEmail: { type: String },

    clientName: { type: String, required: true },
    clientAddress: { type: String },
    clientEmail: { type: String },

    items: { type: [LineItemSchema], required: true },

    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    notes: { type: String },

    amountPaid: { type: Number },
    paymentMethod: { type: String },
  },
  { timestamps: true },
);

export type InvoiceDoc = mongoose.InferSchemaType<typeof InvoiceSchema>;

export default models.Invoice || model("Invoice", InvoiceSchema);
