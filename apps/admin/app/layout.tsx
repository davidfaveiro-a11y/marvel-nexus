import type { Metadata } from "next";
import { AdminAuthGate } from "../components/AdminAuthGate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marvel Nexus Admin",
  description: "Administration privee du jeu de collection",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <AdminAuthGate>{children}</AdminAuthGate>
      </body>
    </html>
  );
}
