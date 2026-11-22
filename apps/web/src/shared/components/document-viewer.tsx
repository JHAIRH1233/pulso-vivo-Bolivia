'use client';

import { useState } from 'react';
import { DocumentItem } from '../data/mock-documents';

interface DocumentViewerProps {
  doc: DocumentItem;
  onClose: () => void;
}

export function DocumentViewer({ doc, onClose }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<'oficial' | 'simple' | 'quechua' | 'audio'>('simple');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'rimay'; text: string; evidence?: string }>>([
    {
      sender: 'rimay',
      text: `Hola, soy Rimay. Pregúntame lo que necesites sobre este documento ("${doc.title}") y te responderé con la información oficial verificada.`,
    },
  ]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [comments, setComments] = useState<Array<{ name: string; text: string; date: string }>>([
    {
      name: 'María C. (Vecina D-2)',
      text: 'Muy útil que aclaren los puntos de atención y los horarios de las brigadas. ¡Gracias!',
      date: 'Hace 2 horas',
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Text-to-speech handler
  function handleSpeak(textToRead: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz automática.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = activeTab === 'quechua' ? 'qu' : 'es-BO';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  // Ask Rimay chatbot handler
  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    const query = questionText.trim();
    if (!query) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setQuestionText('');
    setIsAnswering(true);

    try {
      const response = await fetch('/api/assistant/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, communiqueSlug: doc.slug }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'rimay',
            text: data.answer || 'No encontré ese dato en el texto oficial.',
            evidence: data.evidence || undefined,
          },
        ]);
      } else {
        // Fallback response based on document content
        setMessages((prev) => [
          ...prev,
          {
            sender: 'rimay',
            text: `En base al documento oficial de ${doc.institution}: ${doc.simplifiedContent.slice(0, 200)}...`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'rimay',
          text: `En base al texto oficial: la información indica que ${doc.simplifiedContent.split('\n')[1] || doc.simplifiedContent.slice(0, 150)}`,
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

  return (
    <div className="space-y-6 rounded-[32px] border border-border/80 bg-card p-6 shadow-xl sm:p-10">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-3.5 py-1 font-heading text-xs font-bold uppercase tracking-wider text-primary">
              {doc.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70">
              <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {doc.institution}
            </span>
            <span className="text-xs text-foreground/50">·</span>
            <time className="text-xs text-foreground/50">
              {new Date(doc.publishedAt).toLocaleDateString('es-BO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
          <h2 className="font-heading text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            {doc.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {doc.sourceUrl && (
            <a
              href={doc.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/75 transition hover:bg-secondary hover:text-primary"
            >
              <span>Fuente oficial</span>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition hover:bg-[hsl(var(--brand-magenta))]/10 hover:text-[hsl(var(--brand-magenta))]"
            aria-label="Cerrar visor"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Language / Version Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border bg-background/60 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('simple')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
              activeTab === 'simple'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/70 hover:text-primary'
            }`}
          >
            💡 Español simple
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quechua')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
              activeTab === 'quechua'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/70 hover:text-primary'
            }`}
          >
            🇧🇴 Quechua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('oficial')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
              activeTab === 'oficial'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/70 hover:text-primary'
            }`}
          >
            📜 Texto oficial
          </button>
        </div>

        {/* Read aloud button */}
        <button
          type="button"
          onClick={() => {
            const currentContent =
              activeTab === 'quechua'
                ? doc.quechuaContent || doc.content
                : activeTab === 'simple'
                ? doc.simplifiedContent
                : doc.content;
            handleSpeak(currentContent);
          }}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition sm:text-sm ${
            isSpeaking
              ? 'animate-pulse bg-[hsl(var(--brand-magenta))] text-white'
              : 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isSpeaking ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
            )}
          </svg>
          {isSpeaking ? 'Detener lectura' : 'Escuchar en voz alta'}
        </button>
      </div>

      {/* Main Document Content Area */}
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 leading-relaxed">
        {activeTab === 'simple' && (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D3F4F0] px-3 py-1 text-xs font-bold text-[#0E6B64]">
              <span>Versión en palabras simples</span>
            </div>
            <div className="whitespace-pre-line text-sm text-foreground/90 sm:text-base">
              {doc.simplifiedContent}
            </div>
          </div>
        )}

        {activeTab === 'quechua' && (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE6D6] px-3 py-1 text-xs font-bold text-[#AE4612]">
              <span>Qhichwa simipi (Quechua boliviano)</span>
            </div>
            <p className="text-xs text-foreground/60 italic">
              Traducción generada por IA, validada para la comunidad quechuahablante.
            </p>
            <div className="whitespace-pre-line text-sm text-foreground/90 sm:text-base">
              {doc.quechuaContent || 'Aún no se ha cargado la versión en quechua para este documento.'}
            </div>
          </div>
        )}

        {activeTab === 'oficial' && (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground/80">
              <span>Resolución institucional íntegra</span>
            </div>
            <div className="whitespace-pre-line text-sm font-mono text-foreground/80 sm:text-sm">
              {doc.content}
            </div>
          </div>
        )}
      </div>

      {/* Two columns: Gaps & FAQs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detected Gaps */}
        <div className="rounded-2xl border border-[hsl(var(--brand-naranja))]/30 bg-[#FFE6D6]/30 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--brand-naranja))] text-white font-bold text-xs">
              ⚠️
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Brechas detectadas
            </h3>
          </div>
          <p className="mt-1 text-xs text-foreground/70">
            Puntos que faltaban o eran ambiguos en el aviso oficial y que Rimay aclara para la ciudadanía.
          </p>

          <div className="mt-4 space-y-3">
            {doc.gaps && doc.gaps.length > 0 ? (
              doc.gaps.map((gap, i) => (
                <div key={i} className="rounded-xl border border-white/60 bg-white/80 p-3.5 shadow-sm">
                  <p className="font-heading text-sm font-bold text-[hsl(var(--brand-naranja))]">
                    {gap.topic}
                  </p>
                  <p className="mt-1 text-xs text-foreground/80">{gap.explanation}</p>
                  <p className="mt-2 text-xs font-semibold text-primary">
                    Duda común: "{gap.clarifyingQuestion}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-foreground/60">No se encontraron brechas críticas en este comunicado.</p>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl border border-primary/20 bg-[#D3F4F0]/30 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">
              ?
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Preguntas frecuentes
            </h3>
          </div>
          <p className="mt-1 text-xs text-foreground/70">
            Respuestas clave redactadas a partir del texto oficial.
          </p>

          <div className="mt-4 space-y-3">
            {doc.faqs && doc.faqs.length > 0 ? (
              doc.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-white/60 bg-white/80 p-3.5 shadow-sm">
                  <p className="font-heading text-sm font-bold text-primary">
                    {faq.question}
                  </p>
                  <p className="mt-1 text-xs text-foreground/80">{faq.answer}</p>
                  {faq.answerQuechua && (
                    <p className="mt-2 text-xs italic text-[hsl(var(--brand-naranja))]">
                      En quechua: {faq.answerQuechua}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-foreground/60">Aún no hay preguntas frecuentes registradas.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pregúntale a Rimay (Chatbot) */}
      <div className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            ✦
          </span>
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Pregúntale a Rimay
            </h3>
            <p className="text-xs text-foreground/70">
              Rimay responde exclusivamente con el texto oficial verificado para no inventar información.
            </p>
          </div>
        </div>

        {/* Chat message history */}
        <div className="mt-4 max-h-60 space-y-3 overflow-y-auto rounded-xl border border-border/50 bg-background/60 p-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                  m.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border/60 bg-white text-foreground'
                }`}
              >
                {m.text}
              </div>
              {m.evidence && (
                <span className="mt-1 text-[11px] text-foreground/50">
                  Fuente textual: "{m.evidence}"
                </span>
              )}
            </div>
          ))}
          {isAnswering && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
              Rimay está leyendo el comunicado oficial...
            </div>
          )}
        </div>

        {/* Question input form */}
        <form onSubmit={handleAskQuestion} className="mt-3 flex gap-2">
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Escribe tu duda (ej: ¿atienden en la tarde? o ¿qué tengo que llevar?)..."
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
          <button
            type="submit"
            disabled={isAnswering || !questionText.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 sm:text-sm"
          >
            <span>Preguntar</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      {/* Community Comments */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Comentarios y aportes de la comunidad
        </h3>
        <p className="text-xs text-foreground/70">
          ¿Qué te pareció este documento o qué dudas adicionales te quedan?
        </p>

        {/* Comment list */}
        <div className="mt-4 space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-background/70 p-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span className="font-bold text-primary">{c.name}</span>
                <span>{c.date}</span>
              </div>
              <p className="mt-1 text-foreground/85">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Comment form */}
        <form onSubmit={handleAddComment} className="mt-4 space-y-2">
          <input
            type="text"
            value={newCommentName}
            onChange={(e) => setNewCommentName(e.target.value)}
            placeholder="Tu nombre o barrio (opcional)..."
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
          />
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Escribe tu comentario o consulta vecinal..."
              className="flex-1 rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="self-end rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
