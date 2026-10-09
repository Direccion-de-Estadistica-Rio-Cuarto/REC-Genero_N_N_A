/* ==========================================================================
   tablero.js — Lógica interactiva del Recursero (Género, Niñez, Adolescencia y Familia)
   Orientado a la derivación ágil por profesionales municipales y equipos sociales.
   Integración con la base de infraestructura y espacios municipales de Río Cuarto.
   ========================================================================== */

let todosLosRecursos = [];
let todosLosEspacios = [];
let espaciosByCapsNum = new Map();
let espaciosList = [];
let recursosFiltrados = [];
let ejeActivo = 'todos';
let vistaActual = 'tarjetas'; // 'tarjetas' o 'tabla'
let ultimoBotonFoco = null;
let sedeActualModal = null;

// Guardias de urgencia preconfiguradas y líneas directas
const GUARDIAS_DESTACADAS = [
  {
    titulo: 'Guardia de Violencia de Género',
    telefono: '3585605564',
    telefonoLimpio: '5493585605564',
    horario: 'Atención 24 hs (emergencias)',
    dependencia: 'Subsecretaría de Género, Diversidad y Discapacidad',
    tipo: 'genero',
    icono: 'shield_person'
  },
  {
    titulo: 'Guardia de Niñez y Adolescencia',
    telefono: '3585168117',
    telefonoLimpio: '5493585168117',
    horario: 'Lunes a domingos de 14:00 a 08:00 hs',
    dependencia: 'Subsecretaría de Niñez, Adolescencia y Familia',
    tipo: 'ninez',
    icono: 'family_restroom'
  },
  {
    titulo: 'Guardia Social y Contingencias',
    telefono: '3585480179',
    telefonoLimpio: '5493585480179',
    horario: 'Riesgo crítico y situación de calle',
    dependencia: 'Subsecretaría de Desarrollo Social',
    tipo: 'social',
    icono: 'emergency_home'
  },
  {
    titulo: 'Ojos en Alerta (Prevención Local)',
    telefono: '3584283693',
    telefonoLimpio: '5493584283693',
    horario: 'Solo WhatsApp · Emergencia en vía pública',
    dependencia: 'Secretaría de Prevención y Convivencia',
    tipo: 'prevencion',
    icono: 'chat'
  },
  {
    titulo: 'Línea 144 (Violencia de Género)',
    telefono: '144',
    telefonoLimpio: '144',
    horario: 'Gratuita nacional · 24 hs los 365 días',
    dependencia: 'Atención, contención y asesoramiento',
    tipo: 'genero',
    icono: 'call'
  },
  {
    titulo: 'Línea 102 (Derechos de Niñez)',
    telefono: '102',
    telefonoLimpio: '102',
    horario: 'Gratuita y confidencial · 24 hs',
    dependencia: 'Protección integral de niños, niñas y adolescentes',
    tipo: 'ninez',
    icono: 'record_voice_over'
  }
];

// Mapeo de imágenes ilustrativas de programas municipales (assets/img/recursos/...)
const MAPA_IMAGENES_PROGRAMAS = {
  'enfoque integral de la atencion primaria de la salud': 'assets/img/recursos/atencion-primaria.jpg',
  'deporte social': 'assets/img/recursos/deporte-social.jpg',
  'mercado urbano': 'assets/img/recursos/mercado-urbano.jpg',
  'programa plenitud y movimiento': 'assets/img/recursos/plenitud-y-movimiento.jpg',
  'plenitud y movimiento': 'assets/img/recursos/plenitud-y-movimiento.jpg',
  'programa trama emprendedora': 'assets/img/recursos/trama-emprendedora.webp',
  'trama emprendedora': 'assets/img/recursos/trama-emprendedora.webp',
  'escuela de carpinteria municipal': 'assets/img/recursos/escuela-de-carpinteria.jpg',
  'escuela de carpinteria': 'assets/img/recursos/escuela-de-carpinteria.jpg',
  'politicas de diversidad': 'assets/img/recursos/politicas-de-diversidad.jpg',
  'inmunizaciones': 'assets/img/recursos/inmunizaciones.jpg',
  'cedis (centro de dia e integracion social)': 'assets/img/recursos/cedis.jpg',
  'cedis': 'assets/img/recursos/cedis.jpg',
  'centro de dia e integracion social': 'assets/img/recursos/cedis.jpg'
};

// Mapeo exhaustivo de Derechos a Iconos de Google Material Symbols y Colores Institucionales
const MAPA_DERECHOS = {
  // Violencia y Género -> Serie 8 (Rojo institucional / Urgencia y Protección)
  'Derecho A Vivir Una Vida Libre De Violencias': {
    icono: 'shield',
    serie: 'serie-8'
  },

  // Niñez, Adolescencia e Identidad -> Serie 4 (Rosa institucional)
  'Derecho A La Protección Especial De Niños, Niñas Y Adolescentes': {
    icono: 'child_care',
    serie: 'serie-4'
  },
  'Derecho A La Identidad (Incluye Identidad De Género)': {
    icono: 'badge',
    serie: 'serie-4'
  },

  // Familia, Convivencia y Trabajo -> Serie 2 (Naranja institucional)
  'Derecho A La Convivencia Familiar Y Comunitaria': {
    icono: 'diversity_3',
    serie: 'serie-2'
  },
  'Derecho Al Trabajo': {
    icono: 'work',
    serie: 'serie-2'
  },
  'Derecho A La Protección Social': {
    icono: 'volunteer_activism',
    serie: 'serie-2'
  },

  // Salud y Ambiente -> Serie 3 (Verde institucional)
  'Derecho A La Salud': {
    icono: 'health_and_safety',
    serie: 'serie-3'
  },
  'Derecho A Un Ambiente Saludable': {
    icono: 'eco',
    serie: 'serie-3'
  },

  // Educación, DDHH y Participación -> Serie 1 (Celeste institucional)
  'Derecho A La Educación': {
    icono: 'school',
    serie: 'serie-1'
  },
  'Derecho A La Libre Asociación, Participación, Expresión E Información': {
    icono: 'forum',
    serie: 'serie-1'
  },
  'Derecho A La Participación Y Comunidad': {
    icono: 'groups',
    serie: 'serie-1'
  },

  // Inclusión, Igualdad y Dignidad -> Serie 5 (Violeta institucional)
  'Derecho A La Inclusión Y Accesibilidad': {
    icono: 'accessible',
    serie: 'serie-5'
  },
  'Derecho A La Igualdad Y No Discriminación': {
    icono: 'balance',
    serie: 'serie-5'
  },
  'Derecho A La Dignidad Y A La Integridad Personal': {
    icono: 'sentiment_satisfied',
    serie: 'serie-5'
  },

  // Deporte, Juego y Recreación -> Serie 6 (Amarillo/Dorado institucional)
  'Derecho Al Descanso, La Recreación, El Deporte Y El Juego': {
    icono: 'sports_soccer',
    serie: 'serie-6'
  },
  'Derecho Al Deporte, Juego Y Recreación': {
    icono: 'sports_soccer',
    serie: 'serie-6'
  },

  // Seguridad, Institucionalidad y Documentación -> Serie 7 (Petróleo institucional)
  'Derecho A La Documentación E Identidad': {
    icono: 'assignment_ind',
    serie: 'serie-7'
  },
  'Derecho A La Seguridad Ciudadana': {
    icono: 'local_police',
    serie: 'serie-7'
  },
  'Derecho A La Seguridad Social': {
    icono: 'verified_user',
    serie: 'serie-7'
  }
};

// Obtener icono y color institucional para un derecho dado
function obtenerMetaDerecho(nombreDerecho) {
  if (!nombreDerecho) return { icono: 'bookmark', serie: 'serie-1' };
  const d = nombreDerecho.trim();
  if (MAPA_DERECHOS[d]) return MAPA_DERECHOS[d];

  const norm = normalizarTexto(d);
  if (norm.includes('violenc') || norm.includes('genero')) return { icono: 'shield', serie: 'serie-8' };
  if (norm.includes('nin') || norm.includes('adolesc')) return { icono: 'child_care', serie: 'serie-4' };
  if (norm.includes('salud')) return { icono: 'health_and_safety', serie: 'serie-3' };
  if (norm.includes('educac')) return { icono: 'school', serie: 'serie-1' };
  if (norm.includes('inclusi') || norm.includes('accesib')) return { icono: 'accessible', serie: 'serie-5' };
  if (norm.includes('trabaj')) return { icono: 'work', serie: 'serie-2' };
  if (norm.includes('deport') || norm.includes('recreac') || norm.includes('juego')) return { icono: 'sports_soccer', serie: 'serie-6' };
  if (norm.includes('segurid')) return { icono: 'local_police', serie: 'serie-7' };
  if (norm.includes('ambient')) return { icono: 'eco', serie: 'serie-3' };
  if (norm.includes('familia') || norm.includes('comunitari')) return { icono: 'diversity_3', serie: 'serie-2' };
  if (norm.includes('identidad')) return { icono: 'badge', serie: 'serie-4' };

  return { icono: 'bookmark', serie: 'serie-1' };
}

