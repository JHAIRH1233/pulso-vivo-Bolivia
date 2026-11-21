import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PULSO VIVO Bolivia',
  description: 'Comunicacion institucional clara e inclusiva',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
