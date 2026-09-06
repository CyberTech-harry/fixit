import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CyberTech Portal | Full-Stack IT Knowledge Base & Diagnostics",
  description: "Enterprise IT documentation and troubleshooting portal spanning 10 core domains, 117+ interactive guides, terminal commands, and telemetry diagnostics.",
  keywords: [
    "IT Troubleshooting",
    "Windows Fixes",
    "macOS Optimization",
    "Networking Diagnostic",
    "BSOD Error Codes",
    "DNS Flush",
    "Security Best Practices",
    "SysAdmin Scripts"
  ],
  authors: [{ name: "CyberTech IT Engineering Team" }],
  openGraph: {
    title: "CyberTech Portal | Full-Stack IT Knowledge Base",
    description: "Instant sub-100ms access to 117+ production-grade IT troubleshooting workflows, checklists, and commands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
