'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { DocumentViewer } from '../shared/components/document-viewer';
import { DocumentItem, MOCK_DOCUMENTS } from '../shared/data/mock-documents';

type CategoryFilter = 'Todos' | 'Comunicado' | 'Noticia' | 'Convocatoria' | 'Bono';

const categories = [
  { key: 'Todos', label: 'Todos los documentos', count: MOCK_DOCUMENTS.length },
  { key: 'Comunicado', label: 'Comunicados', chip: 'bg-[#D3F4F0] text-[#0E6B64]' },
  { key: 'Noticia', label: 'Noticias', chip: 'bg-[#FBE1EC] text-[#A51E58]' },
  { key: 'Convocatoria', label: 'Convocatorias', chip: 'bg-[#FFE6D6] text-[#AE4612]' },
  { key: 'Bono', label: 'Bonos y beneficios', chip: 'bg-[#FFF1C9] text-[#7E5200]' },
];

const alliedPartners = [
  {
    nombre: 'Alcaldía de Cochabamba',
    url: 'https://www.cochabamba.bo/',
    descripcion: 'Portal oficial del Gobierno Autónomo Municipal de Cochabamba.',
    logo: '/alcaldia.png',
  },
  {
    nombre: 'Innova Cochabamba',
    url: 'https://innova.cochabamba.bo/menu-consultaAtlas',
    descripcion: 'Plataforma municipal de consulta de información y trámites catastrales.',
    logo: '/innova.png',
  },
  {
    nombre: 'UMSS Cochabamba',
    url: 'https://www.umss.edu.bo',
    descripcion: 'Portal oficial de la Universidad Mayor de San Simón.',
    logo: '/umss.png',
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos');
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const filteredDocs =
    selectedCategory === 'Todos'
      ? MOCK_DOCUMENTS
      : MOCK_DOCUMENTS.filter((doc) => doc.category === selectedCategory);

  function handleSelectDoc(doc: DocumentItem) {
    setActiveDoc(doc);
    setTimeout(() => {
      viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    <div className="space-y-16 pb-20 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden" aria-label="Rimay: tu idioma, tu voz, tu municipio">
        {/* Colorful glowing ambient blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-[#E0357A]/10 blur-3xl" />
          <div className="absolute -right-10 top-24 h-64 w-64 rounded-full bg-[#19B3A6]/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#FFB627]/20 blur-3xl" />
        </div>

        <div className="page-container relative py-12 text-center sm:py-20">
          <div className="mx-auto flex justify-center">
            <Image
              src="/rimay-logo.png"
              alt="Logo de Rimay"
              width={200}
              height={70}
              className="h-16 w-auto sm:h-20"
              priority
            />
          </div>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Tu idioma. Tu voz. Tu municipio.
          </h1>

          <div className="mt-4">
            <span className="inline-flex items-center rounded-full bg-secondary px-5 py-2 font-heading text-xs font-bold tracking-[0.14em] text-primary sm:text-sm">
              ENTENDERNOS NOS CONECTA
            </span>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            La información pública no es pública si no se entiende. Rimay simplifica en palabras claras,
            traduce al quechua y lee en voz alta los comunicados oficiales de Bolivia para que nadie se quede atrás.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#documentos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_-24px_rgba(25,179,166,1)] transition hover:bg-primary/90 sm:w-auto"
            >
              <span>Ver documentos oficiales</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>

            <Link
              href="/puntos-calientes"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[hsl(var(--brand-magenta))]/40 bg-card px-8 py-3.5 text-sm font-bold text-[hsl(var(--brand-magenta))] transition hover:border-[hsl(var(--brand-magenta))] hover:bg-[hsl(var(--brand-magenta))]/10 sm:w-auto"
            >
              <svg className="h-4 w-4 text-[hsl(var(--brand-magenta))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              <span>Puntos calientes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Allied Partners Section */}
      <section className="page-container" aria-labelledby="allied-title">
        <div className="text-center sm:text-left">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Ecosistema de datos abiertos
          </p>
          <h2 id="allied-title" className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Páginas oficiales aliadas
          </h2>
          <p className="mt-1 text-sm text-foreground/70 sm:text-base">
            Fuentes de información pública de Cochabamba y Bolivia que Rimay ayuda a transparentar.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {alliedPartners.map((partner) => (
            <a
              key={partner.nombre}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex h-14 w-auto items-center">
                  <Image
                    src={partner.logo}
                    alt={partner.nombre}
                    width={160}
                    height={50}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary">
                    {partner.nombre}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                    {partner.descripcion}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Visitar portal</span>
                <svg className="h-3.5 w-3.5 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. Citizen Dashboard Section (#documentos) */}
      <section id="documentos" className="page-container scroll-mt-24" aria-labelledby="board-title">
        <div className="border-b border-border/80 pb-6">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--brand-magenta))]">
            Tablero ciudadano
          </p>
          <h2 id="board-title" className="mt-2 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
            Documentos oficiales, claros para todos
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70 sm:text-base">
            Filtra por tipo y explora comunicados, noticias, convocatorias y beneficios.
            Toca <span className="font-bold text-primary">"Descubre"</span> para ver el texto simplificado, escuchar el audio en quechua y preguntarle a Rimay.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key as CategoryFilter)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold transition sm:text-sm ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'border border-border bg-card text-foreground/75 hover:bg-secondary hover:text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Cards Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => {
            const isOpened = activeDoc?.id === doc.id;
            return (
              <article
                key={doc.id}
                className={`flex flex-col justify-between rounded-[28px] border bg-card p-6 shadow-sm transition duration-300 hover:shadow-lg ${
                  isOpened ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                <div className="space-y-4">
                  {/* Category chip & Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`rounded-full px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider ${
                        doc.category === 'Comunicado'
                          ? 'bg-[#D3F4F0] text-[#0E6B64]'
                          : doc.category === 'Noticia'
                          ? 'bg-[#FBE1EC] text-[#A51E58]'
                          : doc.category === 'Convocatoria'
                          ? 'bg-[#FFE6D6] text-[#AE4612]'
                          : 'bg-[#FFF1C9] text-[#7E5200]'
                      }`}
                    >
                      {doc.category}
                    </span>
                    <time className="text-foreground/50">
                      {new Date(doc.publishedAt).toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </time>
                  </div>

                  {/* Institution & Title */}
                  <div>
                    <p className="text-xs font-semibold text-primary">{doc.institution}</p>
                    <h3 className="mt-1 font-heading text-lg font-bold leading-snug text-foreground">
                      {doc.title}
                    </h3>
                  </div>

                  {/* Simplified summary */}
                  <p className="text-xs leading-relaxed text-foreground/75 line-clamp-3">
                    {doc.simplifiedContent}
                  </p>

                  {/* Available Formats Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {doc.formats.includes('simple') && (
                      <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-primary">
                        Español simple
                      </span>
                    )}
                    {doc.formats.includes('quechua') && (
                      <span className="rounded-md bg-[#FFE6D6] px-2 py-0.5 text-[10px] font-bold text-[#AE4612]">
                        Quechua
                      </span>
                    )}
                    {doc.formats.includes('audio') && (
                      <span className="rounded-md bg-[#FFF1C9] px-2 py-0.5 text-[10px] font-bold text-[#7E5200]">
                        Audio disponible
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 border-t border-border/50 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSelectDoc(doc)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground sm:text-sm"
                  >
                    <span>Descubre</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Active Document Detail Viewer (Scroll target) */}
      {activeDoc && (
        <section ref={viewerRef} className="page-container scroll-mt-24 pt-4 sm:pt-8" aria-label="Visor del documento">
          <DocumentViewer doc={activeDoc} onClose={() => setActiveDoc(null)} />
        </section>
      )}
    </div>
  );
}
