'use client';

import { FormEvent, useState } from 'react';
import { PublicCommuniqueSummary } from '../api/public-communiques';

export function QuestionForm({
  initialCommuniqueId,
  communiques,
}: {
  initialCommuniqueId: string;
  communiques: PublicCommuniqueSummary[];
}) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<'ES' | 'QU'>('ES');
  const [communiqueId, setCommuniqueId] = useState(initialCommuniqueId);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) {
      setMessage('Escribe una pregunta antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          language,
          ...(communiqueId ? { communiqueId } : {}),
        }),
      });
      if (!response.ok) {
        setMessage(
          response.status === 404
            ? 'El comunicado seleccionado ya no está disponible. Selecciona otro o envía una pregunta general.'
            : 'No se pudo enviar la pregunta. Intenta de nuevo.',
        );
        return;
      }

      setText('');
      setMessage('Tu pregunta fue recibida y quedó pendiente de revisión.');
    } catch (error) {
      console.error('Could not submit question', error);
      setMessage('No se pudo conectar con el servicio. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="question-form" onSubmit={submitQuestion}>
      <div className="form-field">
        <label htmlFor="question-text">Tu pregunta</label>
        <textarea
          id="question-text"
          name="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setMessage('');
          }}
          required
          maxLength={2_000}
          rows={6}
          aria-describedby="question-help privacy-note"
        />
        <div className="form-field__meta">
          <span id="question-help">Máximo 2.000 caracteres.</span>
          <span aria-live="polite">{text.length}/2.000</span>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="question-language">Idioma de tu pregunta</label>
        <select
          id="question-language"
          name="language"
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value === 'QU' ? 'QU' : 'ES')
          }
        >
          <option value="ES">Español</option>
          <option value="QU">Quechua</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="question-communique">Comunicado relacionado</label>
        <select
          id="question-communique"
          name="communiqueId"
          value={communiqueId}
          onChange={(event) => setCommuniqueId(event.target.value)}
        >
          <option value="">No está relacionado con un comunicado específico</option>
          {communiques.map((communique) => (
            <option key={communique.id} value={communique.id}>
              {communique.title}
            </option>
          ))}
        </select>
      </div>

      <p className="form-note" id="privacy-note">
        No incluyas datos personales. La pregunta se guarda para revisión
        institucional.
      </p>

      <button
        className="button button--primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando…' : 'Enviar pregunta'}
      </button>
      {message && (
        <p className="form-message" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
