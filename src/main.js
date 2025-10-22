const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

// Servicios
const OpenRouterService = require('./services/openrouter');
const PDFService = require('./services/pdfService');
const OCRService = require('./services/ocrService');
const CreditAnalyzer = require('./services/creditAnalyzer');
const CardRecommendationEngine = require('./services/cardRecommendation');

// Utilidades
const security = require('./utils/security');
const validators = require('./utils/validators');

// Almacenamiento seguro
const store = new Store({
  encryptionKey: 'credit-analyzer-secure-key-2024'
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e',
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Configuración de API
ipcMain.handle('save-api-config', async (event, config) => {
  try {
    // Validar API key
    const validation = security.validateApiKey(config.apiKey);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Validar configuración completa
    const configValidation = security.validateConfig(config);
    if (!configValidation.valid) {
      return { success: false, error: configValidation.errors.join(', ') };
    }

    store.set('apiConfig', config);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-api-config', async () => {
  try {
    const config = store.get('apiConfig', {});
    return { success: true, config };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Obtener modelos disponibles de OpenRouter
ipcMain.handle('get-available-models', async (event, apiKey) => {
  try {
    const openRouter = new OpenRouterService(apiKey);
    const models = await openRouter.getAvailableModels();
    return { success: true, models };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Seleccionar archivo
ipcMain.handle('select-file', async (event, fileType) => {
  try {
    let filters = [];

    if (fileType === 'pdf') {
      filters = [{ name: 'PDF Files', extensions: ['pdf'] }];
    } else if (fileType === 'image') {
      filters = [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'] }];
    } else {
      filters = [
        { name: 'All Supported', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'bmp'] }
      ];
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    return { success: true, filePath: result.filePaths[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Procesar PDF
ipcMain.handle('process-pdf', async (event, filePath) => {
  try {
    // Validar archivo
    const fileValidation = security.validateFile(filePath);
    if (!fileValidation.valid) {
      return { success: false, error: fileValidation.error };
    }

    const pdfService = new PDFService();
    const text = await pdfService.extractText(filePath);

    // Sanitizar texto
    const sanitizedText = security.sanitizeText(text.text);

    // Validar que parece ser un reporte de crédito
    const reportValidation = validators.isLikelyCreditReport(sanitizedText);

    return {
      success: true,
      text: { ...text, text: sanitizedText },
      validation: reportValidation
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Procesar imagen con OCR
ipcMain.handle('process-image', async (event, filePath) => {
  try {
    // Validar archivo
    const fileValidation = security.validateFile(filePath, 20 * 1024 * 1024); // 20MB para imágenes
    if (!fileValidation.valid) {
      return { success: false, error: fileValidation.error };
    }

    const ocrService = new OCRService();
    const text = await ocrService.extractText(filePath);

    // Sanitizar texto
    const sanitizedText = security.sanitizeText(text.text);

    // Validar que parece ser un reporte de crédito
    const reportValidation = validators.isLikelyCreditReport(sanitizedText);

    return {
      success: true,
      text: { ...text, text: sanitizedText },
      validation: reportValidation
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Analizar reporte de crédito
ipcMain.handle('analyze-credit-report', async (event, { text, apiKey, model, analysisType }) => {
  try {
    // Validar API key
    const apiKeyValidation = security.validateApiKey(apiKey);
    if (!apiKeyValidation.valid) {
      return { success: false, error: apiKeyValidation.error };
    }

    // Validar y sanitizar texto
    const sanitizedText = security.sanitizeText(text);
    if (!validators.hasMinimumContent(sanitizedText)) {
      return { success: false, error: 'El texto es demasiado corto para analizar' };
    }

    const openRouter = new OpenRouterService(apiKey);
    const creditAnalyzer = new CreditAnalyzer(openRouter);

    const analysis = await creditAnalyzer.analyzeReport(sanitizedText, model, analysisType);

    // Validar respuesta
    const responseValidation = security.validateAIResponse(JSON.stringify(analysis));
    if (!responseValidation.valid) {
      return { success: false, error: responseValidation.error };
    }

    // Validar estructura del análisis
    const structureValidation = validators.validateAnalysisStructure(analysis);
    if (!structureValidation.valid) {
      console.warn('Advertencias en análisis:', structureValidation.warnings);
    }

    // Guardar análisis en historial
    const history = store.get('analysisHistory', []);
    history.unshift({
      id: security.generateAnalysisId(),
      date: new Date().toISOString(),
      model,
      analysisType,
      analysis,
      validation: structureValidation
    });

    // Mantener solo los últimos 50 análisis
    if (history.length > 50) {
      history.pop();
    }

    store.set('analysisHistory', history);

    return {
      success: true,
      analysis,
      validation: structureValidation
    };
  } catch (error) {
    console.error('Error en análisis:', error);
    return { success: false, error: error.message };
  }
});

// Obtener historial de análisis
ipcMain.handle('get-analysis-history', async () => {
  try {
    const history = store.get('analysisHistory', []);
    return { success: true, history };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Limpiar historial
ipcMain.handle('clear-history', async () => {
  try {
    store.set('analysisHistory', []);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Exportar análisis
ipcMain.handle('export-analysis', async (event, { analysis, format }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `credit-analysis-${Date.now()}.${format}`,
      filters: [
        { name: format.toUpperCase(), extensions: [format] }
      ]
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    let content;
    if (format === 'json') {
      content = JSON.stringify(analysis, null, 2);
    } else if (format === 'txt') {
      content = formatAnalysisAsText(analysis);
    }

    fs.writeFileSync(result.filePath, content);
    return { success: true, filePath: result.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

function formatAnalysisAsText(analysis) {
  let text = 'ANÁLISIS DE REPORTE DE CRÉDITO\n';
  text += '='.repeat(50) + '\n\n';

  if (analysis.summary) {
    text += 'RESUMEN:\n' + analysis.summary + '\n\n';
  }

  if (analysis.creditScore) {
    text += `PUNTAJE DE CRÉDITO: ${analysis.creditScore}\n\n`;
  }

  if (analysis.approvalProbability) {
    text += `PROBABILIDAD DE APROBACIÓN: ${analysis.approvalProbability}%\n\n`;
  }

  if (analysis.recommendations) {
    text += 'RECOMENDACIONES:\n';
    analysis.recommendations.forEach((rec, i) => {
      text += `${i + 1}. ${rec}\n`;
    });
    text += '\n';
  }

  if (analysis.details) {
    text += 'DETALLES:\n' + analysis.details + '\n\n';
  }

  return text;
}

// Guardar información financiera del usuario
ipcMain.handle('save-financial-info', async (event, financialInfo) => {
  try {
    store.set('financialInfo', financialInfo);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Obtener información financiera del usuario
ipcMain.handle('get-financial-info', async () => {
  try {
    const info = store.get('financialInfo', {});
    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Obtener recomendaciones de tarjetas
ipcMain.handle('get-card-recommendations', async (event, { profile, analysisData }) => {
  try {
    const cardEngine = new CardRecommendationEngine();

    // Construir perfil completo
    const fullProfile = {
      creditScore: analysisData.creditScore || profile.creditScore || 650,
      monthlyIncome: profile.monthlyIncome || 3000,
      monthlyExpenses: profile.monthlyExpenses || 2000,
      currentDebt: profile.currentDebt || 5000,
      utilization: analysisData.utilization || profile.utilization || 30,
      paymentHistory: analysisData.paymentHistory || profile.paymentHistory || 95
    };

    // Obtener análisis financiero
    const financialAnalysis = cardEngine.analyzeFinancialProfile(fullProfile);

    // Obtener recomendaciones de tarjetas
    const recommendations = cardEngine.recommendCards(fullProfile, 8);

    return {
      success: true,
      financialAnalysis,
      recommendations,
      profile: fullProfile
    };
  } catch (error) {
    console.error('Error generando recomendaciones:', error);
    return { success: false, error: error.message };
  }
});

console.log('Credit Report Analyzer iniciado correctamente');
