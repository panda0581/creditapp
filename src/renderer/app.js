const { ipcRenderer } = require('electron');

// Inicializar visualizador
const visualizer = new CreditVisualizer();

// Estado de la aplicación
const appState = {
  currentFile: null,
  extractedText: null,
  currentAnalysis: null,
  apiConfig: {},
  availableModels: [],
  financialInfo: {}
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadSavedConfig();
});

async function initializeApp() {
  console.log('Inicializando Credit Report Analyzer...');
  await loadAvailableModels();
}

// Event Listeners
function setupEventListeners() {
  // Navegación
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      switchView(view);
    });
  });

  // Upload
  const uploadArea = document.getElementById('uploadArea');
  uploadArea.addEventListener('click', () => selectFile());
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('drop', handleDrop);

  document.getElementById('changeFile').addEventListener('click', () => selectFile());

  // Análisis
  document.getElementById('analyzeBtn').addEventListener('click', analyzeReport);
  document.getElementById('newAnalysisBtn').addEventListener('click', () => switchView('upload'));

  // Settings
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
  document.getElementById('testApiBtn').addEventListener('click', testApiConnection);
  document.getElementById('toggleApiKey').addEventListener('click', toggleApiKeyVisibility);

  // Export
  document.getElementById('exportBtn').addEventListener('click', exportAnalysis);

  // History
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

  // Model selector
  document.getElementById('modelSelect').addEventListener('change', (e) => {
    appState.selectedModel = e.target.value;
  });
}

// Vista de navegación
function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`${viewName}-view`).classList.add('active');
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

  if (viewName === 'history') {
    loadHistory();
  }
}

// Carga de configuración
async function loadSavedConfig() {
  const result = await ipcRenderer.invoke('get-api-config');
  if (result.success && result.config) {
    appState.apiConfig = result.config;

    if (result.config.apiKey) {
      document.getElementById('apiKeyInput').value = result.config.apiKey;
      updateApiStatus(true);
      await loadAvailableModels();
    }

    if (result.config.defaultModel) {
      document.getElementById('defaultModel').value = result.config.defaultModel;
    }
  }
}

async function loadAvailableModels() {
  const apiKey = appState.apiConfig.apiKey || document.getElementById('apiKeyInput').value;

  if (!apiKey) {
    document.getElementById('modelSelect').innerHTML = '<option value="">Configura tu API key primero</option>';
    return;
  }

  try {
    const result = await ipcRenderer.invoke('get-available-models', apiKey);

    if (result.success) {
      appState.availableModels = result.models;
      populateModelSelect(result.models);
    } else {
      showNotification('Error cargando modelos: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error al conectar con OpenRouter', 'error');
  }
}

function populateModelSelect(models) {
  const select = document.getElementById('modelSelect');
  select.innerHTML = '';

  // Modelos recomendados primero
  const recommended = [
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-opus',
    'openai/gpt-4-turbo',
    'openai/gpt-4',
    'google/gemini-pro',
    'meta-llama/llama-3.1-70b-instruct'
  ];

  recommended.forEach(modelId => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = `${model.name} (Recomendado)`;
      select.appendChild(option);
    }
  });

  // Separador
  const separator = document.createElement('option');
  separator.disabled = true;
  separator.textContent = '──────────';
  select.appendChild(separator);

  // Resto de modelos
  models.forEach(model => {
    if (!recommended.includes(model.id)) {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      select.appendChild(option);
    }
  });

  // Seleccionar el predeterminado
  if (appState.apiConfig.defaultModel) {
    select.value = appState.apiConfig.defaultModel;
  }
}

// Manejo de archivos
async function selectFile() {
  const result = await ipcRenderer.invoke('select-file', 'all');

  if (result.success && result.filePath) {
    handleFileSelected(result.filePath);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
}

async function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelected(files[0].path);
  }
}

