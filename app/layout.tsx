import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CyberTech Portal | IT Troubleshooting Guides & Diagnostics",
  description: "117 IT troubleshooting guides across 10 technical domains. Step-by-step fixes for Windows, macOS, Linux, networking, security, and hardware — with copy-ready terminal commands.",
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
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CyberTech Portal | IT Troubleshooting Guides",
    description: "117 step-by-step IT guides with terminal commands for Windows, macOS, Linux, networking, security, and hardware.",
    type: "website",
    url: "https://fixit.cybertechcomps.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#f0f0f5] dark:bg-stone-950 text-[#333333] dark:text-stone-100 antialiased selection:bg-[#4a90e2] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
