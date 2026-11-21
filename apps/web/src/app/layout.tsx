import type { Metadata } from 'next';
import { AppShell } from '../shared/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rimay | Tu idioma. Tu voz. Tu municipio.',
  description:
    'Prototipo de comunicación pública clara en español y palabras simples; el quechua está en desarrollo.',
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