async function handleFileSelected(filePath) {
  appState.currentFile = filePath;

  // Mostrar información del archivo
  const fileName = filePath.split('/').pop();
  const fs = require('fs');
  const stats = fs.statSync(filePath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  document.getElementById('fileName').textContent = fileName;
  document.getElementById('fileSize').textContent = `${fileSizeMB} MB`;

  document.getElementById('uploadArea').style.display = 'none';
  document.getElementById('fileInfo').style.display = 'flex';

  // Procesar el archivo
  await processFile(filePath);
}

async function processFile(filePath) {
  const processingStatus = document.getElementById('processingStatus');
  const progressFill = document.getElementById('progressFill');
  const processingText = document.getElementById('processingText');

  processingStatus.style.display = 'block';
  progressFill.style.width = '0%';

  try {
    const ext = filePath.toLowerCase();

    if (ext.endsWith('.pdf')) {
      processingText.textContent = 'Extrayendo texto del PDF...';
      progressFill.style.width = '30%';

      const result = await ipcRenderer.invoke('process-pdf', filePath);

      if (result.success) {
        appState.extractedText = result.text.text;
        progressFill.style.width = '100%';
        showTextPreview(appState.extractedText);
        showNotification(`PDF procesado: ${result.text.pages} páginas extraídas`, 'success');
      } else {
        throw new Error(result.error);
      }
    } else {
      // Es una imagen
      processingText.textContent = 'Procesando imagen con OCR...';
      progressFill.style.width = '20%';

      const result = await ipcRenderer.invoke('process-image', filePath);

      if (result.success) {
        appState.extractedText = result.text.text;
        progressFill.style.width = '100%';
        showTextPreview(appState.extractedText);
        showNotification(`OCR completado con ${result.text.confidence.toFixed(1)}% de confianza`, 'success');
      } else {
        throw new Error(result.error);
      }
    }

    // Habilitar botón de análisis
    document.getElementById('analyzeBtn').disabled = false;

  } catch (error) {
    console.error('Error procesando archivo:', error);
    showNotification('Error al procesar el archivo: ' + error.message, 'error');
  } finally {
    setTimeout(() => {
      processingStatus.style.display = 'none';
    }, 1000);
  }
}

function showTextPreview(text) {
  const preview = document.getElementById('textPreview');
  const content = document.getElementById('previewContent');

  content.textContent = text.substring(0, 2000) + (text.length > 2000 ? '\n\n...(texto truncado)' : '');
  preview.style.display = 'block';
}

// Análisis
async function analyzeReport() {
  if (!appState.extractedText) {
    showNotification('No hay texto para analizar', 'error');
    return;
  }

  const apiKey = appState.apiConfig.apiKey || document.getElementById('apiKeyInput').value;
  if (!apiKey) {
    showNotification('Configura tu API key primero', 'error');
    switchView('settings');
    return;
  }

  const model = document.getElementById('modelSelect').value;
  const analysisType = document.getElementById('analysisType').value;

  if (!model) {
    showNotification('Selecciona un modelo', 'error');
    return;
  }

  const analyzeBtn = document.getElementById('analyzeBtn');
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = `
    <div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div>
    Analizando...
  `;

  console.log('=== INICIANDO ANÁLISIS ===');
  console.log('Modelo:', model);
  console.log('Tipo:', analysisType);
  console.log('Longitud del texto:', appState.extractedText.length);

  try {
    const result = await ipcRenderer.invoke('analyze-credit-report', {
      text: appState.extractedText,
      apiKey,
      model,
      analysisType
    });

    console.log('=== RESULTADO DEL ANÁLISIS ===');
    console.log('Success:', result.success);
    console.log('Analysis:', result.analysis);

    if (result.success) {
      appState.currentAnalysis = result.analysis;

      // Verificar si hay validaciones
      if (result.validation) {
        console.log('Validación:', result.validation);
        if (result.validation.warnings && result.validation.warnings.length > 0) {
          console.warn('Advertencias:', result.validation.warnings);
        }
      }

      displayAnalysis(result.analysis);
      switchView('analysis');
      showNotification('Análisis completado exitosamente', 'success');
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('=== ERROR EN ANÁLISIS ===');
    console.error('Error completo:', error);
    showNotification('Error al analizar: ' + error.message, 'error');
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 0L20 10H15V20H5V10H0L10 0Z"/>
      </svg>
      Analizar Reporte
    `;
  }
}

function displayAnalysis(analysis) {
  console.log('Mostrando análisis con visualizaciones:', analysis);

  // Usar el visualizador para crear una presentación completa con gráficos
  visualizer.createCompleteVisualization(analysis, 'analysisResults');

  console.log('✓ Análisis mostrado correctamente con gráficos');
}

function createScoreCard(score) {
  const card = document.createElement('div');
  card.className = 'score-card fade-in';

  let scoreValue = typeof score === 'object' ? score.value : score;
  let scoreClass = getScoreClass(scoreValue);

  card.innerHTML = `
    <div class="score-value">${scoreValue}</div>
    <div class="score-label">Puntaje de Crédito</div>
    <div class="score-label" style="font-size: 14px; margin-top: 10px;">${scoreClass}</div>
  `;

  return card;
}

function getScoreClass(score) {
  if (score >= 800) return 'Excepcional';
  if (score >= 740) return 'Muy Bueno';
  if (score >= 670) return 'Bueno';
  if (score >= 580) return 'Regular';
  return 'Pobre';
}

function createSection(title, content) {
  const section = document.createElement('div');
  section.className = 'analysis-section fade-in';
  section.innerHTML = `
    <h3>${title}</h3>
    <div style="color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap;">${content}</div>
  `;
  return section;
}

function createApprovalSection(probabilities) {
  const section = document.createElement('div');
  section.className = 'analysis-section fade-in';

  let probsHTML = '<div class="analysis-grid">';

  Object.entries(probabilities).forEach(([type, prob]) => {
    const percentage = typeof prob === 'object' ? prob.percentage : prob;
    const color = percentage >= 70 ? 'var(--success)' : percentage >= 40 ? 'var(--warning)' : 'var(--danger)';

    probsHTML += `
      <div class="metric-card">
        <div class="metric-label">${formatLoanType(type)}</div>
        <div class="metric-value" style="color: ${color}">${percentage}%</div>
        <div class="metric-subtext">Probabilidad de aprobación</div>
      </div>
    `;
  });

  probsHTML += '</div>';

  section.innerHTML = `<h3>Probabilidades de Aprobación</h3>` + probsHTML;
  return section;
}

function formatLoanType(type) {
  const types = {
    'premium_card': 'Tarjeta Premium',
    'standard_card': 'Tarjeta Estándar',
    'basic_card': 'Tarjeta Básica',
    'mortgage': 'Hipoteca',
    'auto_loan': 'Préstamo Auto',
    'personal_loan': 'Préstamo Personal'
  };
  return types[type] || type.replace(/_/g, ' ').toUpperCase();
}

function createMetricsGrid(metrics) {
  const section = document.createElement('div');
  section.className = 'analysis-section fade-in';

  let gridHTML = '<div class="analysis-grid">';

  Object.entries(metrics).forEach(([key, value]) => {
    gridHTML += `
      <div class="metric-card">
        <div class="metric-label">${formatMetricName(key)}</div>
        <div class="metric-value" style="font-size: 20px;">${value}</div>
      </div>
    `;
  });

  gridHTML += '</div>';

  section.innerHTML = `<h3>Métricas Clave</h3>` + gridHTML;
  return section;
}

function formatMetricName(name) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function createRecommendationsSection(recommendations) {
  const section = document.createElement('div');
  section.className = 'analysis-section fade-in';

  let listHTML = '<ul class="recommendation-list">';

  recommendations.forEach((rec, index) => {
    const priority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';
    listHTML += `
      <li class="recommendation-item ${priority}">
        ${typeof rec === 'string' ? rec : rec.text || rec.description}
      </li>
    `;
  });

  listHTML += '</ul>';

  section.innerHTML = `<h3>Recomendaciones</h3>` + listHTML;
  return section;
}

// Settings
async function saveSettings() {
  const apiKey = document.getElementById('apiKeyInput').value;
  const defaultModel = document.getElementById('defaultModel').value;

  if (!apiKey) {
    showNotification('Ingresa tu API key', 'error');
    return;
  }

  const config = {
    apiKey,
    defaultModel,
    autoSave: document.getElementById('autoSaveAnalysis').checked,
    notifications: document.getElementById('enableNotifications').checked
  };

  const result = await ipcRenderer.invoke('save-api-config', config);

  if (result.success) {
    appState.apiConfig = config;
    updateApiStatus(true);
    showNotification('Configuración guardada exitosamente', 'success');
    await loadAvailableModels();
  } else {
    showNotification('Error guardando configuración', 'error');
  }
}

async function testApiConnection() {
  const apiKey = document.getElementById('apiKeyInput').value;

  if (!apiKey) {
    showNotification('Ingresa tu API key primero', 'error');
    return;
  }

  const btn = document.getElementById('testApiBtn');
  btn.disabled = true;
  btn.textContent = 'Probando...';

  try {
    const result = await ipcRenderer.invoke('get-available-models', apiKey);

    if (result.success) {
      showNotification(`Conexión exitosa! ${result.models.length} modelos disponibles`, 'success');
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    showNotification('Error de conexión: ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Probar Conexión';
  }
}

function toggleApiKeyVisibility() {
  const input = document.getElementById('apiKeyInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function updateApiStatus(active) {
  const dot = document.getElementById('apiStatus');
  const text = document.getElementById('apiStatusText');

  if (active) {
    dot.classList.add('active');
    text.textContent = 'API Configurada';
  } else {
    dot.classList.remove('active');
    text.textContent = 'API no configurada';
  }
}

// History
async function loadHistory() {
  const result = await ipcRenderer.invoke('get-analysis-history');

  const container = document.getElementById('historyList');

  if (result.success && result.history.length > 0) {
    container.innerHTML = '';

    result.history.forEach(item => {
      const historyItem = createHistoryItem(item);
      container.appendChild(historyItem);
    });
  } else {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No hay análisis en el historial</h3>
        <p>Los análisis que realices aparecerán aquí</p>
      </div>
    `;
  }
}

function createHistoryItem(item) {
  const div = document.createElement('div');
  div.className = 'history-item';

  const date = new Date(item.date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const summary = item.analysis.summary || 'Análisis de crédito';

  div.innerHTML = `
    <div class="history-header">
      <span class="history-date">${date}</span>
      <span class="history-model">${item.model.split('/')[1] || item.model}</span>
    </div>
    <div class="history-summary">${summary.substring(0, 150)}...</div>
  `;

  div.addEventListener('click', () => {
    appState.currentAnalysis = item.analysis;
    displayAnalysis(item.analysis);
    switchView('analysis');
  });

  return div;
}

async function clearHistory() {
  if (confirm('¿Estás seguro de que deseas limpiar todo el historial?')) {
    const result = await ipcRenderer.invoke('clear-history');

    if (result.success) {
      showNotification('Historial eliminado', 'success');
      loadHistory();
    }
  }
}

// Export
async function exportAnalysis() {
  if (!appState.currentAnalysis) {
    showNotification('No hay análisis para exportar', 'error');
    return;
  }

  const format = 'json'; // Podría ser un selector

  const result = await ipcRenderer.invoke('export-analysis', {
    analysis: appState.currentAnalysis,
    format
  });

  if (result.success) {
    showNotification('Análisis exportado exitosamente', 'success');
  } else if (!result.canceled) {
    showNotification('Error al exportar', 'error');
  }
}

// Notificaciones
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: fadeIn 0.3s;
    max-width: 400px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    notification.style.transition = 'all 0.3s';

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

console.log('App.js cargado correctamente');
