import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicCommunique } from '../../../../shared/mocks/public-communiques';

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export default async function PublicCommuniquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const communique = getPublicCommunique(id);

  if (!communique) {
    notFound();
  }

  return (
    <article className="public-article" aria-labelledby="communique-title">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Volver a comunicados
      </Link>

      <header className="public-article__header">
        <p className="eyebrow">{communique.category} · Ejemplo</p>
        <h1 id="communique-title">{communique.title}</h1>
        <time dateTime={communique.publishedAt}>
          Publicado el{' '}
          {dateFormatter.format(new Date(communique.publishedAt))}
        </time>
      </header>

      <aside className="plain-language" aria-labelledby="plain-language-title">
        <p className="eyebrow">En pocas palabras</p>
        <h2 id="plain-language-title">Lo esencial</h2>
        <p>{communique.simplifiedContent}</p>
      </aside>

      <section className="public-article__body" aria-label="Contenido del comunicado">
        {communique.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <p className="demo-disclaimer">
        Contenido de demostración: no representa un aviso oficial ni una
        instrucción vigente.
      </p>

      <div className="article-actions">
        <Link
          className="button button--primary"
          href={`/preguntar?comunicado=${communique.id}`}
        >
          Preguntar sobre este comunicado
        </Link>
      </div>
    </article>
  );
}