// Iniciar aplicación al cargar el DOM
async function iniciar() {
  try {
    renderizarGuardias();
    configurarEventosUI();
    await cargarDatos();
  } catch (error) {
    console.error('Error al inicializar el recursero:', error);
    mostrarError(error.message);
  }
}

// Cargar datasets desde datos/recursero.json y datos/espacios.json
async function cargarDatos() {
  const contador = document.getElementById('contador-resultados');
  if (contador) contador.textContent = 'Cargando recursos y espacios municipales...';

  const [resRecursero, resEspacios] = await Promise.all([
    fetch('datos/recursero.json'),
    fetch('datos/espacios.json')
  ]);

  if (!resRecursero.ok) {
    throw new Error(`No se pudo cargar la base de recursos (${resRecursero.status} ${resRecursero.statusText})`);
  }
  if (!resEspacios.ok) {
    throw new Error(`No se pudo cargar la base de espacios (${resEspacios.status} ${resEspacios.statusText})`);
  }

  todosLosRecursos = await resRecursero.json();
  todosLosEspacios = await resEspacios.json();

  indexarEspacios();
  enriquecerRecursos();

  recursosFiltrados = [...todosLosRecursos];

  poblarSelectores();
  actualizarConteosChips();
  pintarKpisGenerales();
  aplicarFiltros();
}

// Indexar espacios para búsquedas rápidas por CAPS, nombre, barrio y tipo
function indexarEspacios() {
  espaciosByCapsNum.clear();
  espaciosList = todosLosEspacios.map(e => {
    const normCentro = normalizarTexto(e.Centro || '');
    const normBarrio = normalizarTexto(e.Barrio || '');
    const capsMatch = (e.Centro || '').match(/(?:CAPS|Dispensario)\)?\s*(?:N[°ºo\.]*)?\s*(\d+)/i);
    if (capsMatch) {
      espaciosByCapsNum.set(parseInt(capsMatch[1], 10), e);
    }
    return {
      raw: e,
      normCentro,
      normBarrio,
      tipo: e.Tipo || '',
      id: e._id
    };
  });
}

