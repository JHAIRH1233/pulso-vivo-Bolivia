'use client';

import { useState } from 'react';

const versions = [
  {
    id: 'es',
    label: 'Español',
    heading: 'Campaña de vacunación',
    body: 'La institución informa que la vacuna está disponible sin costo en los centros de salud autorizados.',
    note: 'Texto oficial de demostración',
  },
  {
    id: 'simple',
    label: 'Simple',
    heading: 'Vacunación gratuita',
    body: 'La vacuna es gratis. Puedes acudir a un centro de salud autorizado. Revisa antes la fecha y el horario.',
    note: 'Versión en palabras simples',
  },
  {
    id: 'qu',
    label: 'Quechua',
    heading: 'Versión en quechua',
    body: 'En esta demostración, aquí se mostraría una traducción revisada por hablantes de la comunidad.',
    note: 'Muestra de interfaz; no es una traducción validada',
  },
] as const;

export function CommunicationPreview() {
  const [selectedVersion, setSelectedVersion] =
    useState<(typeof versions)[number]['id']>('simple');
  const [audioMessage, setAudioMessage] = useState('');
  const version = versions.find((item) => item.id === selectedVersion)!;

  return (
    <div className="version-preview">
      <div
        className="version-picker"
        role="group"
        aria-label="Versiones del comunicado de demostración"
      >
        {versions.map((item) => (
          <button
            aria-pressed={selectedVersion === item.id}
            key={item.id}
            onClick={() => {
              setSelectedVersion(item.id);
              setAudioMessage('');
            }}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <article className="version-card" aria-live="polite">
        <div className="version-card__meta">
          <span>Ejemplo de comunicado</span>
          <span className="category-tag">Salud</span>
        </div>
        <h3>{version.heading}</h3>
        <p>{version.body}</p>
        <p className="version-card__note">{version.note}</p>
        <div className="version-card__actions">
          <button
            className="listen-button"
            onClick={() =>
              setAudioMessage(
                'La reproducción de audio estará disponible en una próxima etapa.',
              )
            }
            type="button"
          >
            <span aria-hidden="true">▶</span> Escuchar
          </button>
          <span>{version.label}</span>
        </div>
        {audioMessage && (
          <p className="audio-status" role="status">
            {audioMessage}
          </p>
        )}
      </article>
    </div>
  );
}
