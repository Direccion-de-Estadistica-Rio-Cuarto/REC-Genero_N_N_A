// scripts/actualizar-espacios.js
// Descarga y normaliza el directorio maestro de espacios/infraestructura municipal

const fs = require('fs');
const path = require('path');

const ESPACIOS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrv6MMMDWStWYEp4f_tZq3JbbeJOHkD_rbYnGoKRG0mIn7emc34qyzOzQsePkAgn801fPtxEf_87Mk/pub?output=csv';
const OUTPUT_JSON = path.join(__dirname, '..', 'datos', 'espacios.json');

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

  const headers = rows[0].map(h => h.trim());

  return rows.slice(1).map((row, idx) => {
    const obj = { _id: idx + 1 };
    headers.forEach((h, i) => {
      obj[h] = (row[i] || '').trim();
    });
    return obj;
  }).filter(r => r.Centro && r.Centro.length > 0);
}

async function main() {
  console.log('Descargando base de espacios e infraestructura municipal...');
  const res = await fetch(ESPACIOS_URL);
  if (!res.ok) {
    throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
  }

  const csvText = await res.text();
  console.log(`Descargados ${csvText.length} bytes.`);

  const espacios = parseCSV(csvText);
  console.log(`Procesados ${espacios.length} espacios válidos.`);

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(espacios, null, 2), 'utf8');
  console.log(`Guardado en ${OUTPUT_JSON}`);

  const tipos = {};
  espacios.forEach(e => {
    const t = e.Tipo || 'Sin tipo';
    tipos[t] = (tipos[t] || 0) + 1;
  });

  console.log('\nDistribución por tipo de espacio:');
  Object.entries(tipos)
    .sort((a, b) => b[1] - a[1])
    .forEach(([t, count]) => {
      console.log(`  - ${t}: ${count}`);
    });
}

main().catch(err => {
  console.error('Error al actualizar espacios:', err);
  process.exit(1);
});