// Buscar un espacio en el catálogo oficial
function buscarEspacio(query) {
  let nq = normalizarTexto(query);
  if (!nq) return null;

  // Equivalencias de centros conocidos (ej: Centro Once -> Centro 11)
  if (nq.includes('centro once')) {
    nq = nq.replace('centro once', 'centro 11');
  }

  // 1. Detección por número de CAPS / Dispensario / CP
  const numM = nq.match(/(?:caps|dispensario|cp|c\.p\.|c\.a\.p\.s\.)\s*(?:n[°ºo\.]*)?\s*(\d+)/i) || nq.match(/^(\d+)$/);
  if (numM) {
    const num = parseInt(numM[1], 10);
    if (espaciosByCapsNum.has(num)) return espaciosByCapsNum.get(num);
  }

  // 2. Coincidencia exacta de nombre
  for (const item of espaciosList) {
    if (item.normCentro === nq) return item.raw;
  }

  // 3. Coincidencia por contención bidireccional
  for (const item of espaciosList) {
    if (item.normCentro.includes(nq) || nq.includes(item.normCentro)) return item.raw;
  }

  // 4. Limpieza de prefijos institucionales comunes
  const cleanNq = nq.replace(/^(centro|asociacion|club|espacio|posta|vecinal|cgm|c\.g\.m\.|cim|cic)\s+(de\s+|del\s+)?/i, '').trim();
  if (cleanNq.length > 3) {
    for (const item of espaciosList) {
      if (item.normCentro.includes(cleanNq)) return item.raw;
    }
  }

  // 5. Scoring por palabras clave significativas
  const tokens = nq.split(/[\s,.'"]+/).filter(t => t.length >= 3 && !['centro','asociacion','vecinal','jubilados','pensionados','para','club','copa','leche','municipal','del','los','las','infantes'].includes(t));
  if (tokens.length > 0) {
    let mejorItem = null;
    let mejorPuntaje = 0;
    for (const item of espaciosList) {
      let score = 0;
      for (const t of tokens) {
        if (item.normCentro.includes(t)) score += 2;
        if (item.normBarrio.includes(t)) score += 1;
      }
      if (score > mejorPuntaje) {
        mejorPuntaje = score;
        mejorItem = item.raw;
      }
    }
    if (mejorPuntaje >= 2) return mejorItem;
  }

  return null;
}

// Obtener icono, clase de estilo y etiqueta de tipo para una sede
function obtenerMetaEspacio(espacio, nombreFallback) {
  const tipoStr = (espacio && espacio.Tipo ? espacio.Tipo : '').toLowerCase();
  const centroStr = ((espacio && espacio.Centro ? espacio.Centro : '') + ' ' + (nombreFallback || '')).toLowerCase();

  if (tipoStr.includes('salud') || centroStr.match(/caps|dispensario|posta|salud|maternidad|hospital|cedis/)) {
    return {
      icono: 'local_hospital',
      clase: 'btn-sede--salud',
      tipoLabel: 'Centro de Salud / CAPS'
    };
  }
  if (tipoStr.includes('adultos') || centroStr.match(/jubilad|pensionad|residencia|geriatrico/)) {
    return {
      icono: 'elderly',
      clase: 'btn-sede--adultos',
      tipoLabel: 'Centro de Jubilados / Adultos Mayores'
    };
  }
  if (tipoStr.includes('vecinal') || centroStr.match(/vecinal/)) {
    return {
      icono: 'diversity_3',
      clase: 'btn-sede--vecinal',
      tipoLabel: 'Asociación Vecinal'
    };
  }
  if (centroStr.match(/cgm|c\.g\.m\.|gestion municipal/)) {
    return {
      icono: 'apartment',
      clase: 'btn-sede--gobierno',
      tipoLabel: 'Centro de Gestión Municipal (CGM)'
    };
  }
  if (centroStr.match(/cim|cic|integrador municipal|integrador comunitario/)) {
    return {
      icono: 'hub',
      clase: 'btn-sede--cim',
      tipoLabel: 'Centro Integrador Municipal (CIM / CIC)'
    };
  }
  if (tipoStr.includes('educaci') || centroStr.match(/jardin|escuela|ipem|colegio|educat/)) {
    return {
      icono: 'school',
      clase: 'btn-sede--educacion',
      tipoLabel: 'Institución Educativa'
    };
  }
  if (tipoStr.includes('nutrici') || centroStr.match(/comunitario|copa de leche|comedor|alimento/)) {
    return {
      icono: 'soup_kitchen',
      clase: 'btn-sede--nutricion',
      tipoLabel: 'Centro Comunitario y Social'
    };
  }
  if (tipoStr.includes('deporte') || centroStr.match(/deport|polideportivo|tejo|futbol/)) {
    return {
      icono: 'sports_soccer',
      clase: 'btn-sede--deporte',
      tipoLabel: 'Espacio Deportivo'
    };
  }
  if (tipoStr.includes('cultura') || centroStr.match(/cultur|teatro|galpon/)) {
    return {
      icono: 'palette',
      clase: 'btn-sede--gobierno',
      tipoLabel: 'Espacio Cultural'
    };
  }
  if (tipoStr.includes('confesional') || centroStr.match(/capilla|parroquia|iglesia/)) {
    return {
      icono: 'church',
      clase: 'btn-sede--vecinal',
      tipoLabel: 'Espacio Comunitario'
    };
  }

  return {
    icono: 'place',
    clase: '',
    tipoLabel: espacio && espacio.Tipo ? espacio.Tipo : 'Espacio Referenciado'
  };
}

// Extraer y normalizar espacios de un programa
function extraerSedes(r) {
  const nombre = r['Nombre del Programa'] || '';
  const lugar = r['Lugar / Espacio'] || '';
  const desc = r['Descripción'] || '';

  // 1. Atención Primaria de la Salud (desglosado por los 16 CAPS + CS + Postas con profesionales y horarios)
  if (nombre.includes('Atención Primaria')) {
    const lines = desc.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let espActual = 'Medicina General';
    const map = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^(MEDICOS CLINICOS|MEDICOS PEDIATRAS|GINECOLOGIA|ODONTOLOGIA|SERVICIO DE KINESIOLOGIA|SERVICIO DE PSICOMOTRICIDAD|SERVICIO DE NUTRICION|SERVICIO DE PSICOLOGIA|SERVICIO DE PSICOPEDAGOGIA|SERVICIO DE TRABAJO SOCIAL|BIOQUIMICAS)$/i.test(line)) {
        espActual = line;
        continue;
      }
      const cpM = line.match(/^(?:CP|DISPENSARIO)\s*(\d+)(.*)/i);
      if (cpM) {
        const num = cpM[1];
        const sName = 'CAPS N° ' + num;
        let prof = cpM[2].trim();
        let hor = '';
        if (prof.includes('\t')) {
          const p = prof.split('\t').map(x => x.trim()).filter(Boolean);
          prof = p[0] || '';
          hor = p.slice(1).join(' ');
        }
        if (!prof && i + 1 < lines.length && !lines[i+1].startsWith('CP') && !lines[i+1].startsWith('DISPENSARIO')) {
          i++; prof = lines[i];
        }
        if (!hor && i + 1 < lines.length && !lines[i+1].startsWith('CP') && !lines[i+1].startsWith('DISPENSARIO') && !/^[A-Z\s]{4,30}$/.test(lines[i+1])) {
          i++; hor = lines[i];
        }
        if (!map.has(sName)) map.set(sName, []);
        map.get(sName).push({ especialidad: espActual, profesional: prof, horario: hor });
        continue;
      }
      if (line.startsWith('C DE SALUD') || line.startsWith('CENTRO DE SALUD')) {
        const sName = 'Centro de Salud (CS)';
        if (!map.has(sName)) map.set(sName, []);
        map.get(sName).push({ especialidad: espActual, profesional: line.replace(/^CENTRO DE SALUD|^C DE SALUD/, '').trim(), horario: '' });
      } else if (line.startsWith('ONCATIVO')) {
        const sName = 'Posta Sanitaria Oncativo';
        if (!map.has(sName)) map.set(sName, []);
        map.get(sName).push({ especialidad: espActual, profesional: line.replace(/^ONCATIVO/, '').trim(), horario: '' });
      } else if (line.startsWith('SANTA CLARA')) {
        const sName = 'Posta Sanitaria Santa Clara';
        if (!map.has(sName)) map.set(sName, []);
        map.get(sName).push({ especialidad: espActual, profesional: line.replace(/^SANTA CLARA/, '').trim(), horario: '' });
      }
    }

    const sedesCaps = Array.from(map.entries()).map(([k, v]) => ({
      nombre: k,
      actividad: 'Atención Primaria y Especialidades',
      espacio: buscarEspacio(k),
      detalles: v
    }));

    sedesCaps.sort((a, b) => {
      const numA = parseInt((a.nombre.match(/\d+/) || [999])[0], 10);
      const numB = parseInt((b.nombre.match(/\d+/) || [999])[0], 10);
      return numA - numB;
    });

    return sedesCaps;
  }

  // 2. Expresión Cultural (talleres agrupados por sede)
  if (nombre.includes('Expresión Cultural')) {
    const rawItems = lugar.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(s => s.trim().replace(/^\"+|\"+$/g, '')).filter(Boolean);
    const sedesMap = new Map();
    rawItems.forEach(item => {
      let actividad = '';
      let espacioStr = item;
      const m = item.match(/^(.*?)\s*["']{1,2}(.+?)["']{1,2}$/);
      if (m) {
        actividad = m[1].trim();
        espacioStr = m[2].trim();
      }
      espacioStr = espacioStr.replace(/^"+|"+$/g, '').trim();
      if (!espacioStr) return;
      if (!sedesMap.has(espacioStr)) {
        sedesMap.set(espacioStr, {
          nombre: espacioStr,
          actividades: [],
          espacio: buscarEspacio(espacioStr)
        });
      }
      if (actividad && !sedesMap.get(espacioStr).actividades.includes(actividad)) {
        sedesMap.get(espacioStr).actividades.push(actividad);
      }
    });
    return Array.from(sedesMap.values()).map(s => ({
      nombre: s.nombre,
      actividad: s.actividades.join(', '),
      espacio: s.espacio
    }));
  }

  // 3. Escuela de Carpintería Municipal (Taller central en Pueblo Alberdi)
  if (nombre.includes('Carpintería')) {
    const espCarp = buscarEspacio('Taller Escuela de Carpintería Municipal');
    return [{
      nombre: espCarp ? espCarp.Centro : 'Taller Escuela de Carpintería Municipal',
      actividad: 'Capacitación en oficios para jóvenes y adultos',
      espacio: espCarp
    }];
  }

  // 4. CEDIS (Centro de Día e Integración Social)
  if (nombre.toLowerCase().includes('cedis')) {
    const espCedis = buscarEspacio('Centro de Día e Integración Social (CEDIS)') || buscarEspacio('CEDIS');
    return [{
      nombre: espCedis ? espCedis.Centro : 'Centro de Día e Integración Social (CEDIS)',
      actividad: 'Atención psicológica, psiquiátrica, escucha individual y talleres comunitarios',
      espacio: espCedis
    }];
  }

  // 5. Caso general: Si no hay texto de lugar, retornamos array vacío
  if (!lugar.trim()) return [];

  // Separar por comas, puntos y comas o saltos de línea respetando comillas
  const rawList = lugar.split(/[,;\n]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
    .map(s => s.trim().replace(/^"+|"+$/g, '').replace(/""/g, '"'))
    .filter(Boolean);

  const sedes = [];
  const vistas = new Set();
  rawList.forEach(item => {
    let clean = item.trim();
    if (!clean || clean.length < 2) return;

    // Normalizar denominación de CAPS / Dispensarios
    const numCaps = clean.match(/(?:dispensario|caps|cp)\s*(?:n[°ºo\.]*)?\s*(\d+)/i);
    let nombreNorm = clean;
    if (numCaps) {
      nombreNorm = 'CAPS N° ' + numCaps[1];
    }
    const clave = nombreNorm.toLowerCase();
    if (vistas.has(clave)) return;
    vistas.add(clave);

    const esp = buscarEspacio(nombreNorm) || buscarEspacio(clean);
    sedes.push({
      nombre: nombreNorm,
      actividad: '',
      espacio: esp
    });
  });

  return sedes;
}

// Enriquecer registros con normalización para búsqueda rápida
function enriquecerRecursos() {
  todosLosRecursos.forEach(r => {
    const nomP = (r['Nombre del Programa'] || '').toLowerCase();
    const sec = (r['Secretaría'] || '').toLowerCase();

    // Inferencia de derecho si el campo viene vacío en la base
    if (!r['Derecho'] || !r['Derecho'].trim()) {
      if (sec.includes('deporte') || nomP.includes('deporte') || nomP.includes('ajedrez') || nomP.includes('plenitud')) {
        r['Derecho'] = 'Derecho Al Descanso, La Recreación, El Deporte Y El Juego';
      } else if (nomP.includes('atencion primaria') || nomP.includes('salud') || nomP.includes('cedis')) {
        r['Derecho'] = 'Derecho A La Salud';
      } else if (nomP.includes('ninez') || nomP.includes('adolescencia')) {
        r['Derecho'] = 'Derecho A La Protección Especial De Niños, Niñas Y Adolescentes';
      } else if (sec.includes('empleo') || sec.includes('trabajo') || nomP.includes('empleo') || nomP.includes('trama')) {
        r['Derecho'] = 'Derecho Al Trabajo';
      } else if (nomP.includes('memoria') || nomP.includes('escuela')) {
        r['Derecho'] = 'Derecho A La Educación';
      } else if (nomP.includes('vivienda') || nomP.includes('alquiler') || nomP.includes('escritura') || nomP.includes('habitat') || nomP.includes('loteo')) {
        r['Derecho'] = 'Derecho A La Protección Social';
      } else if (nomP.includes('huerta') || nomP.includes('pet')) {
        r['Derecho'] = 'Derecho A Un Ambiente Saludable';
      }
    }

    // Inferencia de secretaría si viene vacía en la base
    if (!r['Secretaría'] || !r['Secretaría'].trim()) {
      const sub = (r['Subsecretaría'] || '').toLowerCase();
      if (sub.includes('salud')) r['Secretaría'] = 'Salud';
      else if (sub.includes('genero') || sub.includes('ninez') || sub.includes('educacion')) r['Secretaría'] = 'Desarrollo Humano';
      else if (sub.includes('empleo')) r['Secretaría'] = 'Trabajo y Empleo';
    }

    // Enriquecimiento específico de CEDIS (datos complementarios si vienen vacíos en la base)
    if (nomP.includes('cedis')) {
      if (!r['Secretaría'] || !r['Secretaría'].trim()) r['Secretaría'] = 'Salud';
      if (!r['Subsecretaría'] || !r['Subsecretaría'].trim()) r['Subsecretaría'] = 'Salud';
      if (!r['Descripción'] || !r['Descripción'].trim()) {
        r['Descripción'] = 'Espacio municipal interdisciplinario de contención, escucha individual, atención psiquiátrica, psicoterapia y talleres comunitarios (expresiones artísticas, yoga, alfabetización, huerta y cursos EMCO) para la integración y acompañamiento social.';
      }
      if (!r['Teléfono / WhatsApp'] || !r['Teléfono / WhatsApp'].trim()) {
        r['Teléfono / WhatsApp'] = '03584768445 (Opc. 4, Int. 5183)';
      }
      if (!r['Correo electrónico'] || !r['Correo electrónico'].trim()) {
        r['Correo electrónico'] = 'cedisriocuarto@gmail.com';
      }
    }

    r._sedes = extraerSedes(r);

    // Texto de sedes y barrios para que la búsqueda por barrio / sede funcione instantáneamente
    const textoSedes = r._sedes.map(s => {
      const nom = s.nombre;
      const barrio = s.espacio ? s.espacio.Barrio : '';
      const sector = s.espacio ? s.espacio.Sector : '';
      const dom = s.espacio ? s.espacio.Domicilio : '';
      return `${nom} ${barrio} ${sector} ${dom}`;
    }).join(' ');

    r._norm = normalizarTexto([
      r['Nombre del Programa'],
      r['Descripción'],
      r['Derecho'],
      r['Secretaría'],
      r['Subsecretaría'],
      r['Área'],
      r['Lugar / Espacio'],
      r['Palabras Clave'],
      r['Teléfono / WhatsApp'],
      textoSedes
    ].filter(Boolean).join(' '));

    r._ejes = detectarEjes(r);

    // Imagen de portada del programa
    const nomNorm = normalizarTexto(r['Nombre del Programa'] || '');
    r._imagen = r['Imagen'] || r['Foto'] || MAPA_IMAGENES_PROGRAMAS[nomNorm] || null;

    // Texto resumido para tarjetas en programas con contenido masivo
    if (r['Nombre del Programa'] && r['Nombre del Programa'].includes('Atención Primaria')) {
      r._descPresentacion = 'Atención integral y territorial en los 16 Centros de Atención Primaria de la Salud (CAPS), Centro de Salud y Postas Sanitarias: medicina general, pediatría, ginecología, odontología, nutrición, psicología, psicopedagogía, trabajo social y kinesiología. Tocá cada CAPS para ver profesionales y horarios.';
    } else {
      r._descPresentacion = r['Descripción'];
    }
  });
}

// Normalización de texto (elimina tildes, pasa a minúsculas)
function normalizarTexto(txt) {
  if (!txt) return '';
  return String(txt)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Clasificación de cada recurso en ejes prioritarios
function detectarEjes(r) {
  const texto = r._norm;
  const ejes = [];

  if (texto.match(/violenc|genero|mujer|diversidad|abuso|trata|femicid/)) {
    ejes.push('violencia');
  }
  if (texto.match(/nin|adolesc|infan|crianza|jardin|proteccion especial|embarazo|puerperio/)) {
    ejes.push('ninez');
  }
  if (texto.match(/salud|maternidad|cancer|adicci|droga|consumo|sustancia|mental|hospital|dispensario|caps/)) {
    ejes.push('salud');
  }
  if (texto.match(/inclusi|accesib|discapacidad|diversidad|identidad|sordo|lengua de senas/)) {
    ejes.push('inclusion');
  }
  if (texto.match(/educac|escuela|ddhh|derechos humanos|memoria|beca|capacitac|formac|oficio|apoyo escolar/)) {
    ejes.push('educacion');
  }
  if (texto.match(/convivencia|comunitari|familia|vecin|social|vulnerable|habitat|deporte|recreac|alimento/)) {
    ejes.push('comunidad');
  }

  return ejes;
}

// Renderizar tarjetas de guardias de emergencia
function renderizarGuardias() {
  const cont = document.getElementById('grilla-guardias');
  if (!cont) return;

  cont.innerHTML = GUARDIAS_DESTACADAS.map(g => {
    const esSoloWhatsApp = g.horario.toLowerCase().includes('solo whatsapp');
    const esLineaCorta = g.telefonoLimpio.length <= 4;
    const linkTel = `tel:${g.telefonoLimpio}`;
    const linkWa = `https://wa.me/${g.telefonoLimpio}?text=${encodeURIComponent('Hola, me comunico por una consulta / derivación institucional.')}`;

    return `
      <article class="card-guardia card-guardia--${escapar(g.tipo)}">
        <div class="card-guardia-top">
          <p class="card-guardia-titulo">${escapar(g.titulo)}</p>
          <div class="card-guardia-horario">
            <span class="icono" aria-hidden="true" style="font-size:16px">${escapar(g.icono)}</span>
            <span>${escapar(g.horario)}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--texto-suave); margin:4px 0 0">
            ${escapar(g.dependencia)}
          </p>
        </div>
        <div class="card-guardia-acciones">
          ${!esSoloWhatsApp ? `
            <a href="${linkTel}" class="boton boton--primario boton--chico" title="Llamar a ${escapar(g.titulo)}">
              <span class="icono" aria-hidden="true">call</span>
              ${escapar(g.telefono)}
            </a>
          ` : ''}
          ${!esLineaCorta ? `
            <a href="${linkWa}" target="_blank" rel="noopener" class="boton boton--secundario boton--chico boton--whatsapp" title="Enviar WhatsApp a ${escapar(g.titulo)}">
              <img src="assets/img/whatsapp.png" class="icono-whatsapp" alt="" aria-hidden="true">
              WhatsApp
            </a>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');
}

// Poblar desplegables de filtros
function poblarSelectores() {
  const selDerecho = document.getElementById('filtro-derecho');
  const selSec = document.getElementById('filtro-secretaria');

  if (selDerecho) {
    const derechos = [...new Set(todosLosRecursos.map(r => r['Derecho']).filter(Boolean))].sort();
    derechos.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      selDerecho.appendChild(opt);
    });
  }

  if (selSec) {
    const secretarias = [...new Set(todosLosRecursos.map(r => r['Secretaría']).filter(Boolean))].sort();
    secretarias.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      selSec.appendChild(opt);
    });
  }
}

// Conteo para los chips de ejes temáticos
function actualizarConteosChips() {
  const conteoTodos = document.getElementById('conteo-todos');
  if (conteoTodos) conteoTodos.textContent = todosLosRecursos.length;

  const ejes = ['violencia', 'ninez', 'salud', 'inclusion', 'educacion', 'comunidad'];
  ejes.forEach(eje => {
    const el = document.getElementById(`conteo-${eje}`);
    if (el) {
      const cant = todosLosRecursos.filter(r => r._ejes.includes(eje)).length;
      el.textContent = cant;
    }
  });
}

// Pintar KPIs resumen
function pintarKpisGenerales() {
  const cont = document.getElementById('indicadores');
  if (!cont) return;

  const totalProgramas = todosLosRecursos.length;
  const derechosDistintos = new Set(todosLosRecursos.map(r => r['Derecho']).filter(Boolean)).size;
  const conEspacios = todosLosRecursos.filter(r => r._sedes && r._sedes.length > 0).length;
  const totalSedesReferenciadas = todosLosRecursos.reduce((acc, r) => acc + (r._sedes ? r._sedes.length : 0), 0);

  cont.innerHTML = `
    <div class="kpi">
      <p class="etiqueta">Recursos y programas</p>
      <p class="valor">${totalProgramas}</p>
      <p class="detalle">disponibles para derivación</p>
    </div>
    <div class="kpi">
      <p class="etiqueta">Programas con sedes</p>
      <p class="valor">${conEspacios}</p>
      <p class="detalle">con despliegue territorial</p>
    </div>
    <div class="kpi">
      <p class="etiqueta">Puntos de atención activos</p>
      <p class="valor">${totalSedesReferenciadas}</p>
      <p class="detalle">CAPS, vecinales, CIMs, etc.</p>
    </div>
    <div class="kpi">
      <p class="etiqueta">Derechos y ejes cubiertos</p>
      <p class="valor">${derechosDistintos}</p>
      <p class="detalle">áreas de intervención social</p>
    </div>
  `;
}

// Configurar listeners de la interfaz
function configurarEventosUI() {
  const inputBusqueda = document.getElementById('input-busqueda');
  const btnLimpiarBusqueda = document.getElementById('boton-limpiar-busqueda');
  const selDerecho = document.getElementById('filtro-derecho');
  const selSec = document.getElementById('filtro-secretaria');
  const btnLimpiarFiltros = document.getElementById('boton-limpiar-filtros');
  const btnReintentar = document.getElementById('boton-reintentar-filtros');
  const btnDescargarCsv = document.getElementById('boton-descargar-csv');
  const btnVistaTarjetas = document.getElementById('vista-tarjetas-btn');
  const btnVistaTabla = document.getElementById('vista-tabla-btn');

  // Modal events
  const modalOverlay = document.getElementById('modal-espacio-overlay');
  const modalBtnCerrar = document.getElementById('modal-espacio-cerrar');
  const modalBtnCerrarPie = document.getElementById('modal-boton-cerrar-pie');
  const modalBtnCopiar = document.getElementById('modal-boton-copiar');

  if (modalBtnCerrar) modalBtnCerrar.addEventListener('click', cerrarModalSede);
  if (modalBtnCerrarPie) modalBtnCerrarPie.addEventListener('click', cerrarModalSede);
  if (modalBtnCopiar) modalBtnCopiar.addEventListener('click', copiarDatosSede);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) cerrarModalSede();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const ov = document.getElementById('modal-espacio-overlay');
      if (ov && !ov.hidden) cerrarModalSede();
    }
  });

  // Input de búsqueda
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', () => {
      if (btnLimpiarBusqueda) {
        btnLimpiarBusqueda.hidden = !inputBusqueda.value.trim();
      }
      aplicarFiltros();
    });
  }

  // Limpiar búsqueda
  if (btnLimpiarBusqueda && inputBusqueda) {
    btnLimpiarBusqueda.addEventListener('click', () => {
      inputBusqueda.value = '';
      btnLimpiarBusqueda.hidden = true;
      inputBusqueda.focus();
      aplicarFiltros();
    });
  }

  // Chips de ejes
  document.querySelectorAll('.chip[data-eje]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-eje]').forEach(c => c.classList.remove('activo'));
      chip.classList.add('activo');
      ejeActivo = chip.getAttribute('data-eje') || 'todos';
      aplicarFiltros();
    });
  });

  // Selectores
  if (selDerecho) selDerecho.addEventListener('change', aplicarFiltros);
  if (selSec) selSec.addEventListener('change', aplicarFiltros);

  // Botón limpiar filtros
  if (btnLimpiarFiltros) {
    btnLimpiarFiltros.addEventListener('click', restablecerFiltros);
  }
  if (btnReintentar) {
    btnReintentar.addEventListener('click', restablecerFiltros);
  }

  // Alternador de vistas
  if (btnVistaTarjetas && btnVistaTabla) {
    btnVistaTarjetas.addEventListener('click', () => cambiarVista('tarjetas'));
    btnVistaTabla.addEventListener('click', () => cambiarVista('tabla'));
  }

  // Descargar CSV filtrado
  if (btnDescargarCsv) {
    btnDescargarCsv.addEventListener('click', exportarCSV);
  }
}

