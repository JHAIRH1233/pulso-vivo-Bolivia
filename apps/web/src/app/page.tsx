import Image from 'next/image';
import Link from 'next/link';
import { CommunicationPreview } from '../shared/components/communication-preview';
import { publicCommuniques } from '../shared/mocks/public-communiques';

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

const steps = [
  {
    number: '01',
    title: 'La institución comparte el comunicado',
    description:
      'El flujo comienza con un aviso, una convocatoria o un texto oficial.',
    icon: '▤',
  },
  {
    number: '02',
    title: 'Se revisa qué información podría faltar',
    description:
      'Fechas, lugares, horarios y requisitos ayudan a la gente a actuar.',
    icon: '⌕',
  },
  {
    number: '03',
    title: 'La comunidad entiende y pregunta',
    description:
      'La información se presenta en palabras simples y en idiomas que más personas comprenden.',
    icon: '◌',
  },
];

const institutionBenefits = [
  {
    title: 'Información más completa',
    description:
      'Identifica detalles importantes que podrían faltar antes de publicar un aviso.',
  },
  {
    title: 'Dudas agrupadas por tema',
    description:
      'Comprende qué puntos generan preguntas para poder responder con claridad.',
  },
  {
    title: 'Aclaraciones para revisar',
    description:
      'Prepara propuestas que el equipo puede revisar antes de compartirlas.',
  },
];

export default function Home() {
  return (
    <div className="landing-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-section__copy">
          <p className="hero-kicker">Comunicación pública clara</p>
          <h1 id="hero-title">
            Tu idioma.
            <br />
            Tu voz.
            <br />
            Tu municipio.
          </h1>
          <p className="hero-section__description">
            Rimay busca que los comunicados de las instituciones sean más
            fáciles de entender, con versiones en palabras simples y, más
            adelante, en quechua con revisión comunitaria.
          </p>
          <div className="hero-section__actions">
            <Link className="button button--primary" href="#comunicados">
              Soy ciudadano
            </Link>
            <Link className="button button--secondary" href="#para-instituciones">
              Soy institución
            </Link>
          </div>
          <p className="hero-section__assurance">
            Prototipo de interfaz <span aria-hidden="true">·</span> Contenido y
            herramientas en desarrollo
          </p>
        </div>
        <aside className="hero-section__aside" aria-label="A quiénes acompaña Rimay">
          <div className="hero-section__logo">
            <Image
              src="/rimay-logo.jpeg"
              alt="Rimay: tu idioma, tu voz, tu municipio"
              width={1200}
              height={900}
              priority
            />
          </div>
          <div className="audience-card">
            <h2>Pensado para</h2>
            <ul className="audience-list">
              <li>Alcaldías</li>
              <li>Gobernaciones</li>
              <li>Ministerios</li>
              <li>OTBs</li>
              <li>Centros de salud</li>
            </ul>
          </div>
        </aside>
      </section>

      <section
        className="process-section"
        id="como-funciona"
        aria-labelledby="process-title"
      >
        <header className="section-intro">
          <p className="section-kicker">Cómo funciona</p>
          <h2 id="process-title">
            Del comunicado oficial a una conversación clara
          </h2>
          <p>
            Tres pasos para que la información llegue a la comunidad sin
            intermediarios.
          </p>
        </header>
        <ol className="steps-grid">
          {steps.map((step) => (
            <li className="step-card" key={step.number}>
              <div className="step-card__top">
                <span className="step-card__icon" aria-hidden="true">
                  {step.icon}
                </span>
                <span className="step-card__number">{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="language-section" aria-labelledby="language-title">
        <div className="language-section__copy">
          <p className="section-kicker">Un mismo mensaje, más accesible</p>
          <h2 id="language-title">Que nadie se quede con la duda</h2>
          <p>
            Una comunicación clara se puede leer de distintas maneras. Rimay
            propone acercar la información oficial en formatos pensados para
            cada persona.
          </p>
          <ul className="language-benefits">
            <li>Palabras simples y frases cortas.</li>
            <li>Quechua con revisión comunitaria, en desarrollo.</li>
            <li>Preguntas vinculadas al comunicado.</li>
          </ul>
          <Link className="text-link" href="#comunicados">
            Explorar comunicados <span aria-hidden="true">→</span>
          </Link>
        </div>
        <CommunicationPreview />
      </section>

      <section
        className="public-section"
        id="comunicados"
        aria-labelledby="communiques-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-kicker">Para la ciudadanía</p>
            <h2 id="communiques-title">Conoce los comunicados</h2>
          </div>
          <p>
            Estos ejemplos muestran cómo podría presentarse la información.
            No son avisos oficiales.
          </p>
        </div>

        <div className="communique-grid">
          {publicCommuniques.map((communique) => (
            <article className="communique-card" key={communique.id}>
              <div className="communique-card__meta">
                <span className="category-tag">{communique.category}</span>
                <time dateTime={communique.publishedAt}>
                  {dateFormatter.format(new Date(communique.publishedAt))}
                </time>
              </div>
              <h3>
                <Link href={`/c/${communique.id}`}>{communique.title}</Link>
              </h3>
              <p>{communique.summary}</p>
              <Link
                className="text-link"
                href={`/c/${communique.id}`}
                aria-label={`Leer ${communique.title}`}
              >
                Leer comunicado <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="institution-section"
        id="para-instituciones"
        aria-labelledby="institution-title"
      >
        <div className="institution-section__copy">
          <p className="section-kicker">Para instituciones</p>
          <h2 id="institution-title">Hacia comunicados más claros</h2>
          <p>
            Estamos desarrollando herramientas para revisar qué información
            falta y comprender las preguntas de la comunidad.
          </p>
          <p className="demo-disclaimer">
            Las funciones para instituciones aún están en desarrollo. Esta
            sección muestra una propuesta.
          </p>
          <Link className="button button--primary" href="#como-funciona">
            Conocer el proceso
          </Link>
        </div>
        <ul className="institution-benefits">
          {institutionBenefits.map((benefit) => (
            <li key={benefit.title}>
              <span className="benefit-check" aria-hidden="true">
                ✓
              </span>
              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
