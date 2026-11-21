import { ConfusionRadarPanel } from '../../../shared/components/confusion-radar-panel';

export default function DashboardRadarPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-radar-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Escucha comunitaria</p>
        <h1 id="dashboard-radar-title">Radar de dudas</h1>
        <p>
          Agrupa preguntas pendientes por tema. El panel no muestra el texto
          individual de las preguntas.
        </p>
      </header>
      <ConfusionRadarPanel />
    </section>
  );
}