// Restablecer todos los filtros
function restablecerFiltros() {
  const inputBusqueda = document.getElementById('input-busqueda');
  const btnLimpiarBusqueda = document.getElementById('boton-limpiar-busqueda');
  const selDerecho = document.getElementById('filtro-derecho');
  const selSec = document.getElementById('filtro-secretaria');

  if (inputBusqueda) inputBusqueda.value = '';
  if (btnLimpiarBusqueda) btnLimpiarBusqueda.hidden = true;
  if (selDerecho) selDerecho.value = '';
  if (selSec) selSec.value = '';

  document.querySelectorAll('.chip[data-eje]').forEach(c => {
    c.classList.toggle('activo', c.getAttribute('data-eje') === 'todos');
  });
  ejeActivo = 'todos';

  aplicarFiltros();
}

// Aplicar filtros en memoria
function aplicarFiltros() {
  const inputBusqueda = document.getElementById('input-busqueda');
  const query = normalizarTexto(inputBusqueda ? inputBusqueda.value.trim() : '');
  const selDerecho = document.getElementById('filtro-derecho');
  const derechoSeleccionado = selDerecho ? selDerecho.value : '';
  const selSec = document.getElementById('filtro-secretaria');
  const secSeleccionada = selSec ? selSec.value : '';

  const palabrasQuery = query.split(/\s+/).filter(Boolean);

  recursosFiltrados = todosLosRecursos.filter(r => {
    // 1. Eje prioritario
    if (ejeActivo !== 'todos' && !r._ejes.includes(ejeActivo)) {
      return false;
    }

    // 2. Filtro por Derecho
    if (derechoSeleccionado && r['Derecho'] !== derechoSeleccionado) {
      return false;
    }

    // 3. Filtro por Secretaría
    if (secSeleccionada && r['Secretaría'] !== secSeleccionada) {
      return false;
    }

    // 4. Búsqueda por palabras
    if (palabrasQuery.length > 0) {
      const cumpleTodas = palabrasQuery.every(palabra => r._norm.includes(palabra));
      if (!cumpleTodas) return false;
    }

    return true;
  });

  actualizarContadorResultados();
  renderizarRecursos();
}

