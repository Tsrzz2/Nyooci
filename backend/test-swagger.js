// Generate swagger spec from the actual swagger.js config and save as JSON
const path = require('path');
const fs = require('fs');

// Temporarily override __dirname for swagger.js resolution
const swaggerJsdoc = require('swagger-jsdoc');

// Read the swagger.js module to get the full options
const swaggerModule = require('./src/swagger');

// swaggerModule is already the generated spec (swaggerJsdoc result)
// Check if it has paths
console.log('Spec keys:', Object.keys(swaggerModule));
console.log('Paths found:', Object.keys(swaggerModule.paths || {}).length);
console.log('Paths:', Object.keys(swaggerModule.paths || {}));

// Save to JSON file
fs.writeFileSync(
  path.join(__dirname, 'src', 'swagger-spec.json'),
  JSON.stringify(swaggerModule, null, 2)
);
console.log('Saved swagger-spec.json');
