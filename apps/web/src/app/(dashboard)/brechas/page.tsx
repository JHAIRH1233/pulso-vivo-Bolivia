import { GapAnalysisPanel } from '../../../shared/components/gap-analysis-panel';

export default function DashboardGapsPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-gaps-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Revisión del contenido</p>
        <h1 id="dashboard-gaps-title">Información por completar</h1>
        <p>
          Analiza un comunicado antes de publicarlo e identifica detalles que
          conviene confirmar.
        </p>
      </header>
      <GapAnalysisPanel />
    </section>
  );
}
