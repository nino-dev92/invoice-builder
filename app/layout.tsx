import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Invoice & Receipt Generator",
  description: "Generate invoices and receipts as PDFs",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* ThemeProvider is a Client Component, but a Server Component
            (this file) can still render it as a child — the boundary
            only matters for passing non-serializable props down,
            not for nesting JSX like this. */}
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