// Actualizar leyenda del contador
function actualizarContadorResultados() {
  const contador = document.getElementById('contador-resultados');
  if (!contador) return;

  const total = todosLosRecursos.length;
  const actual = recursosFiltrados.length;

  if (actual === total) {
    contador.innerHTML = `Mostrando <strong>${actual}</strong> recursos disponibles`;
  } else {
    contador.innerHTML = `Mostrando <strong>${actual}</strong> de ${total} recursos encontrados`;
  }
}

// Cambiar formato de vista (Tarjetas o Tabla)
function cambiarVista(vista) {
  vistaActual = vista;
  const btnTarjetas = document.getElementById('vista-tarjetas-btn');
  const btnTabla = document.getElementById('vista-tabla-btn');
  const contTarjetas = document.getElementById('contenedor-tarjetas');
  const contTabla = document.getElementById('contenedor-tabla');

  if (btnTarjetas && btnTabla) {
    btnTarjetas.classList.toggle('activo', vista === 'tarjetas');
    btnTarjetas.setAttribute('aria-pressed', vista === 'tarjetas');
    btnTabla.classList.toggle('activo', vista === 'tabla');
    btnTabla.setAttribute('aria-pressed', vista === 'tabla');
  }

  if (contTarjetas && contTabla) {
    contTarjetas.hidden = (vista !== 'tarjetas');
    contTabla.hidden = (vista !== 'tabla');
  }

  renderizarRecursos();
}

// Renderizado principal
function renderizarRecursos() {
  const contTarjetas = document.getElementById('contenedor-tarjetas');
  const contTabla = document.getElementById('contenedor-tabla');
  const mensajeVacio = document.getElementById('mensaje-vacio');

  if (recursosFiltrados.length === 0) {
    if (contTarjetas) contTarjetas.innerHTML = '';
    if (contTabla) contTabla.innerHTML = '';
    if (mensajeVacio) mensajeVacio.hidden = false;
    return;
  }

  if (mensajeVacio) mensajeVacio.hidden = true;

  if (vistaActual === 'tarjetas' && contTarjetas) {
    renderizarEnTarjetas(contTarjetas);
  } else if (vistaActual === 'tabla' && contTabla) {
    renderizarEnTabla(contTabla);
  }
}

