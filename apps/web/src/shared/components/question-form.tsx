'use client';

import { FormEvent, useState } from 'react';
import { publicCommuniques } from '../mocks/public-communiques';

export function QuestionForm({
  initialCommuniqueId,
}: {
  initialCommuniqueId: string;
}) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<'ES' | 'QU'>('ES');
  const [communiqueId, setCommuniqueId] = useState(initialCommuniqueId);
  const [message, setMessage] = useState('');

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) {
      setMessage('Escribe una pregunta antes de continuar.');
      return;
    }

    setText('');
    setMessage(
      'Envío simulado. Tu pregunta no se envió ni se guardó en esta demostración.',
    );
  }

  return (
    <form className="question-form" onSubmit={submitQuestion}>
      <div className="form-field">
        <label htmlFor="question-text">Tu pregunta</label>
        <textarea
          id="question-text"
          name="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
          maxLength={2_000}
          rows={6}
          aria-describedby="question-help demo-note"
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
          {publicCommuniques.map((communique) => (
            <option key={communique.id} value={communique.id}>
              {communique.title}
            </option>
          ))}
        </select>
      </div>

      <p className="form-note" id="demo-note">
        No incluyas datos personales. Este es un formulario de demostración; no
        se almacena ninguna información.
      </p>

      <button className="button button--primary" type="submit">
        Simular envío
      </button>
      {message && (
        <p className="form-message" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
