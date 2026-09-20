import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import path from "path";
import { computeTotals } from "@/lib/types";
import { InvoiceData } from "@/models/Invoice";

// react-pdf renders on the server, not in a browser — so instead of a
// URL like "/logo.png", it needs an actual file path on disk.
const logoPath = path.join(process.cwd(), "public", "logo.png");

// These are like CSS, but only the properties react-pdf supports.
// Flexbox works here the same way it does on the web.
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  docNumber: { fontSize: 11, color: "#555", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  section: { marginBottom: 20 },
  label: { color: "#888", fontSize: 9, marginBottom: 2 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 700,
  },
  tableRow: { flexDirection: "row", paddingVertical: 3 },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totals: { marginTop: 16, alignSelf: "flex-end", width: 200 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  grandTotal: { fontWeight: 700, fontSize: 13, marginTop: 4 },
});

// This is the one template used for both invoices and receipts.
// It's a plain function component — the only difference from a normal
// React component is which tags we use (Document/Page/View/Text
// instead of div/span/p).
export default function InvoiceDocument({ data }: { data: InvoiceData }) {
  const { sub, taxAmount, total } = computeTotals(data);
  const isInvoice = data.docType === "invoice";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoPath} style={{ width: 100, marginBottom: 16 }} />
        <Text style={styles.title}>{isInvoice ? "Invoice" : "Receipt"}</Text>
        <Text style={styles.docNumber}>{data.docNumber}</Text>

        <View style={[styles.row, styles.section]}>
          <View>
            <Text style={styles.label}>FROM</Text>
            <Text>{data.businessName}</Text>
            {data.businessAddress ? <Text>{data.businessAddress}</Text> : null}
            {data.businessEmail ? <Text>{data.businessEmail}</Text> : null}
          </View>
          <View>
            <Text style={styles.label}>BILL TO</Text>
            <Text>{data.clientName}</Text>
            {data.clientAddress ? <Text>{data.clientAddress}</Text> : null}
            {data.clientEmail ? <Text>{data.clientEmail}</Text> : null}
          </View>
          <View>
            <Text style={styles.label}>DATE</Text>
            <Text>{data.date}</Text>
            {isInvoice && data.dueDate ? (
              <>
                <Text style={[styles.label, { marginTop: 6 }]}>DUE DATE</Text>
                <Text>{data.dueDate}</Text>
              </>
            ) : null}
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDescription}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {data.items.map((item: any, i: any) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>
              {data.currency} {item.unitPrice.toFixed(2)}
            </Text>
            <Text style={styles.colTotal}>
              {data.currency} {(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>
              {data.currency} {sub.toFixed(2)}
            </Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.totalsRow}>
              <Text>Discount</Text>
              <Text>
                -{data.currency} {data.discount.toFixed(2)}
              </Text>
            </View>
          )}
          {data.taxRate > 0 && (
            <View style={styles.totalsRow}>
              <Text>Tax ({data.taxRate}%)</Text>
              <Text>
                {data.currency} {taxAmount.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={[styles.totalsRow, styles.grandTotal]}>
            <Text>Total</Text>
            <Text>
              {data.currency} {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Receipt-only: how much was actually paid */}
        {!isInvoice && (
          <View style={{ marginTop: 20 }}>
            <Text>
              Amount paid: {data.currency} {(data.amountPaid ?? 0).toFixed(2)}
            </Text>
            {data.paymentMethod ? (
              <Text>Payment method: {data.paymentMethod}</Text>
            ) : null}
          </View>
        )}

        {data.notes ? (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.label}>NOTES</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
