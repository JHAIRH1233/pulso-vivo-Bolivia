'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DocumentItem } from '../data/mock-documents';

interface DocumentViewerProps {
  doc: DocumentItem;
  onClose: () => void;
}

const CATEGORY_STYLES: Record<string, { chip: string; singular: string }> = {
  Comunicado: { chip: 'bg-[#D3F4F0] text-[#0E6B64]', singular: 'Comunicado' },
  Noticia: { chip: 'bg-[#FBE1EC] text-[#A51E58]', singular: 'Noticia' },
  Convocatoria: { chip: 'bg-[#FFE6D6] text-[#AE4612]', singular: 'Convocatoria' },
  Bono: { chip: 'bg-[#FFF1C9] text-[#7E5200]', singular: 'Bono' },
};

const GUEST_STORAGE_KEY = 'rimay_preguntas_invitado';
const GUEST_LIMIT = 3;

export function DocumentViewer({ doc, onClose }: DocumentViewerProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<'oficial' | 'simple' | 'quechua'>('simple');

  // Audio / Speech Synthesis state
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Chatbot state
  const [questionText, setQuestionText] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'rimay'; text: string; sinDato?: boolean }>
  >([
    {
      sender: 'rimay',
      text: 'Hola, soy Rimay. Pregúntame sobre este documento y te responderé solo con su texto oficial.',
    },
  ]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [guestQuestionsUsed, setGuestQuestionsUsed] = useState(0);

  // FAQs Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Comments state
  const [comments, setComments] = useState<Array<{ name: string; text: string; date: string }>>([
    {
      name: 'María C. (Vecina D-2)',
      text: 'Muy útil que aclaren los puntos de atención y los horarios de las brigadas. ¡Gracias!',
      date: 'Hace 2 horas',
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Read guest count from sessionStorage
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        setGuestQuestionsUsed(Number(stored) || 0);
      }
    } catch {
      setGuestQuestionsUsed(0);
    }
  }, []);

  // Text-to-speech helpers
  function speak(text: string, id: string, lang = 'es-BO') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz automática.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang === 'qu' ? 0.85 : 0.95;
    utterance.onstart = () => {
      setSpeakingId(id);
      setIsPaused(false);
    };
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);
    utterance.onend = () => {
      setSpeakingId(null);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setSpeakingId(null);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  function pauseAudio() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }

  function resumeAudio() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }

  function stopAudio() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      setIsPaused(false);
    }
  }

  // Ask Rimay chatbot handler
  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    const query = questionText.trim();
    if (!query || isAnswering || guestQuestionsUsed >= GUEST_LIMIT) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setQuestionText('');
    setIsAnswering(true);

    const nextUsed = guestQuestionsUsed + 1;
    setGuestQuestionsUsed(nextUsed);
    try {
      window.sessionStorage.setItem(GUEST_STORAGE_KEY, String(nextUsed));
    } catch {}

    try {
      const response = await fetch('/api/assistant/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, communiqueSlug: doc.slug }),
      });

      if (response.ok) {
        const data = await response.json();
        const hasData = Boolean(data.found !== false && data.answer);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'rimay',
            text: data.answer || 'No encontré ese dato explícito en el texto oficial.',
            sinDato: !hasData,
          },
        ]);
      } else {
        // Fallback response based on doc text
        const isRelated =
          doc.content.toLowerCase().includes(query.toLowerCase()) ||
          doc.simplifiedContent.toLowerCase().includes(query.toLowerCase());

        setMessages((prev) => [
          ...prev,
          {
            sender: 'rimay',
            text: isRelated
              ? `Según el comunicado oficial: "${doc.simplifiedContent.slice(0, 180)}..."`
              : 'Ese dato específico no se menciona explícitamente en el texto oficial.',
            sinDato: !isRelated,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'rimay',
          text: `En base al documento oficial: ${doc.simplifiedContent.split('.')[0] || doc.simplifiedContent.slice(0, 140)}.`,
          sinDato: false,
        },
      ]);
    } finally {
      setIsAnswering(false);
    }
  }

  // Handle new comment
  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        name: newCommentName.trim() || 'Ciudadano anónimo',
        text: newCommentText.trim(),
        date: 'Recién',
      },
    ]);
    setNewCommentName('');
    setNewCommentText('');
  }

  const categoryStyle = CATEGORY_STYLES[doc.category] || CATEGORY_STYLES.Comunicado;

  // Active text to display & speak
  const currentContent =
    activeTab === 'oficial'
      ? doc.content
      : activeTab === 'quechua'
      ? doc.quechuaContent || 'Todavía no hay una versión en quechua para este documento.'
      : doc.simplifiedContent;

  const isDocSpeaking = speakingId === 'doc-text';

  // Process gaps into clean string list
  const brechasList: string[] =
    doc.gaps && doc.gaps.length > 0
      ? doc.gaps.map((g) => g.explanation || g.topic)
      : ['No se detectaron brechas en este documento.'];

  // Process FAQs list
  const faqsList = doc.faqs && doc.faqs.length > 0 ? doc.faqs : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. DOCUMENT HEADER & READER CARD */}
      <section className="overflow-hidden rounded-[32px] border-2 border-primary/30 bg-white shadow-[0_18px_40px_-32px_rgba(30,16,55,0.25)]">
        {/* Top Header info */}
        <div className="border-b border-border bg-card px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${categoryStyle.chip}`}
            >
              {categoryStyle.singular}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#FFB627]/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
              Ejemplo de demostración
            </span>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/60 transition hover:border-[hsl(var(--brand-magenta))] hover:text-[hsl(var(--brand-magenta))]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cerrar</span>
            </button>
          </div>

          <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {doc.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-foreground/65">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
              </svg>
              {doc.institution || 'Institución no indicada'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date(doc.publishedAt).toLocaleDateString('es-BO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/70">
              <span className="font-bold text-foreground">Fuente: </span>
              {doc.sourceName || 'no especificada en este ejemplo'}
            </p>
            {doc.sourceUrl && (
              <a
                href={doc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <span>Ver fuente oficial</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Document Reader Body */}
        <div className="px-5 py-6 sm:px-8">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
            {/* Tabs Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Texto del documento</span>
              </h3>

              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Idioma del documento">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'oficial'}
                  onClick={() => setActiveTab('oficial')}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === 'oficial'
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-white text-foreground/70 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  Texto oficial
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'simple'}
                  onClick={() => setActiveTab('simple')}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === 'simple'
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-white text-foreground/70 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  Español simple
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'quechua'}
                  onClick={() => setActiveTab('quechua')}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === 'quechua'
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-white text-foreground/70 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  Quechua
                </button>
              </div>
            </div>

            {/* Quechua Advisory */}
            {activeTab === 'quechua' && (
              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-primary">
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Traducción generada por IA, pendiente de revisión por un hablante nativo</span>
              </p>
            )}

            {/* Document Content Text */}
            <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_2px_8px_-4px_rgba(30,16,55,0.06)]">
              <p className="whitespace-pre-line text-base leading-relaxed text-foreground/85">
                {currentContent}
              </p>
            </div>

            {/* Audio Controls Bar (Exact Base44 layout & styling) */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => speak(currentContent, 'doc-text', activeTab === 'quechua' ? 'qu' : 'es-BO')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span>Escuchar</span>
              </button>

              <button
                type="button"
                onClick={pauseAudio}
                disabled={!isDocSpeaking || isPaused}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pausar</span>
              </button>

              <button
                type="button"
                onClick={resumeAudio}
                disabled={!isDocSpeaking || !isPaused}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Continuar</span>
              </button>

              <button
                type="button"
                onClick={stopAudio}
                disabled={!isDocSpeaking}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
                <span>Detener</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PREGÚNTALE A RIMAY ✨ (Bordered Gradient Card placed right below document) */}
      <section className="rounded-[32px] ia-gradient p-[3px] shadow-[0_30px_70px_-45px_rgba(224,53,122,1)]">
        <div className="rounded-[26px] bg-white p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-start gap-3">
            {/* Animated 3-bubble icon */}
            <span
              className="anim-breathe relative inline-flex h-14 w-14 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <svg
                className="absolute left-0 top-1 h-7 w-7 fill-foreground/90 text-foreground"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <svg
                className="absolute right-0 top-0 h-6 w-6 fill-[hsl(var(--brand-naranja))] text-[hsl(var(--brand-naranja))]"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <svg
                className="absolute bottom-0 left-3 h-8 w-8 fill-[hsl(var(--brand-magenta))] text-[hsl(var(--brand-magenta))]"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>

            <div>
              <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                <span>Pregúntale a Rimay</span>
                <svg
                  className="h-5 w-5 text-[hsl(var(--brand-naranja))]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </h2>
              <p className="mt-1 text-sm text-foreground/70">
                Rimay responde solo con el texto oficial. Si el dato no está, te lo dice y guarda tu pregunta para Puntos calientes.
              </p>
            </div>
          </div>

          {/* Messages list */}
          <div className="mt-5 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.sender === 'user'
                    ? 'ml-auto max-w-[85%] rounded-3xl rounded-br-md ia-gradient px-4 py-3 text-sm font-medium text-white shadow-sm'
                    : 'max-w-[90%] rounded-3xl rounded-bl-md bg-card px-4 py-3 text-sm leading-relaxed text-foreground/85 border border-border/50'
                }
              >
                <p>{m.text}</p>
                {m.sinDato && (
                  <p className="mt-2 text-xs font-semibold text-[hsl(var(--brand-magenta))]">
                    Guardamos tu pregunta como nueva duda para Puntos calientes.
                  </p>
                )}
              </div>
            ))}

            {isAnswering && (
              <div className="flex max-w-[90%] items-center gap-3 rounded-3xl rounded-bl-md bg-card px-4 py-3 border border-border/50">
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="anim-wave absolute inset-0 rounded-full bg-[#E0357A]/40" />
                  <span
                    className="anim-wave absolute inset-0 rounded-full bg-[#FF7A3D]/40"
                    style={{ animationDelay: '0.6s' }}
                  />
                  <span className="relative h-2 w-2 rounded-full bg-[hsl(var(--brand-magenta))]" />
                </span>
                <span className="flex items-center gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="anim-dot h-2 w-2 rounded-full bg-[hsl(var(--brand-magenta))]"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </span>
                <span className="text-xs font-semibold text-foreground/50">Rimay está revisando…</span>
              </div>
            )}
          </div>

          {/* Input Form or Registration Warning if limit reached */}
          {guestQuestionsUsed >= GUEST_LIMIT ? (
            <div className="mt-5 rounded-3xl border-2 border-dashed border-[#E0357A]/40 bg-accent px-5 py-5 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">
                Regístrate para seguir preguntando
              </p>
              <p className="mt-1 text-sm text-foreground/70">
                Usaste tus {GUEST_LIMIT} preguntas de invitado en esta sesión.
              </p>
              <Link
                href="/register"
                className="mt-4 inline-flex items-center justify-center rounded-full ia-gradient px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 shadow-md"
              >
                Crear mi cuenta
              </Link>
            </div>
          ) : (
            <form onSubmit={handleAskQuestion} className="mt-5 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="pregunta-rimay" className="sr-only">
                Tu pregunta
              </label>
              <input
                id="pregunta-rimay"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                maxLength={400}
                placeholder="¿Dónde tengo que inscribirme?"
                className="min-h-[52px] flex-1 rounded-full border border-border bg-white px-5 text-sm font-medium text-foreground outline-none transition focus:border-[hsl(var(--brand-magenta))] focus:ring-2 focus:ring-[#E0357A]/20"
              />
              <button
                type="submit"
                disabled={isAnswering || !questionText.trim()}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full ia-gradient px-6 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                <span>Preguntar</span>
              </button>
            </form>
          )}

          {guestQuestionsUsed < GUEST_LIMIT && (
            <p className="mt-2 text-center text-xs font-semibold text-foreground/50">
              Como invitado te quedan {Math.max(0, GUEST_LIMIT - guestQuestionsUsed)} de {GUEST_LIMIT} preguntas en esta sesión.
            </p>
          )}
        </div>
      </section>

      {/* 3. TWO COLUMNS GRID: BRECHAS DETECTADAS & PREGUNTAS FRECUENTES */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Brechas detectadas */}
        <section className="rounded-[28px] border border-border bg-card p-5 sm:p-7 shadow-[0_18px_40px_-32px_rgba(30,16,55,0.15)]">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
            <svg
              className="h-5 w-5 text-[hsl(var(--brand-amarillo))]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <span>Brechas detectadas</span>
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            Información que falta o es ambigua en el texto original y que la institución debería completar.
          </p>

          <ul className="mt-4 space-y-2.5">
            {brechasList.map((brecha, idx) => (
              <li
                key={idx}
                className="rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_-4px_rgba(30,16,55,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB627]/25">
                    <svg
                      className="h-3.5 w-3.5 text-[#8A5A00]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85">{brecha}</p>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#FFB627]/20">
                  <div
                    className="h-full rounded-full bg-[hsl(var(--brand-amarillo))] transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, 55 + ((idx * 27) % 40))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Right Column: Preguntas frecuentes */}
        <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-[0_18px_40px_-32px_rgba(30,16,55,0.15)]">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Preguntas frecuentes</span>
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            Generadas por IA a partir del texto oficial, en español, español simple y quechua.
          </p>

          {faqsList.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-foreground/60">
              Este documento todavía no tiene preguntas frecuentes.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {faqsList.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_8px_-4px_rgba(30,16,55,0.06)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-foreground transition hover:text-primary hover:no-underline"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`h-4 w-4 shrink-0 text-foreground/50 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="space-y-2.5 px-4 pb-4 pt-1">
                        <div className="rounded-xl bg-card p-3 border border-border/40">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                              Español simple
                            </p>
                            <button
                              type="button"
                              onClick={() => speak(faq.answer, `faq-${idx}-es`, 'es-BO')}
                              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-white px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
                            >
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                              <span>Escuchar</span>
                            </button>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                            {faq.answer}
                          </p>
                        </div>

                        {faq.answerQuechua && (
                          <div className="rounded-xl bg-card p-3 border border-border/40">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                Quechua
                              </p>
                              <button
                                type="button"
                                onClick={() => speak(faq.answerQuechua!, `faq-${idx}-qu`, 'qu')}
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-white px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
                              >
                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                                <span>Escuchar</span>
                              </button>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                              {faq.answerQuechua}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 4. COMENTARIOS Y APORTES DE LA COMUNIDAD */}
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-[0_18px_40px_-32px_rgba(30,16,55,0.15)]">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Comentarios y aportes de la comunidad
        </h3>
        <p className="mt-1 text-sm text-foreground/65">
          ¿Qué te pareció este documento o qué dudas adicionales te quedan?
        </p>

        {/* Comment list */}
        <div className="mt-5 space-y-3">
          {comments.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_-4px_rgba(30,16,55,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-xs text-foreground/50">{c.date}</p>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Comment form */}
        <form onSubmit={handleAddComment} className="mt-5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_-4px_rgba(30,16,55,0.06)] space-y-3">
          <input
            type="text"
            value={newCommentName}
            onChange={(e) => setNewCommentName(e.target.value)}
            placeholder="Tu nombre o barrio (opcional)..."
            className="w-full rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 sm:text-sm"
          />
          <textarea
            rows={2}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Escribe tu comentario o consulta vecinal..."
            className="w-full rounded-2xl border border-border bg-card p-3 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 sm:text-sm resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50 sm:text-sm"
            >
              Publicar comentario
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
