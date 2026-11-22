'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BoliviaMap } from '../../shared/components/bolivia-map';
import base44Data from '../../shared/data/base44-data.json';

interface PreguntaItem {
  id: string;
  comunicado?: string;
  comunicado_titulo?: string;
  texto?: string;
  tema?: string;
  departamento?: string | null;
  zona?: string | null;
}

interface ComentarioItem {
  id: string;
  comunicado?: string;
  texto?: string;
  autor?: string;
}

interface ComunicadoItem {
  id: string;
  titulo: string;
  institucion?: string;
  categoria?: string;
  brechas?: Array<unknown>;
}

// Level computation functions matching base44 exact
function getNivelTema(preguntas: number): 'alto' | 'medio' | 'bajo' {
  return preguntas >= 10 ? 'alto' : preguntas >= 5 ? 'medio' : 'bajo';
}

function getNivelDocumento(porcentaje: number): 'alto' | 'medio' | 'bajo' {
  return porcentaje >= 75 ? 'alto' : porcentaje >= 63 ? 'medio' : 'bajo';
}

const BADGE_TEMA_CLASSES = {
  alto: 'bg-primary text-primary-foreground',
  medio: 'bg-primary/15 text-primary',
  bajo: 'bg-foreground/5 text-foreground/60',
};

const BAR_COLOR_CLASSES = {
  alto: 'bg-nivel-alto',
  medio: 'bg-nivel-medio',
  bajo: 'bg-nivel-bajo',
};

const BADGE_DOC_CLASSES = {
  alto: 'bg-nivel-alto text-white',
  medio: 'bg-nivel-medio text-nivel-tinta',
  bajo: 'bg-nivel-bajo text-nivel-tinta',
};

const DOC_LABEL = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

