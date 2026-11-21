import Link from 'next/link';
import { getPublishedCommuniques } from '../../../shared/api/public-communiques';
import { QuestionForm } from '../../../shared/components/question-form';

export const dynamic = 'force-dynamic';

export default async function AskQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ comunicado?: string }>;
}) {
  const { comunicado: communiqueId } = await searchParams;
  let communiques: Awaited<ReturnType<typeof getPublishedCommuniques>> = [];
  let loadError = false;
  try {
    communiques = await getPublishedCommuniques();
  } catch (error) {
    console.error('Could not load communiques for question form', error);
    loadError = true;
  }
  const selectedCommuniqueId = communiques.some(
    (communique) => communique.id === communiqueId,
  )
    ? communiqueId ?? ''
    : '';

  return (
    <section className="question-page" aria-labelledby="question-title">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Volver a comunicados
      </Link>
      <div className="page-intro">
        <p className="eyebrow">Participación ciudadana</p>
        <h1 id="question-title">¿Qué necesitas aclarar?</h1>
        <p>
          Comparte una pregunta sobre la información pública. El equipo
          institucional la recibirá para revisión.
        </p>
      </div>
      {loadError && (
        <p className="form-message" role="alert">
          No se pudo cargar la lista de comunicados. Puedes enviar una pregunta
          general.
        </p>
      )}
      <QuestionForm
        communiques={communiques}
        initialCommuniqueId={selectedCommuniqueId}
      />
    </section>
  );
}