// Renderizado en formato tarjetas (Fichas de derivación con botones de sedes integrados)
function renderizarEnTarjetas(contenedor) {
  contenedor.innerHTML = recursosFiltrados.map((r, idx) => {
    const contactos = extraerContactos(r);
    const dependenciaStr = [r['Secretaría'], r['Subsecretaría'], r['Área']].filter(Boolean).join(' › ');
    const palabras = (r['Palabras Clave'] || '').split(/[,;]+/).map(p => p.trim()).filter(Boolean);
    const metaDerecho = r['Derecho'] ? obtenerMetaDerecho(r['Derecho']) : null;
    const sedes = r._sedes || [];
    const tieneMuchosSedes = sedes.length > 6;

    return `
      <article class="card-recurso" id="recurso-${idx}">
        <!-- Contenedor de imagen superior de la tarjeta -->
        <div class="card-recurso-portada">
          ${r._imagen ? `
            <img src="${r._imagen}" 
                 alt="Instalaciones y atención del programa ${escapar(r['Nombre del Programa'] || '')}" 
                 class="card-recurso-img" 
                 loading="lazy">
          ` : `
            <div class="card-recurso-img-placeholder ${metaDerecho ? `card-recurso-img-placeholder--${metaDerecho.serie}` : ''}" aria-hidden="true">
              <span class="icono icono-placeholder-grande">${metaDerecho ? metaDerecho.icono : 'account_balance'}</span>
              <span class="placeholder-texto-derecho">${escapar(r['Derecho'] || 'Gobierno de Río Cuarto')}</span>
            </div>
          `}
        </div>

        <div class="card-recurso-cuerpo">
          <div class="card-recurso-header">
          <div class="card-recurso-tags">
            ${metaDerecho ? `
              <span class="badge-derecho badge-derecho--${metaDerecho.serie}" title="Derecho: ${escapar(r['Derecho'])}">
                <span class="icono" aria-hidden="true">${metaDerecho.icono}</span>
                <span>${escapar(r['Derecho'])}</span>
              </span>
            ` : ''}
            ${r['Secretaría'] ? `<span class="badge-area">${escapar(r['Secretaría'])}</span>` : ''}
          </div>
          <h3 class="card-recurso-titulo">${escapar(r['Nombre del Programa'] || 'Sin nombre')}</h3>
          ${dependenciaStr ? `
            <div class="card-recurso-dependencia">
              <span class="icono" aria-hidden="true" style="font-size:15px">account_balance</span>
              <span>${escapar(dependenciaStr)}</span>
            </div>
          ` : ''}
        </div>

        ${r._descPresentacion ? `
          <p class="card-recurso-descripcion">${escapar(r._descPresentacion)}</p>
        ` : ''}

        <!-- Bloque de Sedes y Espacios Normalizados -->
        ${sedes.length > 0 ? `
          <div class="bloque-sedes">
            <div class="bloque-sedes-header">
              <span class="icono" aria-hidden="true">place</span>
              <strong>${sedes.length === 1 ? 'Sede de atención:' : `Sedes y espacios disponibles (${sedes.length}):`}</strong>
            </div>
            <div class="grilla-botones-sedes">
              ${sedes.map((s, sIdx) => {
                const meta = obtenerMetaEspacio(s.espacio, s.nombre);
                const oculta = (tieneMuchosSedes && sIdx >= 6) ? 'style="display:none"' : '';
                const claseExtra = (tieneMuchosSedes && sIdx >= 6) ? 'sede-extra' : '';
                return `
                  <button type="button" 
                          class="btn-sede-espacio ${meta.clase} ${claseExtra}" 
                          data-recurso-idx="${idx}" 
                          data-sede-idx="${sIdx}" 
                          ${oculta}
                          title="Ver información de ${escapar(s.nombre)}">
                    <span class="icono" aria-hidden="true">${meta.icono}</span>
                    <span>${escapar(s.nombre)}</span>
                    ${s.actividad ? `<span class="sede-tag-actividad">${escapar(s.actividad)}</span>` : ''}
                  </button>
                `;
              }).join('')}
              ${tieneMuchosSedes ? `
                <button type="button" class="btn-toggle-sedes" data-card-idx="${idx}">
                  + Ver ${sedes.length - 6} sedes más
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <div class="card-recurso-metadatos">
          ${(r['Lugar / Espacio'] && sedes.length === 0) ? `
            <div class="meta-item">
              <span class="icono" aria-hidden="true">location_on</span>
              <span class="meta-item-texto">
                <strong>Lugar:</strong> ${escapar(r['Lugar / Espacio'])}
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r['Lugar / Espacio'] + ', Río Cuarto')}" 
                   target="_blank" rel="noopener" style="margin-left:4px; font-size:0.75rem; color:var(--marca-enlace)">
                  (ver mapa)
                </a>
              </span>
            </div>
          ` : ''}

          ${r['Horarios de atención'] ? `
            <div class="meta-item">
              <span class="icono" aria-hidden="true">schedule</span>
              <span class="meta-item-texto"><strong>Horarios:</strong> ${escapar(r['Horarios de atención'])}</span>
            </div>
          ` : ''}

          ${contactos.textoContacto ? `
            <div class="meta-item">
              <span class="icono" aria-hidden="true">contact_phone</span>
              <span class="meta-item-texto">${escapar(contactos.textoContacto)}</span>
            </div>
          ` : ''}
        </div>

        ${palabras.length > 0 ? `
          <div class="card-recurso-palabras">
            ${palabras.slice(0, 4).map(p => `<span class="palabra-tag">#${escapar(p)}</span>`).join('')}
          </div>
        ` : ''}
        </div> <!-- /.card-recurso-cuerpo -->

        <div class="card-recurso-footer">
          <div class="fila-canales-contacto">
            ${contactos.telefonoLimpio ? `
              <a href="tel:${contactos.telefonoLimpio}" class="boton boton--primario boton--chico" title="Llamar">
                <span class="icono" aria-hidden="true">call</span>
                Llamar
              </a>
            ` : ''}

            ${contactos.whatsappLimpio ? `
              <a href="https://wa.me/${contactos.whatsappLimpio}?text=${encodeURIComponent('Hola, me comunico por derivación respecto al programa ' + (r['Nombre del Programa'] || ''))}" 
                 target="_blank" rel="noopener" class="boton boton--secundario boton--chico boton--whatsapp" title="Enviar WhatsApp">
                <img src="assets/img/whatsapp.png" class="icono-whatsapp" alt="" aria-hidden="true">
                WhatsApp
              </a>
            ` : ''}

            ${contactos.email ? `
              <a href="mailto:${contactos.email}?subject=${encodeURIComponent('Derivación / Consulta: ' + (r['Nombre del Programa'] || ''))}" 
                 class="boton boton--secundario boton--chico boton--correo" title="Enviar correo">
                <img src="assets/img/correo.webp" class="icono-correo" alt="" aria-hidden="true">
                Correo
              </a>
            ` : ''}

            ${contactos.instagram ? `
              <a href="https://instagram.com/${contactos.instagram}" 
                 target="_blank" rel="noopener" class="boton boton--sutil boton--chico" title="Ver Instagram @${escapar(contactos.instagram)}">
                <span class="icono" aria-hidden="true">photo_camera</span>
                Instagram
              </a>
            ` : ''}
          </div>

          <button type="button" class="boton-copiar-ficha" data-recurso-idx="${idx}" title="Copiar datos estructurados para derivación">
            <span class="icono" aria-hidden="true">content_copy</span>
            <span>Copiar ficha de derivación</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Asociar evento a botones de sede para abrir el modal
  contenedor.querySelectorAll('.btn-sede-espacio').forEach(btn => {
    btn.addEventListener('click', () => {
      const rIdx = btn.getAttribute('data-recurso-idx');
      const sIdx = btn.getAttribute('data-sede-idx');
      if (rIdx !== null && sIdx !== null && recursosFiltrados[rIdx]) {
        const recurso = recursosFiltrados[rIdx];
        const sede = recurso._sedes[sIdx];
        if (sede) {
          abrirModalSede(sede, recurso);
        }
      }
    });
  });

  // Asociar evento a botones para alternar sedes colapsadas
  contenedor.querySelectorAll('.btn-toggle-sedes').forEach(btn => {
    btn.addEventListener('click', () => {
      const grilla = btn.closest('.grilla-botones-sedes');
      if (!grilla) return;
      const extras = grilla.querySelectorAll('.sede-extra');
      const expandido = btn.classList.contains('expandido');

      if (expandido) {
        extras.forEach(el => { el.style.display = 'none'; });
        btn.classList.remove('expandido');
        btn.textContent = `+ Ver ${extras.length} sedes más`;
      } else {
        extras.forEach(el => { el.style.display = 'inline-flex'; });
        btn.classList.add('expandido');
        btn.textContent = '- Ver menos sedes';
      }
    });
  });

  // Asociar evento a botones de copiar ficha
  contenedor.querySelectorAll('.boton-copiar-ficha').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-recurso-idx');
      if (idx !== null && recursosFiltrados[idx]) {
        copiarFichaDerivacion(recursosFiltrados[idx], btn);
      }
    });
  });
}

// Renderizado en formato tabla
function renderizarEnTabla(contenedor) {
  contenedor.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Programa / Dependencia</th>
          <th>Derecho</th>
          <th>Descripción</th>
          <th>Lugar y Horarios</th>
          <th>Contacto</th>
          <th style="text-align:right">Acción</th>
        </tr>
      </thead>
      <tbody>
        ${recursosFiltrados.map((r, idx) => {
          const contactos = extraerContactos(r);
          const dependenciaStr = [r['Secretaría'], r['Subsecretaría'], r['Área']].filter(Boolean).join(' › ');
          const metaDerecho = r['Derecho'] ? obtenerMetaDerecho(r['Derecho']) : null;
          const sedes = r._sedes || [];

          return `
            <tr>
              <td>
                <div class="tabla-titulo-programa">${escapar(r['Nombre del Programa'] || 'Sin nombre')}</div>
                ${dependenciaStr ? `<div class="tabla-dependencia">${escapar(dependenciaStr)}</div>` : ''}
              </td>
              <td>
                ${metaDerecho ? `
                  <span class="badge-derecho badge-derecho--${metaDerecho.serie}" title="Derecho: ${escapar(r['Derecho'])}">
                    <span class="icono" aria-hidden="true">${metaDerecho.icono}</span>
                    <span>${escapar(r['Derecho'])}</span>
                  </span>
                ` : '<span style="color:var(--texto-suave)">—</span>'}
              </td>
              <td style="max-width:320px; font-size:0.84rem; line-height:1.4">
                ${escapar(r._descPresentacion || r['Descripción'] || '—')}
              </td>
              <td style="font-size:0.82rem; min-width:180px">
                ${sedes.length > 0 ? `
                  <div style="display:flex; flex-direction:column; gap:4px">
                    ${sedes.slice(0, 2).map((s, sIdx) => {
                      const meta = obtenerMetaEspacio(s.espacio, s.nombre);
                      return `
                        <button type="button" 
                                class="btn-sede-espacio ${meta.clase}" 
                                data-recurso-idx="${idx}" 
                                data-sede-idx="${sIdx}" 
                                style="font-size:0.74rem; padding:3px 8px">
                          <span class="icono" aria-hidden="true" style="font-size:14px">${meta.icono}</span>
                          <span>${escapar(s.nombre)}</span>
                        </button>
                      `;
                    }).join('')}
                    ${sedes.length > 2 ? `
                      <button type="button" 
                              class="btn-sede-espacio" 
                              data-recurso-idx="${idx}" 
                              data-sede-idx="2" 
                              style="font-size:0.72rem; padding:2px 6px; color:var(--marca-enlace); border-style:dashed">
                        +${sedes.length - 2} sedes más
                      </button>
                    ` : ''}
                  </div>
                ` : (r['Lugar / Espacio'] ? `
                  <div><span class="icono icono--chico" aria-hidden="true">location_on</span> ${escapar(r['Lugar / Espacio'])}</div>
                ` : '')}
                ${r['Horarios de atención'] ? `<div style="color:var(--texto-suave); margin-top:4px"><span class="icono icono--chico" aria-hidden="true">schedule</span> ${escapar(r['Horarios de atención'])}</div>` : ''}
                ${sedes.length === 0 && !r['Lugar / Espacio'] && !r['Horarios de atención'] ? '<span style="color:var(--texto-suave)">—</span>' : ''}
              </td>
              <td style="font-size:0.82rem">
                ${contactos.telefonoLimpio ? `<div><span class="icono icono--chico" aria-hidden="true">call</span> <a href="tel:${contactos.telefonoLimpio}">${escapar(contactos.telefono)}</a></div>` : ''}
                ${contactos.email ? `<div><img src="assets/img/correo.webp" class="icono-correo" alt="" aria-hidden="true" style="width:14px;height:14px"> <a href="mailto:${contactos.email}" style="color:var(--correo-texto); font-weight:500">${escapar(contactos.email)}</a></div>` : ''}
                ${!contactos.telefonoLimpio && !contactos.email ? `<span style="color:var(--texto-suave)">${escapar(contactos.textoContacto || '—')}</span>` : ''}
              </td>
              <td style="text-align:right">
                <button type="button" class="boton boton--sutil boton--chico boton-copiar-tabla" data-recurso-idx="${idx}" title="Copiar ficha de derivación">
                  <span class="icono" aria-hidden="true">content_copy</span>
                  Copiar
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  // Botones de sede dentro de la tabla
  contenedor.querySelectorAll('.btn-sede-espacio').forEach(btn => {
    btn.addEventListener('click', () => {
      const rIdx = btn.getAttribute('data-recurso-idx');
      const sIdx = btn.getAttribute('data-sede-idx');
      if (rIdx !== null && sIdx !== null && recursosFiltrados[rIdx]) {
        const recurso = recursosFiltrados[rIdx];
        const sede = recurso._sedes[sIdx];
        if (sede) {
          abrirModalSede(sede, recurso);
        }
      }
    });
  });

  contenedor.querySelectorAll('.boton-copiar-tabla').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-recurso-idx');
      if (idx !== null && recursosFiltrados[idx]) {
        copiarFichaDerivacion(recursosFiltrados[idx], btn);
      }
    });
  });
}

