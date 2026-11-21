import Link from 'next/link';
import { QuestionForm } from '../../../shared/components/question-form';
import { getPublicCommunique } from '../../../shared/mocks/public-communiques';

export default async function AskQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ comunicado?: string }>;
}) {
  const { comunicado: communiqueId } = await searchParams;
  const selectedCommunique = communiqueId
    ? getPublicCommunique(communiqueId)
    : undefined;

  return (
    <section className="question-page" aria-labelledby="question-title">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Volver a comunicados
      </Link>
      <div className="page-intro">
        <p className="eyebrow">Participación ciudadana</p>
        <h1 id="question-title">¿Qué necesitas aclarar?</h1>
        <p>
          Comparte una pregunta sobre la información pública. En esta
          demostración, el formulario no envía ni guarda datos.
        </p>
      </div>
      <QuestionForm
        initialCommuniqueId={selectedCommunique?.id ?? ''}
      />
    </section>
  );
}
