import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CommuniqueTools } from '../../../../shared/components/communique-tools';
import {
  getPublishedClarifications,
  getPublishedCommunique,
  PublicClarification,
} from '../../../../shared/api/public-communiques';

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export const dynamic = 'force-dynamic';

export default async function PublicCommuniquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  let communique: Awaited<ReturnType<typeof getPublishedCommunique>>;
  try {
    communique = await getPublishedCommunique(slug);
  } catch (error) {
    console.error('Could not load published communique', error);
    return (
      <section className="public-article" role="alert">
        <p>No se pudo cargar el comunicado. Intenta actualizar la página.</p>
        <Link className="back-link" href="/">
          Volver a comunicados
        </Link>
      </section>
    );
  }

  if (!communique) {
    notFound();
  }

  let clarifications: PublicClarification[] = [];
  let clarificationsError = false;
  try {
    clarifications = await getPublishedClarifications(communique.id);
  } catch (error) {
    console.error('Could not load published clarifications', error);
    clarificationsError = true;
  }

  return (
    <article className="public-article" aria-labelledby="communique-title">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Volver a comunicados
      </Link>

      <header className="public-article__header">
        <p className="eyebrow">{communique.language}</p>
        <h1 id="communique-title">{communique.title}</h1>
        {communique.publishedAt && (
          <time dateTime={communique.publishedAt}>
            Publicado el{' '}
            {dateFormatter.format(new Date(communique.publishedAt))}
          </time>
        )}
      </header>

      <aside className="plain-language" aria-labelledby="plain-language-title">
        <p className="eyebrow">En pocas palabras</p>
        <h2 id="plain-language-title">Lo esencial</h2>
        <p>
          {communique.simplifiedContent ??
            'Este comunicado aún no cuenta con una versión en palabras simples.'}
        </p>
      </aside>

      <section className="public-article__body" aria-label="Contenido del comunicado">
        {communique.content.split(/\n{2,}/).map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
      </section>

      <CommuniqueTools
        slug={communique.slug}
        title={communique.title}
        content={communique.content}
        simplifiedContent={communique.simplifiedContent}
        translations={communique.translations}
      />

      {clarificationsError ? (
        <p className="form-message" role="alert">
          No se pudieron cargar las aclaraciones de este comunicado.
        </p>
      ) : (
        clarifications.length > 0 && (
          <section className="public-clarifications" aria-labelledby="clarifications-title">
            <h2 id="clarifications-title">Aclaraciones oficiales</h2>
            {clarifications.map((clarification) => (
              <article className="dashboard-panel" key={clarification.id}>
                <h3>{clarification.title}</h3>
                <p>{clarification.content}</p>
              </article>
            ))}
          </section>
        )
      )}

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
