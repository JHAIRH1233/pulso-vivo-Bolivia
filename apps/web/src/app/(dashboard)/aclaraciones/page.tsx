import { ClarificationsPanel } from '../../../shared/components/clarifications-panel';

export default async function DashboardClarificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ clusterId?: string }>;
}) {
  const { clusterId } = await searchParams;
  return (
    <section
      className="dashboard-page"
      aria-labelledby="dashboard-clarifications-title"
    >
      <header className="dashboard-page__header">
        <p className="section-kicker">Revisión editorial</p>
        <h1 id="dashboard-clarifications-title">Aclaraciones propuestas</h1>
        <p>
          Crea borradores, revísalos y publícalos después de confirmar cada dato
          con información oficial.
        </p>
      </header>
      <ClarificationsPanel initialClusterId={clusterId} />
    </section>
  );
}
