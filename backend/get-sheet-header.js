require('dotenv').config();
const fetch = require('node-fetch');

async function getSheetHeaders() {
  console.log('📥 Mengambil header dari SheetDB...');
  try {
    const response = await fetch(process.env.SHEETDB_URL);
    const result = await response.json();
    console.log('📊 Hasil dari SheetDB:', JSON.stringify(result, null, 2));

    if (result.data && result.data.length > 0) {
      console.log('📋 Header kolom yang tersedia:', Object.keys(result.data[0]));
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

getSheetHeaders();