// Abrir ventana modal de información de una sede o espacio
function abrirModalSede(sede, recurso) {
  ultimoBotonFoco = document.activeElement;
  sedeActualModal = { sede, recurso };

  const overlay = document.getElementById('modal-espacio-overlay');
  const iconoEl = document.getElementById('modal-espacio-icono');
  const tipoEl = document.getElementById('modal-espacio-tipo');
  const tituloEl = document.getElementById('modal-espacio-titulo');
  const bodyEl = document.getElementById('modal-espacio-body');
  const linkMaps = document.getElementById('modal-link-maps');

  if (!overlay || !bodyEl) return;

  const esp = sede.espacio;
  const meta = obtenerMetaEspacio(esp, sede.nombre);

  if (iconoEl) iconoEl.textContent = meta.icono;
  if (tipoEl) tipoEl.textContent = meta.tipoLabel;
  if (tituloEl) tituloEl.textContent = esp ? esp.Centro : sede.nombre;

  let html = '';

  // Imagen de la sede o programa si está disponible
  if (recurso._imagen) {
    html += `
      <div style="width:100%; height:140px; border-radius:var(--radio); overflow:hidden; border:1px solid var(--borde)">
        <img src="${recurso._imagen}" alt="Instalaciones de ${escapar(recurso['Nombre del Programa'] || '')}" style="width:100%; height:100%; object-fit:cover; display:block">
      </div>
    `;
  }

  // 1. Programa y contexto de derivación
  html += `
    <div class="modal-destacado-programa">
      <div class="programa-nombre">
        <span class="icono" aria-hidden="true" style="font-size:16px; vertical-align:middle">bookmark</span>
        ${escapar(recurso['Nombre del Programa'] || 'Programa')}
      </div>
      ${recurso['Secretaría'] ? `
        <div style="font-size:0.78rem; color:var(--texto-suave); margin-top:2px">
          ${escapar([recurso['Secretaría'], recurso['Subsecretaría'], recurso['Área']].filter(Boolean).join(' › '))}
        </div>
      ` : ''}
      ${sede.actividad ? `
        <div class="programa-detalle" style="margin-top:6px">
          <strong>Actividad / Taller:</strong> ${escapar(sede.actividad)}
        </div>
      ` : ''}
    </div>
  `;

  // 2. Si tiene detalle de profesionales y especialidades (Atención Primaria)
  if (sede.detalles && sede.detalles.length > 0) {
    html += `
      <div class="modal-seccion">
        <div class="modal-seccion-titulo">
          <span class="icono" aria-hidden="true">stethoscope</span>
          Equipo de profesionales y horarios en esta sede
        </div>
        <div class="modal-seccion-contenido" style="overflow-x:auto">
          <table style="width:100%; border-collapse:collapse; font-size:0.82rem">
            <thead>
              <tr style="text-align:left; border-bottom:1px solid var(--borde)">
                <th style="padding:6px">Especialidad</th>
                <th style="padding:6px">Profesional</th>
                <th style="padding:6px">Días y Horarios</th>
              </tr>
            </thead>
            <tbody>
              ${sede.detalles.map(d => `
                <tr style="border-bottom:1px solid var(--borde)">
                  <td style="padding:6px; font-weight:600">${escapar(d.especialidad)}</td>
                  <td style="padding:6px">${escapar(d.profesional || '—')}</td>
                  <td style="padding:6px; color:var(--texto-suave)">${escapar(d.horario || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. Ubicación y Territorio
  const domicilio = esp ? esp.Domicilio : '';
  const barrio = esp ? esp.Barrio : '';
  const sector = esp ? esp.Sector : '';

  if (domicilio || barrio || sector) {
    html += `
      <div class="modal-seccion">
        <div class="modal-seccion-titulo">
          <span class="icono" aria-hidden="true">location_on</span>
          Ubicación y Territorio
        </div>
        <div class="modal-seccion-contenido">
          ${domicilio ? `<div><strong>Dirección:</strong> ${escapar(domicilio)}</div>` : ''}
          ${barrio || sector ? `
            <div style="color:var(--texto-suave); font-size:0.85rem; margin-top:2px">
              ${barrio ? `Barrio: <strong>${escapar(barrio)}</strong>` : ''}
              ${barrio && sector ? ' · ' : ''}
              ${sector ? `Sector: <strong>${escapar(sector)}</strong>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 4. Horarios de Atención del Espacio
  const diasAten = esp ? esp['Días de Atención'] : '';
  const horaAp = esp ? esp['Horario de Apertura'] : '';
  const horaCie = esp ? esp['Horario de Cierre'] : '';
  const recHor = recurso['Horarios de atención'] || '';

  if (diasAten || horaAp || horaCie || recHor) {
    html += `
      <div class="modal-seccion">
        <div class="modal-seccion-titulo">
          <span class="icono" aria-hidden="true">schedule</span>
          Horarios de Atención
        </div>
        <div class="modal-seccion-contenido">
          ${diasAten ? `<div><strong>Días:</strong> ${escapar(diasAten)}</div>` : ''}
          ${horaAp || horaCie ? `<div><strong>Horario del centro:</strong> ${escapar([horaAp, horaCie].filter(Boolean).join(' a '))}</div>` : ''}
          ${recHor ? `<div style="margin-top:4px"><strong>Horario del programa:</strong> ${escapar(recHor)}</div>` : ''}
        </div>
      </div>
    `;
  }

  // 5. Canales de Contacto Directo de la Sede
  const telFijo = esp ? esp['Teléfono fijo'] : '';
  const whatsapp = esp ? esp['WhatsApp'] : '';
  const instagram = esp ? esp['Instagram'] : '';
  const emailEsp = esp ? esp['Correo electrónico'] : '';

  if (telFijo || whatsapp || instagram || emailEsp) {
    html += `
      <div class="modal-seccion">
        <div class="modal-seccion-titulo">
          <span class="icono" aria-hidden="true">contact_phone</span>
          Contacto de la Sede
        </div>
        <div class="modal-seccion-contenido">
          <div class="modal-fila-contacto">
            ${telFijo ? `
              <a href="tel:${telFijo.replace(/\D/g, '')}" class="boton boton--primario boton--chico">
                <span class="icono" aria-hidden="true">call</span>
                ${escapar(telFijo)}
              </a>
            ` : ''}
            ${whatsapp ? `
              <a href="https://wa.me/549${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me comunico por una consulta respecto a la sede ' + (esp ? esp.Centro : sede.nombre))}" 
                 target="_blank" rel="noopener" class="boton boton--secundario boton--chico boton--whatsapp">
                <img src="assets/img/whatsapp.png" class="icono-whatsapp" alt="" aria-hidden="true">
                WhatsApp (${escapar(whatsapp)})
              </a>
            ` : ''}
            ${emailEsp ? `
              <a href="mailto:${emailEsp}" class="boton boton--secundario boton--chico boton--correo">
                <img src="assets/img/correo.webp" class="icono-correo" alt="" aria-hidden="true">
                ${escapar(emailEsp)}
              </a>
            ` : ''}
          </div>
          ${instagram ? `
            <div style="margin-top:6px; font-size:0.82rem; color:var(--texto-suave)">
              <span class="icono" aria-hidden="true" style="font-size:15px; vertical-align:middle">photo_camera</span>
              Instagram: @${escapar(instagram)}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 6. Servicios y Programas en el Espacio
  const serviciosEsp = esp && esp.Servicios ? esp.Servicios.split(/;+/).map(s => s.trim()).filter(Boolean) : [];
  if (serviciosEsp.length > 0) {
    html += `
      <div class="modal-seccion">
        <div class="modal-seccion-titulo">
          <span class="icono" aria-hidden="true">verified</span>
          Servicios y efectores en esta sede
        </div>
        <div class="modal-seccion-contenido" style="display:flex; flex-wrap:wrap; gap:4px">
          ${serviciosEsp.map(s => `<span class="palabra-tag">${escapar(s)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  bodyEl.innerHTML = html;

  // Configurar enlace de Google Maps
  if (linkMaps) {
    if (esp && esp.Coordenadas && esp.Coordenadas.includes(',')) {
      linkMaps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(esp.Coordenadas)}`;
      linkMaps.hidden = false;
    } else {
      const q = (esp ? esp.Centro + ' ' + (esp.Domicilio || '') : sede.nombre) + ', Río Cuarto';
      linkMaps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
      linkMaps.hidden = false;
    }
  }

  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add('activo');
  });
  document.body.style.overflow = 'hidden';

  const btnCerrar = document.getElementById('modal-espacio-cerrar');
  if (btnCerrar) btnCerrar.focus();
}

// Cerrar ventana modal de sede
function cerrarModalSede() {
  const overlay = document.getElementById('modal-espacio-overlay');
  if (!overlay) return;

  overlay.classList.remove('activo');
  setTimeout(() => {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (ultimoBotonFoco && typeof ultimoBotonFoco.focus === 'function') {
      ultimoBotonFoco.focus();
    }
  }, 200);
}

// Copiar datos de la sede al portapapeles
async function copiarDatosSede() {
  if (!sedeActualModal) return;
  const { sede, recurso } = sedeActualModal;
  const esp = sede.espacio;

  const lineas = [
    `SEDE / ESPACIO MUNICIPAL — RÍO CUARTO`,
    `Espacio: ${esp ? esp.Centro : sede.nombre}`,
    esp && esp.Tipo ? `Tipo: ${esp.Tipo}` : null,
    esp && esp.Domicilio ? `Domicilio: ${esp.Domicilio}` : null,
    esp && (esp.Barrio || esp.Sector) ? `Barrio / Sector: ${[esp.Barrio, esp.Sector].filter(Boolean).join(' · ')}` : null,
    esp && esp['Días de Atención'] ? `Días de atención: ${esp['Días de Atención']}` : null,
    esp && (esp['Horario de Apertura'] || esp['Horario de Cierre']) ? `Horario: ${esp['Horario de Apertura']} a ${esp['Horario de Cierre']}` : null,
    esp && esp['Teléfono fijo'] ? `Teléfono fijo: ${esp['Teléfono fijo']}` : null,
    esp && esp['WhatsApp'] ? `WhatsApp: ${esp['WhatsApp']}` : null,
    `---`,
    `Programa vinculado: ${recurso['Nombre del Programa'] || 'Sin nombre'}`,
    sede.actividad ? `Actividad / Taller: ${sede.actividad}` : null,
    recurso['Horarios de atención'] ? `Horario del programa: ${recurso['Horarios de atención']}` : null,
    `Recursero Municipal · Gobierno de Río Cuarto`
  ].filter(Boolean);

  const texto = lineas.join('\n');
  let copiado = false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      copiado = true;
    } catch (e) {
      copiado = fallbackCopiar(texto);
    }
  } else {
    copiado = fallbackCopiar(texto);
  }

  if (copiado) {
    mostrarToast('Datos de la sede copiados al portapapeles');
    const btn = document.getElementById('modal-boton-copiar');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="icono" aria-hidden="true">check</span> ¡Copiado!';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }
  }
}

// Analizador de contactos (teléfonos, emails, whatsapp)
function extraerContactos(r) {
  const telRaw = r['Teléfono / WhatsApp'] || '';
  const emailRaw = r['Correo electrónico'] || '';
  const redesRaw = r['Redes sociales'] || '';

  let email = '';
  const emailMatch = (telRaw + ' ' + emailRaw).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  let telefono = '';
  let telefonoLimpio = '';
  let whatsappLimpio = '';

  const numMatch = telRaw.match(/(?:(?:\+?54\s?9?)?\s?(?:358|15)?[0-9\s-]{6,12})/);
  if (numMatch) {
    telefono = numMatch[0].trim();
    let digitos = telefono.replace(/\D/g, '');
    if (digitos.startsWith('15') && digitos.length === 9) {
      digitos = '358' + digitos.substring(2);
    }
    if (digitos.length === 10 && !digitos.startsWith('54')) {
      digitos = '549' + digitos;
    }
    telefonoLimpio = digitos;

    if (telRaw.toLowerCase().includes('whatsapp') || digitos.length >= 10) {
      whatsappLimpio = digitos;
    }
  }

  let instagram = '';
  const instaMatch = (telRaw + ' ' + redesRaw).match(/instagram(?::|\s+)?\s*@?([a-zA-Z0-9._]+)/i);
  if (instaMatch) instagram = instaMatch[1].trim();

  const textoContacto = telRaw || emailRaw || redesRaw || '';

  return {
    email,
    telefono,
    telefonoLimpio,
    whatsappLimpio,
    instagram,
    textoContacto
  };
}

// Copiar al portapapeles ficha de derivación formateada
async function copiarFichaDerivacion(r, btnElement) {
  const dependencia = [r['Secretaría'], r['Subsecretaría'], r['Área']].filter(Boolean).join(' › ');
  const contactos = extraerContactos(r);
  const sedesStr = r._sedes && r._sedes.length > 0 ? r._sedes.map(s => s.nombre).join(', ') : '';

  const textoFicha = [
    `FICHA DE DERIVACIÓN — GOBIERNO DE RÍO CUARTO`,
    `Programa: ${r['Nombre del Programa'] || 'Sin especificar'}`,
    r['Derecho'] ? `Derecho: ${r['Derecho']}` : null,
    dependencia ? `Dependencia: ${dependencia}` : null,
    r['Descripción'] ? `Qué hace / Intervención: ${r['Descripción']}` : null,
    sedesStr ? `Sedes / Puntos de atención: ${sedesStr}` : (r['Lugar / Espacio'] ? `Lugar: ${r['Lugar / Espacio']}` : null),
    r['Horarios de atención'] ? `Horarios: ${r['Horarios de atención']}` : null,
    contactos.textoContacto ? `Contacto: ${contactos.textoContacto}` : null,
    `Recursero Municipal · Datos actualizados a Octubre 2026`
  ].filter(Boolean).join('\n');

  let copiado = false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(textoFicha);
      copiado = true;
    } catch (e) {
      copiado = fallbackCopiar(textoFicha);
    }
  } else {
    copiado = fallbackCopiar(textoFicha);
  }

  if (copiado) {
    mostrarToast('Ficha copiada al portapapeles');
    if (btnElement) {
      const origHtml = btnElement.innerHTML;
      btnElement.classList.add('copiado');
      btnElement.innerHTML = '<span class="icono" aria-hidden="true">check</span> <span>¡Ficha copiada!</span>';
      setTimeout(() => {
        btnElement.classList.remove('copiado');
        btnElement.innerHTML = origHtml;
      }, 2000);
    }
  }
}

