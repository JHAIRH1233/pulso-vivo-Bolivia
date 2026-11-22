export interface DocumentItem {
  id: string;
  slug: string;
  title: string;
  institution: string;
  category: 'Comunicado' | 'Noticia' | 'Convocatoria' | 'Bono';
  content: string;
  simplifiedContent: string;
  quechuaContent?: string;
  audioUrl?: string;
  publishedAt: string;
  sourceUrl?: string;
  sourceName?: string;
  formats: ('simple' | 'quechua' | 'audio')[];
  gaps?: {
    topic: string;
    explanation: string;
    evidence?: string;
    clarifyingQuestion: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
    answerQuechua?: string;
  }[];
}

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    "id": "6b0248b2e98e0a216f66285d",
    "slug": "6b0248b2e98e0a216f66285d",
    "title": "Consulta en línea de información catastral y territorial",
    "institution": "Innova Cochabamba",
    "category": "Comunicado",
    "publishedAt": "2026-11-06T08:00:00Z",
    "sourceName": "Innova Cochabamba",
    "sourceUrl": "https://innova.cochabamba.bo/menu-consultaAtlas",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "Innova Cochabamba informa que la ciudadanía puede consultar información catastral y territorial del municipio a través de su portal de consulta. La herramienta permite revisar datos del predio, la zona y el uso de suelo. La consulta está disponible para propietarios, vecinos y personas interesadas en la información territorial del municipio. Para realizar la consulta es necesario ingresar el código catastral o la dirección del predio. La información mostrada es de referencia y no reemplaza los documentos oficiales emitidos por el municipio.",
    "simplifiedContent": "Puedes revisar los datos de tu terreno en el portal de Innova Cochabamba. La página muestra la zona, el uso de suelo y datos del predio. Necesitas el código catastral o la dirección. Lo que muestra la página es solo una referencia: no reemplaza los papeles oficiales.",
    "quechuaContent": "Innova Cochabamba willan: llaqtap allpanmanta willakuykunata portalninkupi qhawayta atinki. Chaypi allpaykip zona, imayna apaykachakusqan, willakuykunapas rikun. Código catastral icha direcciónta churay. Chay willakuyqa yanapallapaqmi, mana oficial papelespa rantinchu.",
    "audioUrl": "Innova Kochabamba willan: llaqtap allpanmanta willakuykunata portalninkupi khawayta atinki. Chaypi allpaykip zona, imayna apaykachakusqan, willakuykunapas rikun. Kodigo katastral icha direksionta churay. Chay willakuyqa yanapallapaqmi, mana ofisial papelespa rantinchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica el horario de disponibilidad del servicio en línea.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el horario de disponibilidad del servicio en línea.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se explica cómo obtener el código catastral si no se lo conoce.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se explica cómo obtener el código catastral si no se lo conoce.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se indica a quién acudir si la información del predio es incorrecta.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica a quién acudir si la información del predio es incorrecta.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se menciona si el servicio tiene algún costo.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se menciona si el servicio tiene algún costo.?"
      }
    ],
    "faqs": [
      {
        "question": "¿La página funciona los fines de semana?",
        "answer": "Para más información sobre este punto en Innova Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Puedo ver el plano de mi terreno?",
        "answer": "Para más información sobre este punto en Innova Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Qué hago si mis datos están mal?",
        "answer": "Para más información sobre este punto en Innova Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿La consulta tiene costo?",
        "answer": "Para más información sobre este punto en Innova Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b0248b21335a8237b0db9b2",
    "slug": "6b0248b21335a8237b0db9b2",
    "title": "Cochabamba habilita nuevos puntos de atención ciudadana",
    "institution": "Gobierno Autónomo Municipal de Cochabamba",
    "category": "Noticia",
    "publishedAt": "2026-11-10T08:00:00Z",
    "sourceName": "Portal del Estado",
    "sourceUrl": "https://www.gob.bo/entidades/gobierno-autonomo-municipal-de-cochabamba",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Gobierno Autónomo Municipal de Cochabamba habilitó nuevos puntos de atención ciudadana en distintos distritos del municipio. En estos puntos se pueden realizar trámites de catastro, licencias y pagos de impuestos municipales. La atención está dirigida a toda la población del municipio. Las personas interesadas deben presentar su cédula de identidad y los documentos propios de cada trámite. El municipio informó que se ampliará la atención a más distritos en los próximos meses.",
    "simplifiedContent": "La Alcaldía de Cochabamba abrió nuevos puntos para hacer trámites en varios distritos. Puedes hacer trámites de catastro, licencias y pagar impuestos. Lleva tu cédula y los papeles de tu trámite. El comunicado no dice las direcciones ni el horario.",
    "quechuaContent": "Cochabamba municipiqa achka distritokunapi musuq atiendana wasikunata kicharirqan. Chaypi catastro, licencia ruwayta, impuestokunata pagayta atinki. Cédulaykita, trámiteykimapaq papeleskunatapas apamuy. Manaraqmi ni direccionkunata ni ima horasta willakunchu.",
    "audioUrl": "Kochabamba municipika achka distritokunapi musuk atiendana wasikunata kicharikhan. Chaypi katastro, lisensia ruwayta, impuestokunata pagayta atinki. Sedulaykita, tramiteykimapak papeleskunatapas apamuy. Manarakmi ni direksionkunata ni ima horasta willakunchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica la dirección de los nuevos puntos de atención.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica la dirección de los nuevos puntos de atención.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se indica el horario de atención.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el horario de atención.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se detallan los requisitos de cada trámite.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se detallan los requisitos de cada trámite.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se indica si se necesita reservar un turno.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica si se necesita reservar un turno.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Atienden en la tarde?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Qué documentos llevo?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Necesito sacar un turno?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Qué trámites puedo hacer ahí?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Cochabamba, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b0248b128a2c9084b6c0d51",
    "slug": "6b0248b128a2c9084b6c0d51",
    "title": "Licencia de funcionamiento: nuevos requisitos municipales",
    "institution": "Gobierno Autónomo Municipal de Cochabamba",
    "category": "Comunicado",
    "publishedAt": "2026-11-12T08:00:00Z",
    "sourceName": "Alcaldía de Cochabamba",
    "sourceUrl": "https://www.cochabamba.bo/",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Gobierno Autónomo Municipal de Cochabamba informa a comerciantes y emprendedores sobre la actualización de los requisitos para la licencia de funcionamiento de actividades económicas. Los interesados deben presentar la solicitud en las oficinas de atención al contribuyente. Entre los requisitos se encuentran la fotocopia de la cédula de identidad, el croquis del local y la declaración de actividad económica. La atención se realiza de lunes a viernes. El municipio recuerda que la licencia es obligatoria para el funcionamiento de cualquier negocio.",
    "simplifiedContent": "La Alcaldía de Cochabamba cambió los requisitos para la licencia de funcionamiento de los negocios. Tienes que ir a las oficinas de atención al contribuyente y llevar copia de tu cédula, un dibujo del local y una declaración de tu actividad. Atienden de lunes a viernes. No dice a qué hora ni cuánto cuesta.",
    "quechuaContent": "Cochabamba municipiqa negocioykip licencia funcionamientopaq musuq requisitokunata willan. Contribuyentekunata atiendenankuman rishpa cédulaykip ranti qillqata, localniykimapaq siq'ita, actividadniykimanta declaracióntapas apamuy. Lunesta vierniskama atienden. Manaraqmi ni ima horasta ni ima qullqitachus willakunchu.",
    "audioUrl": "Kochabamba municipi-ka nejosioykip lisensia funsionamientopaq musuk resikisito-kunata willan. Kontribuyentekunata atiendenankuman rishpa sedulaykip ranti killkata, losalniykimapaq sikita, aktiwidadniykimanta deklarasiontapas apamuy. Lunesta vierneskama atienden. Manarakmi ni ima horasta ni ima kullkitachus willakunchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica el horario de atención.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el horario de atención.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se especifica el costo de la licencia.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se especifica el costo de la licencia.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se indica cuánto tiempo tarda la emisión del documento.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica cuánto tiempo tarda la emisión del documento.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se menciona qué pasa con las licencias emitidas anteriormente.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se menciona qué pasa con las licencias emitidas anteriormente.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Qué requisitos hay?",
        "answer": "Debes presentar fotocopia de tu cédula de identidad, croquis de ubicación del local y la declaración jurada de actividad económica.",
        "answerQuechua": "Cédulaykip ranti qillqata, localniykimapaq siq'ita, actividadniykimanta declaracióntapas apamunayki tiyan."
      },
      {
        "question": "¿Dónde presento la solicitud?",
        "answer": "La solicitud se presenta de forma presencial en las oficinas de atención al contribuyente del municipio de Cochabamba, de lunes a viernes.",
        "answerQuechua": "Mañakuytaqa Cochabamba municipio contribuyente atendina wasikunapi churanayki tiyan, lunesta vierniskama."
      },
      {
        "question": "¿Cuánto cuesta?",
        "answer": "El comunicado oficial no especifica el costo del trámite; es una de las brechas detectadas pendientes de aclaración por la Alcaldía.",
        "answerQuechua": "Comunicadopiqa mana qullqimanta sut'inchankuchu; municipio clarified kanan tiyan."
      }
    ]
  },
  {
    "id": "6b0248b0c2486135781ec3b8",
    "slug": "6b0248b0c2486135781ec3b8",
    "title": "Sucre estrena un área verde en el centro histórico",
    "institution": "Gobierno Autónomo Municipal de Sucre",
    "category": "Noticia",
    "publishedAt": "2026-10-18T08:00:00Z",
    "sourceName": "Gobierno Autónomo Municipal de Sucre",
    "sourceUrl": "https://www.gob.bo",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Gobierno Autónomo Municipal de Sucre inauguró una nueva área verde en el centro histórico de la ciudad. El espacio cuenta con árboles nativos, juegos para niñas y niños y bancas de descanso. La obra busca ampliar los espacios de encuentro para las familias del municipio. La Alcaldía invita a la población a cuidar las plantas y a mantener limpio el lugar. El horario de apertura será el mismo de los parques municipales.",
    "simplifiedContent": "La Alcaldía de Sucre abrió un nuevo parque en el centro de la ciudad. Tiene árboles, juegos para niños y bancas para descansar. Puedes ir con tu familia. Cuida las plantas y no dejes basura. El comunicado no dice en qué calle está.",
    "quechuaContent": "Sucre municipiqa llaqtap chawpinpi musuq sach'a pampata kicharirqan. Chaypi sach'akuna, wawakunapaq pukllanakuna, samanapaq tiyanakunapas kan. Familiaykiwan riy. Sach'akunata qhawariy, ama basurata saqiychu.",
    "audioUrl": "Sukre munisipika llaktap chawpinpi musuk sacha pampata kicharirkan. Chaypi sachakuna, wawakunapak pukllanakuna, samanapak tiyanakunapas kan. Familiaykiwan riy. Sachakunata khawariy, ama basurata sakiychu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica la ubicación exacta del área verde.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica la ubicación exacta del área verde.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se indica el horario de apertura de los parques municipales.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el horario de apertura de los parques municipales.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se menciona si hay baños o accesibilidad para sillas de ruedas.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se menciona si hay baños o accesibilidad para sillas de ruedas.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se indica a quién contactar para reportar daños.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica a quién contactar para reportar daños.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Cómo reporto un daño en los juegos?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Sucre, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Se puede llevar mascotas?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Sucre, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿El parque tiene baños?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Sucre, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Hasta qué hora está abierto?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de Sucre, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b0248a1389b63bc6028cb16",
    "slug": "6b0248a1389b63bc6028cb16",
    "title": "Campaña gratuita de vacunación en La Paz",
    "institution": "Gobierno Autónomo Municipal de La Paz",
    "category": "Comunicado",
    "publishedAt": "2026-10-22T08:00:00Z",
    "sourceName": "Gobierno Autónomo Municipal de La Paz",
    "sourceUrl": "https://www.gob.bo",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Gobierno Autónomo Municipal de La Paz inició una campaña gratuita de vacunación en los centros de salud del municipio. La campaña está dirigida a niñas y niños menores de cinco años y a personas adultas mayores. La atención se realiza en los centros de salud municipales. Las personas interesadas deben presentar la cédula de identidad y el carnet de vacunación. La campaña se extenderá hasta agotar las dosis disponibles.",
    "simplifiedContent": "La Alcaldía de La Paz está vacunando gratis en sus centros de salud. Pueden ir niñas y niños menores de 5 años y personas mayores. Lleva tu cédula y tu carnet de vacunas. No dice a qué hora atienden ni hasta qué día dura la campaña.",
    "quechuaContent": "La Paz municipiqa qullqiman mana pagaspa vacuna qallarirqan. Pichqa wata mana hunt'asqa wawakuna, yuqaykusqa runakunapas rinkuman. Cédulaykita, vacuna carnetniykitapas apamuy. Manaraqmi ni ima horasta ni ima p'unchawkama kasqanta willakunchu.",
    "audioUrl": "La Paz munisipika kullkiman mana pagaspa vacuna kallarirkan. Pichka wata mana huntasqa wawakuna, yukaykuska runakunapas rinkuman. Cedulaykita, vacuna karnetniykitapas apamuy. Manarakmi ni ima horasta ni ima punchawkama kasqanta willakunchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica el horario de atención.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el horario de atención.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se especifica la fecha de inicio ni de finalización de la campaña.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se especifica la fecha de inicio ni de finalización de la campaña.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se indica qué vacunas se aplican.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica qué vacunas se aplican.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se menciona un teléfono de consulta.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se menciona un teléfono de consulta.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Hay atención los sábados?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de La Paz, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Dónde queda el centro de salud?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de La Paz, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Puedo llevar a mi mamá de 70 años?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de La Paz, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Qué vacunas están aplicando?",
        "answer": "Para más información sobre este punto en Gobierno Autónomo Municipal de La Paz, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b0248a05963e273a241b3ce",
    "slug": "6b0248a05963e273a241b3ce",
    "title": "Certificados de nacimiento: nuevo trámite digital",
    "institution": "Ministerio de Salud",
    "category": "Comunicado",
    "publishedAt": "2026-10-29T08:00:00Z",
    "sourceName": "Ministerio de Salud",
    "sourceUrl": "https://www.gob.bo",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Ministerio de Salud informa que el trámite de certificados de nacimiento ahora puede realizarse de forma digital. Las personas interesadas deben ingresar al portal del ministerio y registrar sus datos personales. El sistema permite solicitar el certificado y descargarlo en formato digital. El trámite está dirigido a madres, padres y personas responsables del registro de niñas y niños. Para completar la solicitud se debe contar con una cuenta de correo electrónico. El certificado digital tiene la misma validez que el certificado físico.",
    "simplifiedContent": "Ahora puedes pedir el certificado de nacimiento por internet. Entra al portal del ministerio, llena tus datos y descarga el certificado. Necesitas un correo electrónico. El certificado digital vale igual que el de papel. El comunicado no dice cuánto tarda ni si cuesta algo.",
    "quechuaContent": "Kunanqa nacesqa certificadota internetpi mañakuyta atinki. Ministeriop portalman haykuspa willakuykikunata hunt'achiy, chaymanta certificadota descargay. Correo electrónico nisqayki kanan tiyan. Kay certificadoqa papelvezwan kikillan valorniyoqmi.",
    "audioUrl": "Kunanka naceska certificadota internetpi manakuyta atinki. Ministeriop portalman haykuspa willakuykikunata huntachiy, chaymanta certificadota descargay. Correo electronico niskayki kanan tiyan. Kay certificadoka papelvezwan kikillan valorniyokmi.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica el enlace del portal donde se realiza el trámite.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el enlace del portal donde se realiza el trámite.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se menciona cuánto tarda la entrega del certificado.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se menciona cuánto tarda la entrega del certificado.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se indica si el trámite tiene algún costo.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica si el trámite tiene algún costo.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se especifica qué hacer si el registro de nacimiento no existe.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se especifica qué hacer si el registro de nacimiento no existe.?"
      }
    ],
    "faqs": [
      {
        "question": "¿El certificado digital sirve para todos los trámites?",
        "answer": "Para más información sobre este punto en Ministerio de Salud, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Qué hago si mi hijo no está registrado?",
        "answer": "Para más información sobre este punto en Ministerio de Salud, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿El trámite es gratuito?",
        "answer": "Para más información sobre este punto en Ministerio de Salud, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Cuánto tarda el certificado?",
        "answer": "Para más información sobre este punto en Ministerio de Salud, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b02489f7c227ee03505f310",
    "slug": "6b02489f7c227ee03505f310",
    "title": "Bono Pepe: beneficiarios, fechas y lugares de pago",
    "institution": "Ministerio de Economía y Finanzas Públicas",
    "category": "Bono",
    "publishedAt": "2026-11-05T08:00:00Z",
    "sourceName": "Ministerio de Economía y Finanzas Públicas",
    "sourceUrl": "https://www.gob.bo",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Bono Pepe es un apoyo económico para las personas adultas mayores del país. Son beneficiarias las personas de 60 años o más que cumplan los requisitos establecidos. El pago se realiza en las entidades financieras autorizadas y también mediante los puntos de atención habilitados en los municipios. Para cobrar es necesario presentar la cédula de identidad original y vigente. Las personas que no puedan asistir personalmente pueden designar a un familiar autorizado. Las fechas de pago se publicarán en los canales oficiales del ministerio.",
    "simplifiedContent": "El Bono Pepe es una ayuda de dinero para las personas mayores de 60 años. Se cobra en bancos y en puntos de atención de los municipios. Debes llevar tu cédula original. Si no puedes ir, un familiar puede cobrar por ti, pero el comunicado no explica cómo autorizarlo. Las fechas todavía no están confirmadas.",
    "quechuaContent": "Bono Pepeqa 60 wata yuqaykusqa runakunapaq yanapay qullqim. Bancokunapi, municipiokunap atiendana wasinkunapipis cobrakun. Cédulaykita originalta apamuy. Mana riyta atispaqa familiayki cobranman, ichaqa manaraqmi imayna autorizakunata willakunchu.",
    "audioUrl": "Bono Pepeka 60 wata yukaykuska runakunapak yanapay kullkim. Bankokunapi, municipiokunap atiendana wasinkunapipis kobrakun. Cedulaykita originalta apamuy. Mana riyta atispaka familiayki kobranman, ichaka manarakmi imayna autorizakunata willakunchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica el monto del bono.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el monto del bono.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se detallan los requisitos además de la edad.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se detallan los requisitos además de la edad.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se indica cómo se designa a un familiar autorizado.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica cómo se designa a un familiar autorizado.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se especifica el horario de atención en los puntos de pago.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se especifica el horario de atención en los puntos de pago.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Ya hay fecha de pago?",
        "answer": "Para más información sobre este punto en Ministerio de Economía y Finanzas Públicas, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Cómo autorizo a un familiar para que cobre?",
        "answer": "Para más información sobre este punto en Ministerio de Economía y Finanzas Públicas, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Dónde se cobra en Cochabamba?",
        "answer": "Para más información sobre este punto en Ministerio de Economía y Finanzas Públicas, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Qué documentos necesito llevar?",
        "answer": "Para más información sobre este punto en Ministerio de Economía y Finanzas Públicas, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b02489e1dc0b7920bc808b0",
    "slug": "6b02489e1dc0b7920bc808b0",
    "title": "Bono Juancito Pinto: quiénes lo reciben y cómo cobrarlo",
    "institution": "Ministerio de Educación",
    "category": "Bono",
    "publishedAt": "2026-11-08T08:00:00Z",
    "sourceName": "Ministerio de Educación",
    "sourceUrl": "https://www.gob.bo",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "El Ministerio de Educación recuerda a las familias bolivianas que el Bono Juancito Pinto es un incentivo a la permanencia escolar. Lo reciben las y los estudiantes inscritos en unidades educativas fiscales y de convenio de todo el país. El pago se realiza en las entidades financieras habilitadas, presentando la cédula de identidad del estudiante o del padre o madre de familia. El beneficio se entrega una vez al año por estudiante matriculado. Las fechas de pago serán comunicadas por el ministerio.",
    "simplifiedContent": "El Bono Juancito Pinto es un dinero de apoyo para que los estudiantes no dejen el colegio. Lo reciben los estudiantes de colegios fiscales y de convenio. Se cobra una vez al año en los bancos habilitados, mostrando la cédula del estudiante o de su papá o mamá. Todavía no se sabe la fecha exacta ni el monto.",
    "quechuaContent": "Juancito Pinto qullqiqa yachaqkunata yanapanapaqmi, mana yachay wasita saqinankupaq. Estado yachay wasipi qillqakusqa wawakunallapaqmi. Sapa wata huk kuti bancokunapi cobrakun, wawap cédulanwan icha tayta-mamanpa cédulanwan. Manaraqmi p'unchawta willakunchu.",
    "audioUrl": "Juancito Pinto kullkika yachakkunata yanapanapakmi, mana yachay wasita sakinankupak. Estado yachay wasipi killkakuska wawakunallapakmi. Sapa wata huk kuti bankokunapi kobrakun, wawap cedulanwan icha tayta-mamanpa cedulanwan. Manarakmi punchawta willakunchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica el monto del bono.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el monto del bono.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se indica la fecha exacta de pago.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica la fecha exacta de pago.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "No se especifica qué entidades financieras están habilitadas.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se especifica qué entidades financieras están habilitadas.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se indica qué hacer si el estudiante no tiene cédula de identidad.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica qué hacer si el estudiante no tiene cédula de identidad.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Qué pasa si mi hijo repitió el año?",
        "answer": "Para más información sobre este punto en Ministerio de Educación, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Los estudiantes de colegios particulares reciben el bono?",
        "answer": "Para más información sobre este punto en Ministerio de Educación, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Mi hijo puede cobrar sin cédula?",
        "answer": "Para más información sobre este punto en Ministerio de Educación, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿En qué banco se cobra?",
        "answer": "Para más información sobre este punto en Ministerio de Educación, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  },
  {
    "id": "6b02489df94c621a4eb7befd",
    "slug": "6b02489df94c621a4eb7befd",
    "title": "Inscripción a la UMSS: fechas, requisitos y documentos",
    "institution": "Universidad Mayor de San Simón",
    "category": "Convocatoria",
    "publishedAt": "2026-11-14T08:00:00Z",
    "sourceName": "UMSS",
    "sourceUrl": "https://www.umss.edu.bo",
    "formats": [
      "simple",
      "quechua",
      "audio"
    ],
    "content": "La Universidad Mayor de San Simón informa a la población que se abre la inscripción para la admisión a las carreras de la gestión 2027. Las personas interesadas deben presentar su documentación en las oficinas de la universidad. La inscripción está dirigida a bachilleres y a estudiantes de último curso de unidades educativas. Los requisitos son los siguientes: fotocopia de cédula de identidad, fotocopia del título de bachiller y dos fotografías. La modalidad de ingreso es el examen de admisión. Las fechas de inscripción y el lugar exacto de atención se comunicarán en los próximos días.",
    "simplifiedContent": "La UMSS abre la inscripción para entrar a sus carreras en 2027. Puedes inscribirte si terminaste el colegio o si estás en el último curso. Lleva copia de tu cédula, copia de tu título de bachiller y dos fotos. Para entrar debes dar el examen de admisión. Todavía no se sabe la fecha ni la oficina exacta donde debes ir.",
    "quechuaContent": "San Simón jatun yachay wasim willan: 2027 watapaq yachay wasiman qillqakuy kicharisqaña. Qillqakuyta munaspaqa kaykunata apamuy: cédulaykip ranti qillqa, bachiller títuloykip ranti qillqa, iskay fotokuna. Yachay wasiman haykunapaq examen apakunqa. Manaraqmi ni p'unchaw ni maypi qillqakuna willakunchu.",
    "audioUrl": "San Simon jatun yachay wasim willan: 2027 watapaq yachay wasiman killkakuy kicharisqana. Killkakuyta munaspaqa kaykunata apamuy: cedulaykip ranti killqa, bachiller tituloykip ranti killqa, iskay fotokuna. Yachay wasiman haykunapaq examen apakunqa. Manaraqmi ni punchaw ni maypi killkakuna willakunchu.",
    "gaps": [
      {
        "topic": "Aspecto por aclarar #1",
        "explanation": "No se indica la fecha de inscripción.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica la fecha de inscripción.?"
      },
      {
        "topic": "Aspecto por aclarar #2",
        "explanation": "No se indica el horario de atención.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica el horario de atención.?"
      },
      {
        "topic": "Aspecto por aclarar #3",
        "explanation": "El lugar de inscripción no está especificado: solo dice 'oficinas de la universidad'.",
        "clarifyingQuestion": "¿Podría la institución aclarar: el lugar de inscripción no está especificado: solo dice 'oficinas de la universidad'.?"
      },
      {
        "topic": "Aspecto por aclarar #4",
        "explanation": "No se menciona el costo ni la forma de pago del examen de admisión.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se menciona el costo ni la forma de pago del examen de admisión.?"
      },
      {
        "topic": "Aspecto por aclarar #5",
        "explanation": "No se indica un teléfono o correo de contacto.",
        "clarifyingQuestion": "¿Podría la institución aclarar: no se indica un teléfono o correo de contacto.?"
      }
    ],
    "faqs": [
      {
        "question": "¿Cuál es el teléfono de la oficina de inscripción?",
        "answer": "Para más información sobre este punto en Universidad Mayor de San Simón, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Hay inscripción en línea?",
        "answer": "Para más información sobre este punto en Universidad Mayor de San Simón, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Puedo inscribirme si todavía estoy en el último curso?",
        "answer": "Para más información sobre este punto en Universidad Mayor de San Simón, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      },
      {
        "question": "¿Cuánto cuesta el examen de admisión?",
        "answer": "Para más información sobre este punto en Universidad Mayor de San Simón, consulta la versión simple del comunicado o comunícate con la entidad oficial.",
        "answerQuechua": "Astawan willakuyta munanki chayqa, versión simple nisqata qhaway icha oficial wasipi tapurikuy."
      }
    ]
  }
];