export default function PuntosCalientesPage() {
  const [selectedDocId, setSelectedDocId] = useState<string>('todos');
  const [selectedDept, setSelectedDept] = useState<string>('Cochabamba');

  const { comunicados, preguntas, comentarios } = base44Data as {
    comunicados: ComunicadoItem[];
    preguntas: PreguntaItem[];
    comentarios: ComentarioItem[];
  };

  // Compute Temas (most asked & ordered by interest) matching base44 nk exact
  const temas = useMemo(() => {
    const map = new Map<
      string,
      { tema: string; preguntas: number; ejemplos: string[]; documentos: Set<string> }
    >();

    (preguntas || []).forEach((p) => {
      const t = p.tema || 'Otras dudas';
      if (!map.has(t)) {
        map.set(t, { tema: t, preguntas: 0, ejemplos: [], documentos: new Set() });
      }
      const entry = map.get(t)!;
      entry.preguntas += 1;
      if (p.comunicado) {
        entry.documentos.add(p.comunicado);
      }
      if (entry.ejemplos.length < 4 && p.texto) {
        entry.ejemplos.push(p.texto);
      }
    });

    const commentCountMap = new Map<string, number>();
    (comentarios || []).forEach((c) => {
      if (c.comunicado) {
        commentCountMap.set(c.comunicado, (commentCountMap.get(c.comunicado) || 0) + 1);
      }
    });

    return [...map.values()]
      .map((entry) => {
        const commentTotal = [...entry.documentos].reduce(
          (acc, docId) => acc + (commentCountMap.get(docId) || 0),
          0,
        );
        return {
          tema: entry.tema,
          preguntas: entry.preguntas,
          comentarios: commentTotal,
          ejemplos: entry.ejemplos,
          total: entry.preguntas + commentTotal,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [preguntas, comentarios]);

  // Compute Document Confusion Ranking matching base44 rk exact
  const documentos = useMemo(() => {
    const questionCountMap = new Map<string, number>();
    (preguntas || []).forEach((p) => {
      if (p.comunicado) {
        questionCountMap.set(p.comunicado, (questionCountMap.get(p.comunicado) || 0) + 1);
      }
    });

    const commentCountMap = new Map<string, number>();
    (comentarios || []).forEach((c) => {
      if (c.comunicado) {
        commentCountMap.set(c.comunicado, (commentCountMap.get(c.comunicado) || 0) + 1);
      }
    });

    return (comunicados || [])
      .map((doc) => {
        const brechas = Array.isArray(doc.brechas) ? doc.brechas.length : 0;
        const qCount = questionCountMap.get(doc.id) || 0;
        const cCount = commentCountMap.get(doc.id) || 0;
        const pct = Math.min(100, Math.round(brechas * 9 + qCount * 4 + cCount * 2));
        return {
          id: doc.id,
          titulo: doc.titulo,
          institucion: doc.institucion || 'Institución no indicada',
          brechas,
          preguntas: qCount,
          comentarios: cCount,
          porcentaje: pct,
          nivel: getNivelDocumento(pct),
        };
      })
      .sort((a, b) => b.porcentaje - a.porcentaje);
  }, [comunicados, preguntas, comentarios]);

  // Regional analysis matching base44 bk exact
  const preguntasConRegion = useMemo(() => {
    return (preguntas || []).filter(
      (p) => p.departamento && (selectedDocId === 'todos' || p.comunicado === selectedDocId),
    );
  }, [preguntas, selectedDocId]);

  const conteosPorDepartamento = useMemo(() => {
    const counts: Record<string, number> = {};
    preguntasConRegion.forEach((p) => {
      if (p.departamento) {
        counts[p.departamento] = (counts[p.departamento] || 0) + 1;
      }
    });
    return counts;
  }, [preguntasConRegion]);

  const zonasOrdenadas = useMemo(() => {
    const map = new Map<string, { departamento: string; zona: string; total: number }>();
    preguntasConRegion.forEach((p) => {
      const key = `${p.departamento}|${p.zona || 'Sin zona'}`;
      if (!map.has(key)) {
        map.set(key, {
          departamento: p.departamento!,
          zona: p.zona || 'Sin zona',
          total: 0,
        });
      }
      map.get(key)!.total += 1;
    });
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [preguntasConRegion]);

  const top5Zonas = zonasOrdenadas.slice(0, 5);
  const deptZonas = zonasOrdenadas.filter((z) => z.departamento === selectedDept).slice(0, 6);
  const totalEnDepartamento = conteosPorDepartamento[selectedDept] || 0;

  const deptTemas = useMemo(() => {
    const map = new Map<string, number>();
    preguntasConRegion
      .filter((p) => p.departamento === selectedDept)
      .forEach((p) => {
        const t = p.tema || 'Otras dudas';
        map.set(t, (map.get(t) || 0) + 1);
      });
    return [...map.entries()]
      .map(([tema, total]) => ({ tema, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [preguntasConRegion, selectedDept]);

  // Top 6 for horizontal chart
  const top6Temas = temas.slice(0, 6);

  return (
    <div className="space-y-0">
      {/* 1. Top Banner exact from base44 (Screenshot 1 top) */}
      <section className="border-b border-border bg-card">
        <div className="page-container py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Escucha ciudadana
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
            Puntos calientes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
            Los temas que generan más dudas, confusión o comentarios en la ciudadanía, ordenados de
            mayor a menor. Sirve para saber qué necesita una aclaración urgente.
          </p>
        </div>
      </section>

      {/* 2. Main Dashboard Content (Screenshot 1, 2, 3) */}
      <div className="page-container space-y-8 py-8 sm:py-10">
        {/* Row 1: Temas más preguntados & Temas ordenados por interés */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Card Left: Temas más preguntados (Horizontal Bar Chart) */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              Temas más preguntados
            </h2>
            <p className="mt-1 text-sm text-foreground/65">
              Cantidad de preguntas ciudadanas por tema.
            </p>

            <div className="mt-4 rounded-2xl bg-white p-4">
              {top6Temas.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm font-semibold text-foreground/60">
                  Aún no hay datos para graficar.
                </p>
              ) : (
                <div className="space-y-4">
                  {top6Temas.map((item) => {
                    const widthPct = Math.min(100, Math.round((item.preguntas / 16) * 100));
                    return (
                      <div
                        key={item.tema}
                        className="grid grid-cols-[135px_1fr] items-center gap-3 sm:grid-cols-[165px_1fr]"
                      >
                        <span className="truncate text-right text-xs font-semibold text-foreground/80">
                          {item.tema}
                        </span>
                        <div className="relative flex items-center">
                          {/* Grid line indicator */}
                          <div className="h-5 w-full overflow-hidden rounded-r-lg bg-slate-50">
                            <div
                              className="h-full rounded-r-lg bg-primary transition-all duration-700 ease-out"
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Axis labels 0, 4, 8, 12, 16 matching base44 exact */}
                  <div className="grid grid-cols-[135px_1fr] gap-3 border-t border-border/40 pt-2 sm:grid-cols-[165px_1fr]">
                    <div />
                    <div className="flex justify-between px-1 text-[11px] font-bold text-foreground/50">
                      <span>0</span>
                      <span>4</span>
                      <span>8</span>
                      <span>12</span>
                      <span>16</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Card Right: Temas ordenados por interés (Screenshot 1 right) */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              Temas ordenados por interés
            </h2>
            <p className="mt-1 text-sm text-foreground/65">
              De mayor a menor según dudas y comentarios.
            </p>

            <ol className="mt-4 space-y-2.5">
              {temas.slice(0, 6).map((item, idx) => {
                const nivel = getNivelTema(item.preguntas);
                return (
                  <li key={item.tema} className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold leading-snug text-foreground">
                            {item.tema}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-foreground/55">
                            {item.preguntas} preguntas · {item.comentarios} comentarios
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${BADGE_TEMA_CLASSES[nivel]}`}
                      >
                        {nivel}
                      </span>
                    </div>
                  </li>
                );
              })}
              {temas.length === 0 && (
                <li className="rounded-2xl bg-white px-4 py-6 text-center text-sm font-semibold text-foreground/60">
                  Todavía no hay dudas registradas.
                </li>
              )}
            </ol>
          </section>
        </div>

        {/* Row 2: Nivel de confusión por documento (Screenshot 2 top) */}
        <section className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </span>
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                Nivel de confusión por documento
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-foreground/65">
                Combina las brechas detectadas con las preguntas y los comentarios que recibió cada
                documento. Los primeros del ranking necesitan una aclaración urgente.
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {documentos.map((doc, idx) => (
              <article
                key={doc.id}
                className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-primary shadow-sm">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/documento/${doc.id}`}
                      className="line-clamp-2 font-heading text-base font-bold leading-snug text-foreground transition hover:text-primary"
                    >
                      {doc.titulo}
                    </Link>
                    <p className="mt-1 truncate text-xs font-semibold text-foreground/55">
                      {doc.institucion}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-heading text-2xl font-extrabold leading-none text-foreground">
                      {doc.porcentaje}%
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${BADGE_DOC_CLASSES[doc.nivel]}`}
                    >
                      {DOC_LABEL[doc.nivel]}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Progress bar matching base44 exact */}
                  <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/80">
                    <div
                      className={`h-full rounded-full transition-[width] duration-1000 ease-out ${BAR_COLOR_CLASSES[doc.nivel]}`}
                      style={{ width: `${doc.porcentaje}%` }}
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs font-semibold text-foreground/60">
                  {doc.preguntas} preguntas · {doc.comentarios} comentarios · {doc.brechas} brechas
                </p>
              </article>
            ))}
            {documentos.length === 0 && (
              <p className="rounded-3xl bg-card px-5 py-8 text-center text-sm font-semibold text-foreground/60">
                Todavía no hay documentos analizados.
              </p>
            )}
          </div>
        </section>

        {/* Row 3: ¿Desde dónde preguntan? (Screenshot 2 & 3 exact) */}
        <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                ¿Desde dónde preguntan?
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-foreground/65">
                Cada pregunta registra el departamento y la zona de quien consulta. Toca un
                departamento del mapa para ver sus zonas y los temas más consultados.
              </p>
            </div>
            <span className="rounded-full border border-primary/25 bg-white px-3 py-1 text-[11px] font-bold text-primary shadow-sm">
              Datos de ejemplo de demostración
            </span>
          </div>

          {/* Document filter select matching Screenshot 2 */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label htmlFor="filtro-documento" className="text-sm font-bold text-foreground">
              Documento
            </label>
            <select
              id="filtro-documento"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="min-h-[44px] max-w-full rounded-full border border-border bg-white px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="todos">Todos los documentos</option>
              {comunicados.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
            <span className="text-xs font-semibold text-foreground/55">
              {preguntasConRegion.length} preguntas con región registrada
            </span>
          </div>

          {/* Map + Top 5 zones grid */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
            {/* Left: Interactive Map with gradient scale */}
            <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
              <BoliviaMap
                counts={conteosPorDepartamento}
                selectedDepartment={selectedDept}
                onSelectDepartment={setSelectedDept}
              />
              <div className="mt-3 flex items-center gap-2 px-1">
                <span className="shrink-0 text-[11px] font-semibold text-foreground/50">Menos</span>
                <div
                  className="h-2 flex-1 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #f3ecff, #e0d4fb, #c9aef7, #a878f0, #8b4ced)',
                  }}
                />
                <span className="shrink-0 text-[11px] font-semibold text-foreground/50">
                  Más preguntas
                </span>
              </div>
            </div>

            {/* Right: Top 5 zonas con más dudas */}
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
                Top 5 zonas con más dudas
              </h3>
              <ol className="mt-3 space-y-2">
                {top5Zonas.map((z, idx) => (
                  <li
                    key={`${z.departamento}-${z.zona}`}
                    className="flex items-center gap-3 rounded-xl bg-card/60 p-2"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{z.zona}</p>
                      <p className="text-xs font-semibold text-foreground/55">{z.departamento}</p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-primary">{z.total}</span>
                  </li>
                ))}
                {top5Zonas.length === 0 && (
                  <li className="py-6 text-sm font-semibold text-foreground/60">
                    Todavía no hay preguntas con región.
                  </li>
                )}
              </ol>
            </div>
          </div>

          {/* Department Detail Breakdown (Screenshot 3 exact) */}
          <div className="mt-4 rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-heading text-lg font-bold text-foreground">{selectedDept}</h3>
              <p className="text-xs font-semibold text-foreground/55">
                {totalEnDepartamento} preguntas en el departamento
              </p>
            </div>

            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              {/* Zonas o municipios con más preguntas */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Zonas o municipios con más preguntas
                </p>
                <ul className="mt-2 space-y-2">
                  {deptZonas.map((z) => {
                    const pct = totalEnDepartamento
                      ? Math.round((z.total / totalEnDepartamento) * 100)
                      : 0;
                    return (
                      <li key={z.zona}>
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground/80">
                          <span className="truncate">{z.zona}</span>
                          <span className="shrink-0 text-foreground/50">{z.total}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-card">
                          <div
                            className="h-full rounded-full bg-nivel-alto"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                  {deptZonas.length === 0 && (
                    <li className="text-sm font-semibold text-foreground/60">
                      No hay preguntas registradas en este departamento.
                    </li>
                  )}
                </ul>
              </div>

              {/* Temas más consultados aquí */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Temas más consultados aquí
                </p>
                <ul className="mt-2 space-y-2">
                  {deptTemas.map((t) => (
                    <li
                      key={t.tema}
                      className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2 text-sm font-semibold text-foreground/80"
                    >
                      <span className="truncate">{t.tema}</span>
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary">
                        {t.total}
                      </span>
                    </li>
                  ))}
                  {deptTemas.length === 0 && (
                    <li className="text-sm font-semibold text-foreground/60">
                      Sin temas registrados.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-foreground/50">
              Datos de ejemplo para mostrar cómo funcionaría el mapa. No representan estadísticas
              oficiales.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
