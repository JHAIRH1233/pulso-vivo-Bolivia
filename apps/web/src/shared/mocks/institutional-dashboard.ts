export const dashboardGaps = [
  {
    topic: 'Lugar de atención',
    detail: 'El aviso no identifica el centro de salud donde se realizará la jornada.',
    evidence: 'Jornada gratuita de vacunación comunitaria.',
    status: 'Por revisar',
  },
  {
    topic: 'Horario',
    detail: 'Falta indicar a qué hora empieza y termina la actividad.',
    evidence: 'La actividad se realizará este viernes.',
    status: 'Por revisar',
  },
  {
    topic: 'Documentos necesarios',
    detail: 'No se aclara si las personas deben llevar algún documento.',
    evidence: null,
    status: 'En revisión',
  },
];

export const questionClusters = [
  {
    topic: 'Lugar de atención',
    count: 12,
    example: '¿En qué centro de salud será?',
    trend: 'Tema más consultado',
  },
  {
    topic: 'Fecha y horario',
    count: 8,
    example: '¿A qué hora comienza la jornada?',
    trend: 'Consultas recientes',
  },
  {
    topic: 'Requisitos',
    count: 5,
    example: '¿Debo llevar mi carnet de vacunas?',
    trend: 'Tema recurrente',
  },
];

export const draftClarifications = [
  {
    title: 'Precisar el lugar de atención',
    source: 'Grupo: Lugar de atención',
    status: 'Borrador',
    body: 'Añadir el nombre y la dirección del centro de salud donde se realizará la actividad.',
  },
  {
    title: 'Aclarar fecha y horario',
    source: 'Grupo: Fecha y horario',
    status: 'Pendiente de revisión',
    body: 'Indicar la fecha completa, la hora de inicio y la hora de finalización.',
  },
];
