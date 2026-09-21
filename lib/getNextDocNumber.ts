// import Invoice from "@/models/Invoice";
import { DocType } from "@/lib/types";
import Invoice from "@/models/Invoice";

const PREFIXES: Record<DocType, string> = {
  invoice: "INV",
  receipt: "RCT",
};

export async function getNextDocNumber(docType: DocType): Promise<string> {
  const count = await Invoice.countDocuments({ docType });
  const padded = String(count + 1).padStart(4, "0");
  return `${PREFIXES[docType]}-${padded}`;
}