// Fallback para copiar en navegadores sin Clipboard API
function fallbackCopiar(texto) {
  try {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const res = document.execCommand('copy');
    document.body.removeChild(ta);
    return res;
  } catch (e) {
    return false;
  }
}

// Mostrar notificación Toast
let toastTimer = null;
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast-notificacion');
  const span = document.getElementById('toast-mensaje');
  if (!toast || !span) return;

  span.textContent = mensaje;
  toast.classList.add('visible');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2600);
}

// Exportar datos filtrados en formato CSV con BOM UTF-8
function exportarCSV() {
  if (recursosFiltrados.length === 0) {
    mostrarToast('No hay datos para exportar');
    return;
  }

  const columnas = [
    'Nombre del Programa',
    'Derecho',
    'Secretaría',
    'Subsecretaría',
    'Área',
    'Descripción',
    'Lugar / Espacio',
    'Horarios de atención',
    'Teléfono / WhatsApp',
    'Correo electrónico',
    'Redes sociales',
    'Palabras Clave'
  ];

  let csvContent = '\uFEFF';
  csvContent += columnas.map(c => `"${c}"`).join(',') + '\r\n';

  recursosFiltrados.forEach(r => {
    const fila = columnas.map(col => {
      const val = (r[col] || '').replace(/"/g, '""');
      return `"${val}"`;
    });
    csvContent += fila.join(',') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recursero_rio_cuarto_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  mostrarToast(`Descargando CSV con ${recursosFiltrados.length} recursos`);
}

// Mensaje de error general
function mostrarError(mensaje) {
  const main = document.querySelector('main .contenedor');
  if (main) {
    main.innerHTML = `
      <div class="panel" style="border-color:var(--grave); margin-top:20px">
        <h3 style="color:var(--grave)">No se pudo cargar el recursero</h3>
        <p style="color:var(--texto-suave)">${escapar(mensaje)}</p>
        <button type="button" class="boton boton--primario" onclick="location.reload()">
          Reintentar
        </button>
      </div>
    `;
  }
}

// Escapar texto para inyección segura en HTML
function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', iniciar);
