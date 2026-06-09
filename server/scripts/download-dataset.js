import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'personas-sample.json');

const HF_API_URL = 'https://datasets-server.huggingface.co/rows?dataset=nvidia/Nemotron-Personas-El-Salvador&config=default&split=train';
const TARGET_COUNT = 5000;
const BATCH_SIZE = 100;

async function downloadDataset() {
  console.log('🚀 Iniciando descarga de muestra del dataset de HuggingFace...');
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let allRows = [];
  
  for (let offset = 0; offset < TARGET_COUNT; offset += BATCH_SIZE) {
    try {
      console.log(`Descargando lote: offset ${offset}, length ${BATCH_SIZE}...`);
      const url = `${HF_API_URL}&offset=${offset}&length=${BATCH_SIZE}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.rows || data.rows.length === 0) {
        console.log('No hay más filas disponibles.');
        break;
      }
      
      const parsedRows = data.rows.map(r => r.row);
      allRows = allRows.concat(parsedRows);
      
      // Delay to avoid hitting rate limits too hard
      await new Promise(r => setTimeout(r, 500));
      
    } catch (err) {
      console.error(`❌ Error en offset ${offset}:`, err.message);
      break;
    }
  }

  if (allRows.length > 0) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(allRows, null, 2));
    console.log(`✅ ¡Descarga completada! ${allRows.length} perfiles guardados en data/personas-sample.json`);
  } else {
    console.log('❌ No se descargaron datos.');
  }
}

downloadDataset();
