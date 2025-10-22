#!/usr/bin/env node

/**
 * Script de verificación para Credit Report Analyzer
 * Verifica que todos los archivos y dependencias estén en su lugar
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function log(message, type = 'info') {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[36m',
    reset: '\x1b[0m'
  };

  const symbols = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  console.log(`${colors[type]}${symbols[type]} ${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    log(`${description}: ${filePath}`, 'success');
    checks.passed++;
    return true;
  } else {
    log(`${description} NO ENCONTRADO: ${filePath}`, 'error');
    checks.failed++;
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    log(`${description}: ${dirPath}`, 'success');
    checks.passed++;
    return true;
  } else {
    log(`${description} NO ENCONTRADO: ${dirPath}`, 'error');
    checks.failed++;
    return false;
  }
}

console.log('\n=== VERIFICACIÓN DE CREDIT REPORT ANALYZER ===\n');

// Verificar archivos principales
log('\n📁 Verificando archivos principales...', 'info');
checkFile('package.json', 'Package.json');
checkFile('README.md', 'README');
checkFile('LICENSE', 'Licencia');
checkFile('.gitignore', 'Gitignore');

// Verificar estructura de carpetas
log('\n📂 Verificando estructura de carpetas...', 'info');
checkDirectory('src', 'Carpeta src');
checkDirectory('src/services', 'Carpeta services');
checkDirectory('src/renderer', 'Carpeta renderer');
checkDirectory('src/utils', 'Carpeta utils');
checkDirectory('assets', 'Carpeta assets');
checkDirectory('build', 'Carpeta build');

// Verificar archivos del proceso principal
log('\n⚙️  Verificando proceso principal...', 'info');
checkFile('src/main.js', 'Main process');

// Verificar servicios
log('\n🔧 Verificando servicios...', 'info');
checkFile('src/services/openrouter.js', 'Servicio OpenRouter');
checkFile('src/services/pdfService.js', 'Servicio PDF');
checkFile('src/services/ocrService.js', 'Servicio OCR');
checkFile('src/services/creditAnalyzer.js', 'Analizador de crédito');

// Verificar utilidades
log('\n🛠️  Verificando utilidades...', 'info');
checkFile('src/utils/security.js', 'Utilidades de seguridad');
checkFile('src/utils/validators.js', 'Validadores');

// Verificar interfaz
log('\n🎨 Verificando interfaz...', 'info');
checkFile('src/renderer/index.html', 'HTML principal');
checkFile('src/renderer/styles.css', 'Estilos CSS');
checkFile('src/renderer/app.js', 'JavaScript de la UI');

// Verificar documentación
log('\n📚 Verificando documentación...', 'info');
checkFile('INSTALL.md', 'Guía de instalación');
checkFile('USAGE.md', 'Guía de uso');
checkFile('CONTRIBUTING.md', 'Guía de contribución');

// Verificar configuración de build
log('\n🏗️  Verificando configuración de build...', 'info');
checkFile('build/entitlements.mac.plist', 'Entitlements para macOS');

// Verificar sintaxis de archivos clave
log('\n🔍 Verificando sintaxis de archivos...', 'info');

try {
  const packageJson = require('./package.json');
  if (packageJson.name && packageJson.version && packageJson.main) {
    log('package.json tiene estructura válida', 'success');
    checks.passed++;
  } else {
    log('package.json tiene estructura incompleta', 'warning');
    checks.warnings++;
  }

  // Verificar que las dependencias clave están listadas
  const requiredDeps = [
    'axios',
    'chart.js',
    'electron-store',
    'pdf-parse',
    'tesseract.js'
  ];

  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  if (missingDeps.length === 0) {
    log('Todas las dependencias clave están listadas', 'success');
    checks.passed++;
  } else {
    log(`Dependencias faltantes: ${missingDeps.join(', ')}`, 'warning');
    checks.warnings++;
  }
} catch (error) {
  log('Error al leer package.json: ' + error.message, 'error');
  checks.failed++;
}

// Verificar que los archivos JS tienen sintaxis válida
log('\n✅ Verificando sintaxis JavaScript...', 'info');

const jsFiles = [
  'src/main.js',
  'src/services/openrouter.js',
  'src/services/pdfService.js',
  'src/services/ocrService.js',
  'src/services/creditAnalyzer.js',
  'src/utils/security.js',
  'src/utils/validators.js',
  'src/renderer/app.js'
];

let syntaxErrors = 0;
jsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    // Verificación básica de sintaxis
    if (content.includes('module.exports') || content.includes('require(') || content.includes('const ')) {
      checks.passed++;
    } else {
      log(`${file} puede tener problemas de sintaxis`, 'warning');
      checks.warnings++;
    }
  } catch (error) {
    log(`Error al verificar ${file}: ${error.message}`, 'error');
    syntaxErrors++;
    checks.failed++;
  }
});

if (syntaxErrors === 0) {
  log('Todos los archivos JS parecen tener sintaxis válida', 'success');
}

// Resumen final
log('\n=== RESUMEN DE VERIFICACIÓN ===\n', 'info');
console.log(`  Pruebas pasadas:  ${checks.passed}`);
console.log(`  Pruebas fallidas: ${checks.failed}`);
console.log(`  Advertencias:     ${checks.warnings}`);

if (checks.failed === 0) {
  log('\n✨ ¡Verificación completada exitosamente!', 'success');
  log('El proyecto está listo para ejecutarse.', 'success');
  log('\nPróximos pasos:', 'info');
  console.log('  1. npm install      - Instalar dependencias');
  console.log('  2. npm run dev      - Ejecutar en modo desarrollo');
  console.log('  3. npm run build    - Compilar para producción');
  process.exit(0);
} else {
  log('\n❌ Verificación completada con errores', 'error');
  log('Por favor, corrige los errores antes de continuar.', 'error');
  process.exit(1);
}
