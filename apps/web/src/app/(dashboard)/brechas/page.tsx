import { dashboardGaps } from '../../../shared/mocks/institutional-dashboard';

export default function DashboardGapsPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-gaps-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Revisión del contenido</p>
        <h1 id="dashboard-gaps-title">Información por completar</h1>
        <p>
          Ejemplos de datos importantes que una institución podría aclarar
          antes de publicar un comunicado.
        </p>
      </header>
      <div className="dashboard-card-grid">
        {dashboardGaps.map((gap) => (
          <article className="dashboard-panel" key={gap.topic}>
            <div className="dashboard-card__meta">
              <span className="dashboard-status">{gap.status}</span>
              <span>Información faltante</span>
            </div>
            <h2>{gap.topic}</h2>
            <p>{gap.detail}</p>
            {gap.evidence && (
              <blockquote className="dashboard-evidence">
                “{gap.evidence}”
              </blockquote>
            )}
            <p className="dashboard-demo-label">Hallazgo de demostración</p>
          </article>
        ))}
      </div>
    </section>
  );
}
