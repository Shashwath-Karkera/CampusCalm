import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { EntryLoader } from "@/components/entry-loader";

export const metadata: Metadata = {
  title: "CampusCalm - Student Stress Prediction",
  description: "AI powered student stress level prediction using ML with Next.js + NeonDB + Python",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <EntryLoader>{children}</EntryLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
