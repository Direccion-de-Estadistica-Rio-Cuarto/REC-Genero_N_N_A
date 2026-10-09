// scripts/actualizar-datos.js
// Descarga y normaliza los datos del Recursero desde Google Sheets publicado

const fs = require('fs');
const path = require('path');

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsDz0F9TF0ABbh6uRYIl469NhPhcfYhWO_gGhdnp_7U29FFF8-bnNvMyaQnGqLwLWMFuuOoI6qp_fL/pub?output=csv';
const OUTPUT_JSON = path.join(__dirname, '..', 'datos', 'recursero.json');
const OUTPUT_CSV = path.join(__dirname, '..', 'datos', 'recursero.csv');

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  const rawHeaders = rows[0];
  // Normalizar encabezados
  const headers = rawHeaders.map(h => h.trim());

  return rows.slice(1).map((row, index) => {
    const record = { _index: index + 1 };
    headers.forEach((h, i) => {
      record[h] = (row[i] || '').trim();
    });
    return record;
  }).filter(r => r['Nombre del Programa'] || r['Descripción'] || r['Área'] || r['Secretaría']);
}

async function main() {
  console.log('Descargando datos desde Google Sheets...');
  const res = await fetch(SHEET_URL);
  if (!res.ok) {
    throw new Error(`Error HTTP al descargar planilla: ${res.status} ${res.statusText}`);
  }

  const csvText = await res.text();
  console.log(`Descargados ${csvText.length} bytes.`);

  // Guardar copia CSV cruda
  fs.writeFileSync(OUTPUT_CSV, csvText, 'utf8');

  const records = parseCSV(csvText);
  console.log(`Procesados ${records.length} registros válidos.`);

  // Guardar JSON formateado
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(records, null, 2), 'utf8');
  console.log(`Guardado en: ${OUTPUT_JSON}`);

  // Resumen de secretarías
  const secretarias = {};
  records.forEach(r => {
    const sec = r['Secretaría'] || 'Sin especificar';
    secretarias[sec] = (secretarias[sec] || 0) + 1;
  });

  console.log('\nDistribución por Secretaría:');
  Object.entries(secretarias)
    .sort((a, b) => b[1] - a[1])
    .forEach(([sec, count]) => {
      console.log(`  - ${sec}: ${count}`);
    });
}

main().catch(err => {
  console.error('Error al actualizar datos:', err);
  process.exit(1);
});
