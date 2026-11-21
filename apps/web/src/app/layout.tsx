import type { Metadata } from 'next';
import { AppShell } from '../shared/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'PULSO VIVO Bolivia | Información pública clara',
  description:
    'Consulta comunicados de demostración y participa con preguntas en PULSO VIVO Bolivia.',
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
