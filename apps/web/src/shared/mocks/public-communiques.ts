export interface PublicCommunique {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  summary: string;
  simplifiedContent: string;
  content: string[];
}

export const publicCommuniques: PublicCommunique[] = [
  {
    id: 'corte-agua-ejemplo',
    title: 'Ejemplo: interrupción programada del servicio de agua',
    category: 'Servicios públicos',
    publishedAt: '2026-11-18T12:00:00.000Z',
    summary:
      'Aviso de demostración sobre una suspensión temporal del servicio en una zona de la ciudad.',
    simplifiedContent:
      'El servicio de agua se suspenderá el jueves 19 de noviembre, de 08:00 a 14:00, en el Distrito Central. Durante ese horario, guarda el agua que necesites.',
    content: [
      'Este comunicado es contenido de demostración. Presenta un ejemplo de cómo se mostraría un aviso de interrupción programada de un servicio público.',
      'En un comunicado oficial se incluirían las zonas afectadas, la fecha y las horas exactas, el motivo del corte y un canal de contacto para consultas.',
    ],
  },
  {
    id: 'vacunacion-ejemplo',
    title: 'Ejemplo: jornada de vacunación comunitaria',
    category: 'Salud',
    publishedAt: '2026-11-14T12:00:00.000Z',
    summary:
      'Aviso de demostración para una jornada gratuita de vacunación y orientación a la comunidad.',
    simplifiedContent:
      'La jornada de vacunación es gratuita. Lleva tu carnet de vacunas si tienes uno. El personal de salud podrá orientarte.',
    content: [
      'Este comunicado es contenido de demostración. Sirve para ilustrar cómo se presentarían actividades y servicios dirigidos a la comunidad.',
      'Un aviso oficial detallaría el lugar, la fecha, los horarios, las vacunas disponibles y los documentos que se recomienda llevar.',
    ],
  },
];

export function getPublicCommunique(
  id: string,
): PublicCommunique | undefined {
  return publicCommuniques.find((communique) => communique.id === id);
}
