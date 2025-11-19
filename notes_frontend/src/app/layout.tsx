import type { Metadata } from "next";
import "./globals.css";
import "./ocean-global.css";

export const metadata: Metadata = {
  title: "Ocean Notes",
  description: "A modern personal notes app"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{background:"#f9fafb"}}>
        {children}
      </body>
    </html>
  );
}
