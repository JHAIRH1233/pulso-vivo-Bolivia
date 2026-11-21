import type { Metadata } from 'next';
import { AppShell } from '../shared/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'PULSO VIVO Bolivia',
  description: 'Comunicación institucional clara, inclusiva y accesible',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
