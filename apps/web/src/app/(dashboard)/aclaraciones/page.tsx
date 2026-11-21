import { draftClarifications } from '../../../shared/mocks/institutional-dashboard';

export default function DashboardClarificationsPage() {
  return (
    <section
      className="dashboard-page"
      aria-labelledby="dashboard-clarifications-title"
    >
      <header className="dashboard-page__header">
        <p className="section-kicker">Revisión editorial</p>
        <h1 id="dashboard-clarifications-title">Aclaraciones propuestas</h1>
        <p>
          Borradores de ejemplo para que el equipo institucional los revise y
          redacte con información oficial antes de compartirlos.
        </p>
      </header>
      <div className="dashboard-card-grid">
        {draftClarifications.map((clarification) => (
          <article className="dashboard-panel" key={clarification.title}>
            <div className="dashboard-card__meta">
              <span className="dashboard-status">{clarification.status}</span>
              <span>{clarification.source}</span>
            </div>
            <h2>{clarification.title}</h2>
            <p>{clarification.body}</p>
            <p className="dashboard-demo-label">
              Borrador de demostración · no publicado
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
