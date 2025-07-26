import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const OUT_FILE = path.join(__dirname, '../src/generated-handlers.ts');
const HANDLER_SUFFIX = '.handler.ts';
const COMMAND_SUFFIX = '.command.ts';
const QUERY_SUFFIX = '.query.ts';
const NOTIFICATION_SUFFIX = '.notification.ts';

/**
 * Find all handler files recursively in src directory
 */
function findHandlerFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }

  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip dist, node_modules, and other build directories
      if (!['dist', 'node_modules', '.git'].includes(file)) {
        results = results.concat(findHandlerFiles(filePath));
      }
    } else if (file.endsWith(HANDLER_SUFFIX)) {
      results.push(filePath);
    }
  });
  
  return results;
}

/**
 * Convert kebab-case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Convert to PascalCase
 */
function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Find corresponding command/query/notification file
 */
function findRequestFile(handlerPath, handlerBase) {
  const dir = path.dirname(handlerPath);
  const possibleFiles = [
    path.join(dir, `${handlerBase}${COMMAND_SUFFIX}`),
    path.join(dir, `${handlerBase}${QUERY_SUFFIX}`),
    path.join(dir, `${handlerBase}${NOTIFICATION_SUFFIX}`)
  ];

  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      return file;
    }
  }
  
  return null;
}

/**
 * Generate handler registration code
 */
function generateHandlerCode() {
  const handlerFiles = findHandlerFiles(SRC_DIR);
  
  if (handlerFiles.length === 0) {
    console.log('No handler files found. Creating empty registration file.');
    return generateEmptyFile();
  }

  let imports = '';
  let handlers = '';
  let classes = '';
  let notifications = '';
  let notificationHandlers = '';

  handlerFiles.forEach((absPath) => {
    let relPath = path.relative(path.join(__dirname, '../src'), absPath);
    relPath = relPath.split(path.sep).join('/');
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    if (relPath.endsWith('.ts')) relPath = relPath.slice(0, -3);

    const handlerBase = path.basename(relPath, '.handler');
    const handlerName = toCamelCase(handlerBase) + 'Handler';
    
    // Find corresponding command/query/notification file
    const requestFile = findRequestFile(absPath, handlerBase);
    
    if (requestFile) {
      let requestRelPath = path.relative(path.join(__dirname, '../src'), requestFile);
      requestRelPath = requestRelPath.split(path.sep).join('/');
      if (!requestRelPath.startsWith('.')) requestRelPath = './' + requestRelPath;
      if (requestRelPath.endsWith('.ts')) requestRelPath = requestRelPath.slice(0, -3);

      const requestName = toPascalCase(handlerBase);
      
      imports += `import { ${handlerName} } from '${relPath}';\n`;
      imports += `import { ${requestName} } from '${requestRelPath}';\n`;

      if (requestFile.endsWith(NOTIFICATION_SUFFIX)) {
        notifications += `    { type: '${requestName}', handler: ${handlerName} },\n`;
        notificationHandlers += `    { type: '${requestName}', handler: ${handlerName} },\n`;
      } else {
        handlers += `    { type: '${requestName}', handler: ${handlerName} },\n`;
        classes += `    ${requestName},\n`;
      }
    } else {
      console.warn(`No corresponding command/query/notification file found for handler: ${absPath}`);
    }
  });

  return generateContent(imports, handlers, classes, notifications, notificationHandlers);
}

/**
 * Generate empty registration file
 */
function generateEmptyFile() {
  return `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// No handlers found. Add handlers to src/ directory.

import { registerBatch } from './helpers.js';

export default function registerAllHandlers() {
  registerBatch({
    requestClasses: [],
    handlers: [],
    notificationClasses: [],
    notificationHandlers: []
  });
}
`;
}

/**
 * Generate content with imports and registrations
 */
function generateContent(imports, handlers, classes, notifications, notificationHandlers) {
  return `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Generated from handlers in src/ directory.

import { registerBatch } from './helpers.js';

${imports}
export default function registerAllHandlers() {
  registerBatch({
    requestClasses: [
${classes}    ],
    handlers: [
${handlers}    ],
    notificationClasses: [
${notifications}    ],
    notificationHandlers: [
${notificationHandlers}    ]
  });
}

// Auto-register on import
registerAllHandlers();
`;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🔍 Scanning for handlers in src/ directory...');
    const content = generateHandlerCode();
    
    // Ensure output directory exists
    const outDir = path.dirname(OUT_FILE);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(OUT_FILE, content.trim());
    console.log('✅ Generated:', OUT_FILE);
    
    // Show summary
    const handlerFiles = findHandlerFiles(SRC_DIR);
    console.log(`📊 Found ${handlerFiles.length} handler(s)`);
    
  } catch (error) {
    console.error('❌ Error generating handlers:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateHandlerCode, findHandlerFiles }; 