import Link from 'next/link';
import { publicCommuniques } from '../shared/mocks/public-communiques';

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export default function Home() {
  return (
    <>
      <section className="public-hero" aria-labelledby="home-title">
        <div className="public-hero__content">
          <p className="eyebrow">Información pública para todas las personas</p>
          <h1 id="home-title">
            Entiende lo importante.
            <br />
            Participa con confianza.
          </h1>
          <p className="public-hero__description">
            Encuentra comunicados explicados con claridad y haz preguntas sobre
            la información que te afecta.
          </p>
          <div className="public-hero__actions">
            <a className="button button--primary" href="#comunicados">
              Ver comunicados
            </a>
            <Link className="button button--secondary" href="/preguntar">
              Hacer una pregunta
            </Link>
          </div>
        </div>
        <aside className="public-hero__note" aria-label="Aviso sobre los datos">
          <span className="public-hero__note-mark" aria-hidden="true">
            PV
          </span>
          <p>
            Estás viendo una <strong>demostración</strong>. Los comunicados de
            esta página son ejemplos y no son avisos oficiales.
          </p>
        </aside>
      </section>

      <section
        className="public-section"
        id="comunicados"
        aria-labelledby="communiques-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Información reciente</p>
            <h2 id="communiques-title">Comunicados de ejemplo</h2>
          </div>
          <p>Explora los ejemplos para ver cómo se presenta la información.</p>
        </div>

        <div className="communique-grid">
          {publicCommuniques.map((communique) => (
            <article className="communique-card" key={communique.id}>
              <div className="communique-card__meta">
                <span className="category-tag">{communique.category}</span>
                <time dateTime={communique.publishedAt}>
                  {dateFormatter.format(new Date(communique.publishedAt))}
                </time>
              </div>
              <h3>
                <Link href={`/c/${communique.id}`}>{communique.title}</Link>
              </h3>
              <p>{communique.summary}</p>
              <Link
                className="text-link"
                href={`/c/${communique.id}`}
                aria-label={`Leer ${communique.title}`}
              >
                Leer comunicado <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
