import type { Metadata } from 'next';
import './globals.css';
import { SiteLayout } from '../shared/components/site-layout';

export const metadata: Metadata = {
  title: 'Rimay — Tu idioma. Tu voz. Tu municipio.',
  description:
    'La información pública no es pública si no se entiende. Rimay simplifica, traduce al quechua y lee en voz alta los comunicados oficiales de Bolivia.',
  icons: {
    icon: '/rimay-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
