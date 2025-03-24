import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import Background from "@/components/Background";

// Configure Roboto font
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "DocBoard - Medical Dashboard",
  description: "Medical appointment and patient management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <Background />
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
