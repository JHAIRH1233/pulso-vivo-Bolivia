import { resolve } from 'node:path';
import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../dist/generated/prisma-client/client.js';

config({ path: resolve(process.cwd(), '../../.env') });
config({ path: resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL no está definido en el archivo .env');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('Iniciando carga de datos de prueba para Pulso Vivo Bolivia (Rimay)...');

  // Limpiar datos existentes en orden inverso por relaciones
  await prisma.clarification.deleteMany();
  await prisma.question.deleteMany();
  await prisma.confusionCluster.deleteMany();
  await prisma.communiqueTranslation.deleteMany();
  await prisma.communique.deleteMany();

  console.log('Limpieza previa completada.');

  // 1. Comunicado Vacunación Antirrábica (La Paz / El Alto)
  const vacunas = await prisma.communique.create({
    data: {
      slug: 'campana-vacunacion-antirrabica-2026',
      title: 'Gran Campaña Departamental de Vacunación Canina y Felina Gratuita 2026',
      language: 'ES',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      content: `El Gobierno Autónomo Municipal, en coordinación con el Servicio Departamental de Salud (SEDES), comunica a toda la población que en cumplimiento de la Resolución Administrativa N° 148/2026 se llevará a cabo la Campaña Masiva de Inmunización Antirrábica para animales de compañía (caninos y felinos).

La jornada se desarrollará los días sábado 28 y domingo 29 del presente mes, en el horario continuo de 08:00 a 16:30 horas. Se habilitarán brigadas móviles y puntos fijos en todos los centros de salud municipales, módulos policiales y plazas principales de los 14 distritos urbanos y áreas periurbanas.

REQUISITOS OBLIGATORIOS:
1. Las mascotas deben tener una edad mínima de tres (3) meses cumplidos.
2. Todo canino deberá portar collar y correa de sujeción manipulado por una persona mayor de edad. En caso de razas potencialmente peligrosas o temperamento reactivo, será obligatorio el uso de bozal canastilla.
3. Se recomienda portar el carnet de vacunación anterior si se cuenta con él; caso contrario, se extenderá un nuevo certificado oficial de manera gratuita.
4. No se vacunará a hembras en periodo de gestación avanzada ni animales que presenten sintomatología febril evidente.

La inmunización es un acto de corresponsabilidad ciudadana y salud pública. ¡Protege a tu familia y a tu comunidad!`,
      simplifiedContent: `¡Vacunación gratuita contra la rabia para perritos y gatitos!

- ¿Cuándo?: Sábado 28 y domingo 29, de 8:00 de la mañana a 4:30 de la tarde.
- ¿Dónde?: En la plaza principal de tu barrio, centros de salud y módulos policiales.
- ¿Qué necesitas?:
  1. Tu mascota debe tener al menos 3 meses de edad.
  2. Llévala con correa. Si es brava, ponle bozal.
  3. La debe llevar una persona adulta.
  4. Si tienes su carnet anterior, llévalo. Si no tienes, te darán uno nuevo sin costo.

Costo: 100% gratis. No vacunes a perritas que estén por dar a luz o animalitos enfermos.`,
      translations: {
        create: [
          {
            language: 'QU',
            title: 'Allqukunapaq misikunapaqpas Rabia hampiy Hatun Willakuy 2026',
            content: `Llapa llaqta masikunata willayku: Kay sabado 28 domingo 29 p'unchawkunapi, llapa centros de salud nisqapi, plazas principales nisqapipas allqukunata misikunatapas rabia unquymanta mana qullqillapaq hampisunchik.

Hampinapaq:
1. Uywayki kinsa killayuqmanta wichayman kanan tiyan.
2. Allquykitataq waskhawan watasqata pusankiraq.
3. Carnetninta apay; mana kaptinqa, musuq carnetta mana qullqillapaq qusunkiku.

Mana qullqipaqchu, tukuy runapaq qhasi!`,
          },
        ],
      },
      questions: {
        create: [
          {
            text: '¿Puedo llevar a mi perrito si tiene 2 meses y medio? Ya camina y come solo.',
            language: 'ES',
            status: 'PENDING',
          },
          {
            text: '¿Tiene algún costo el carnet o el cintillo que les ponen en el cuello?',
            language: 'ES',
            status: 'PENDING',
          },
          {
            text: '¿Van a pasar casa por casa o solo estarán parados en la plaza?',
            language: 'ES',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  // Cluster de confusión y aclaración para Vacunación
  const clusterVacunas = await prisma.confusionCluster.create({
    data: {
      communiqueId: vacunas.id,
      title: 'Dudas sobre edad mínima y costo de los carnets',
      summary: 'Múltiples ciudadanos preguntan si se pueden vacunar cachorros menores a 3 meses y si existe cobro por el carnet oficial de vacunación.',
      status: 'ACTIVE',
    },
  });

  await prisma.clarification.create({
    data: {
      communiqueId: vacunas.id,
      clusterId: clusterVacunas.id,
      title: 'Aclaración oficial: Edad de vacunación y gratuidad total',
      content: '1. No se pueden vacunar mascotas menores a 3 meses por prescripción veterinaria de seguridad inmunológica.\n2. La vacuna, el cintillo y el carnet oficial son totalmente gratuitos, prohibiéndose cualquier cobro.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // 2. Comunicado Corte de Agua por Mantenimiento (Cochabamba - SEMAPA)
  const agua = await prisma.communique.create({
    data: {
      slug: 'corte-programado-agua-red-norte',
      title: 'Aviso de Interrupción Temporal del Servicio de Agua Potable en la Red Zona Norte',
      language: 'ES',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      content: `La Empresa Municipal de Agua Potable y Alcantarillado comunica a los usuarios del Subsistema Norte que, debido a trabajos impostergables de interconexión y sustitución de válvulas reguladoras en la aducción principal, se procederá al corte programado del suministro.

ÁREAS COMPRENDIDAS:
Distritos 2 y 12: Zonas de Queru Queru, Cala Cala, Mayorazgo, Tupuraya y Sarco.

CRONOGRAMA DE INTERRUPCIÓN:
- Inicio: Jueves 26 de noviembre a partir de las 06:00 a.m.
- Restablecimiento progresivo: Viernes 27 de noviembre a partir de las 14:00 p.m.

MEDIDAS DE CONTINGENCIA:
Se dispondrá de cuatro (4) camiones cisterna que recorrerán prioritariamente hospitales, asilos y centros educativos del sector afectado. Se exhorta a los usuarios tomar las previsiones necesarias de almacenamiento responsable.`,
      simplifiedContent: `Corte de agua en la Zona Norte por arreglo de cañerías.

- ¿Cuándo se corta?: El jueves 26 a las 6:00 de la mañana.
- ¿Cuándo vuelve?: El viernes 27 desde las 2:00 de la tarde en adelante.
- Barrios afectados: Cala Cala, Queru Queru, Tupuraya, Sarco y Mayorazgo.
- Cisternas: Habrá cisternas de apoyo prioritario para colegios y hospitales.
- Recomendación: Junta agua limpia en recipientes tapados el miércoles por la noche.`,
      translations: {
        create: [
          {
            language: 'QU',
            title: 'Zona Norte nisqapi Yaku T\'aqaymanta Willakuy',
            content: `Tukuy llaqta masikunata willayku: Jueves 26 p'unchaw tutamanta 6:00 pachamanta pacha, viernes 27 chisi 2:00 pachakama yaku t'aqasqa kanqa.

Cala Cala, Queru Queru, Tupuraya, Sarco kitikunapi allichaykunata ruwasaqku. Cisternakuna purinqa hospitales nisqaman.
Allinta yakuta wakichikuychik!`,
          },
        ],
      },
      questions: {
        create: [
          {
            text: '¿A qué número se puede llamar para pedir que la cisterna pase por mi calle?',
            language: 'ES',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  // 3. Comunicado Descuento Tributario (Potosí / Chuquisaca)
  await prisma.communique.create({
    data: {
      slug: 'descuento-15-impuestos-bienes-inmuebles-2026',
      title: 'Plan de Incentivo Tributario: 15% de Descuento en Pago de Impuestos a Bienes Inmuebles',
      language: 'ES',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      content: `La Dirección de Recaudaciones hace conocer a todos los contribuyentes propietarios de bienes inmuebles y vehículos automotores que entra en vigencia el periodo de descuento por pronto pago del 15% correspondiente a la gestión fiscal 2025-2026.

BENEFICIARIOS Y VIGENCIA:
El descuento del 15% aplica al pago al contado efectuado hasta el 31 de diciembre del año en curso. A partir del 1 de enero, el beneficio se reducirá al 10%.

CANALES DE COBRO HABILITADOS:
- Entidades financieras autorizadas (Banca por internet y cajeros de toda la red bancaria nacional con código RUAT).
- Plataforma de Recaudaciones de la Casa Municipal de 08:30 a 17:00 en horario continuo.
- Pago en línea mediante código QR a través del portal oficial.

Aproveche este beneficio y mantenga sus tributos municipales al día.`,
      simplifiedContent: `¡Aprovecha el 15% de descuento en el pago de tus impuestos de casa o auto!

- ¿Cómo obtener el descuento?: Paga tus impuestos al contado antes del 31 de diciembre.
- ¿Dónde pagar?:
  1. En cualquier banco o desde tu aplicación de banco en el celular (buscando RUAT).
  2. Pagando con QR desde tu celular.
  3. En las oficinas de la Alcaldía de 8:30 a 17:00 continuo.
- Importante: A partir de enero el descuento bajará al 10%, ¡paga a tiempo y ahorra!`,
      translations: {
        create: [
          {
            language: 'QU',
            title: 'Wasikikunamanta Impuestos Pisiyachispa Qullqi Quymanta',
            content: `Tukuy wasiyuqkunata, autoyuqkunatawan willayku: 31 de diciembre p'unchawkama impuestos nisqata qullqita quptiykichikqa, 15% pisiyachisqa kanqa.
Bancokunapi, QR nisqawanpas utqhayllata pagayta atinkichik. Ama suyakuychikchu!`,
          },
        ],
      },
    },
  });

  // 4. Noticia: Centro de Salud Kallpa Wasi (Zona Sur)
  await prisma.communique.create({
    data: {
      slug: 'inauguracion-centro-salud-zona-sur',
      title: 'Inauguración del Nuevo Centro de Salud Integral con Atención Bilingüe en la Zona Sur',
      language: 'ES',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      content: `El Gobierno Autónomo Municipal de Cochabamba entrega a los vecinos del Distrito 8 el nuevo Centro de Salud Integral 'Kallpa Wasi', equipado con tecnología médica moderna y personal bilingüe capacitado en quechua y español.

El establecimiento prestará servicios de medicina general, odontología, pediatría, laboratorio clínico, farmacia y atención de emergencias las 24 horas del día, los 7 días de la semana.

BENEFICIARIOS:
Más de 35.000 familias de los barrios del Cono Sur y comunidades aledañas que antes debían trasladarse hasta el centro de la ciudad para recibir atención básica.`,
      simplifiedContent: `¡Nuevo centro de salud 24 horas con atención en quechua y español en la Zona Sur!

• Ubicación: Distrito 8 (Kallpa Wasi).
• Atención: Médicos de guardia las 24 horas, todos los días del año.
• Servicios disponibles: Medicina general, pediatría, odontología, farmacia municipal y laboratorio.
• Importante: El personal médico habla quechua y español para que te sientas cómodo explicando tus síntomas.`,
      translations: {
        create: [
          {
            language: 'QU',
            title: 'Distrito 8 nisqapi Kallpa Wasi hampi wasi kicharikun',
            content: `Musuq Centro de Salud 'Kallpa Wasi' nisqa kicharikun Distrito 8 kiti suyupi. Doctoreskuna quechua simipi castellanopipas rimanku. 24 horas p'unchaw tuta qhasi qhawasunki.`,
          },
        ],
      },
    },
  });

  // 5. Convocatoria: Becas y Prácticas Municipales UMSS
  await prisma.communique.create({
    data: {
      slug: 'convocatoria-becas-pasantias-municipales-2026',
      title: 'Convocatoria Pública a Becas Universitarias y Prácticas Municipales 2026',
      language: 'ES',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      content: `La Universidad Mayor de San Simón (UMSS), en convenio interinstitucional con el Gobierno Autónomo Municipal de Cochabamba, convoca a estudiantes de los últimos cursos de todas las carreras al Programa de Prácticas Profesionales y Becas de Apoyo a la Gestión Municipal 2026.

REQUISITOS:
- Ser estudiante regular matriculado en la gestión académica actual.
- Haber aprobado al menos el 75% de la malla curricular correspondiente.
- Promedio académico ponderado igual o superior a 65 puntos.
- Disponibilidad de cuatro (4) horas diarias continuas en turno mañana o tarde.

BENEFICIOS:
- Asignación económica mensual para transporte y refrigerio.
- Certificación oficial con valor curricular emitida conjuntamente por la UMSS y la Alcaldía.`,
      simplifiedContent: `Convocatoria abierta para pasantías pagadas de estudiantes de la UMSS en la Alcaldía.

• ¿Quiénes pueden postular?: Estudiantes que hayan vencido al menos el 75% de sus materias y tengan promedio de 65 puntos o más.
• Horario: 4 horas al día (puedes elegir en la mañana o en la tarde).
• Beneficios: Apoyo económico mensual para pasajes y refrigerio, y certificado oficial para tu currículum.
• Fechas: Del 1 al 15 de diciembre en la Dirección de Interacción Social de la UMSS.`,
      translations: {
        create: [
          {
            language: 'QU',
            title: 'UMSS yachakuqkunapaq Alcaldiapi llamk\'aymanta willakuy',
            content: `UMSS yachay wasimanta Alcaldiamanpas llamk'ayta munaspa, yachakuqkunapaq musuq becaskuna llamk'aykunapas kan. Utqhayllata qillqachikuychik!`,
          },
        ],
      },
    },
  });

  console.log('✅ Base de datos poblada exitosamente con 5 documentos oficiales (comunicados, noticias, convocatorias y beneficios), traducciones, preguntas y aclaraciones.');
}

main()
  .catch((e) => {
    console.error('Error al poblar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
