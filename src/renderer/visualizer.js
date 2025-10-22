// Sistema de visualización gráfica para análisis de crédito

class CreditVisualizer {
  constructor() {
    this.charts = {};
  }

  // Destruir gráficos existentes
  destroyCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }

  // Crear análisis visual completo
  createCompleteVisualization(analysis, containerId) {
    this.destroyCharts();
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Header con score principal
    if (analysis.creditScore || analysis.credit_score) {
      const scoreSection = this.createScoreHeader(analysis);
      container.appendChild(scoreSection);
    }

    // Grid de visualizaciones
    const visualGrid = document.createElement('div');
    visualGrid.className = 'visual-grid';

    // 1. Gráfico de probabilidades de aprobación
    if (analysis.approvalProbabilities || analysis.approval_probabilities) {
      const probSection = this.createApprovalChart(analysis);
      visualGrid.appendChild(probSection);
    }

    // 2. Gráfico de distribución de factores
    if (analysis.metrics || analysis.key_metrics) {
      const metricsSection = this.createMetricsChart(analysis);
      visualGrid.appendChild(metricsSection);
    }

    // 3. Score breakdown
    if (analysis.creditScore) {
      const breakdownSection = this.createScoreBreakdown(analysis);
      visualGrid.appendChild(breakdownSection);
    }

    container.appendChild(visualGrid);

    // Secciones de texto mejoradas
    const textSections = document.createElement('div');
    textSections.className = 'text-sections';

    // Resumen
    if (analysis.summary) {
      const summaryCard = this.createTextCard('Resumen Ejecutivo', analysis.summary, 'summary');
      textSections.appendChild(summaryCard);
    }

    // Recomendaciones con prioridades
    if (analysis.recommendations) {
      const recCard = this.createRecommendationsCard(analysis.recommendations);
      textSections.appendChild(recCard);
    }

    // Detalles completos
    if (analysis.details || analysis.rawResponse) {
      const detailsCard = this.createTextCard(
        'Análisis Detallado Completo',
        analysis.details || analysis.rawResponse,
        'details'
      );
      textSections.appendChild(detailsCard);
    }

    container.appendChild(textSections);

    return container;
  }

  // Header con score visual
  createScoreHeader(analysis) {
    const section = document.createElement('div');
    section.className = 'score-header';

    const score = analysis.creditScore || analysis.credit_score;
    const scoreValue = typeof score === 'object' ? score.value : score;
    const classification = this.getScoreClassification(scoreValue);

    section.innerHTML = `
      <div class="score-display">
        <div class="score-circle" style="background: conic-gradient(${classification.color} ${(scoreValue/850)*100}%, #2a2a3e ${(scoreValue/850)*100}%);">
          <div class="score-inner">
            <div class="score-number">${scoreValue}</div>
            <div class="score-max">/ 850</div>
          </div>
        </div>
        <div class="score-info">
          <h2>Puntaje de Crédito</h2>
          <div class="score-class" style="color: ${classification.color};">
            ${classification.label}
          </div>
          <div class="score-description">${classification.description}</div>
        </div>
      </div>
    `;

    return section;
  }

  // Gráfico de probabilidades de aprobación
  createApprovalChart(analysis) {
    const section = document.createElement('div');
    section.className = 'chart-section';

    const chartId = 'approvalChart_' + Date.now();
    section.innerHTML = `
      <div class="chart-header">
        <h3>Probabilidades de Aprobación</h3>
        <p>Por tipo de producto financiero</p>
      </div>
      <div class="chart-container">
        <canvas id="${chartId}"></canvas>
      </div>
    `;

    // Esperar a que el DOM se actualice
    setTimeout(() => {
      const probs = analysis.approvalProbabilities || analysis.approval_probabilities;
      const labels = [];
      const data = [];
      const colors = [];

      Object.entries(probs).forEach(([type, prob]) => {
        const value = typeof prob === 'object' ? prob.percentage : prob;
        labels.push(this.formatLoanType(type));
        data.push(value);
        colors.push(this.getProbabilityColor(value));
      });

      const ctx = document.getElementById(chartId);
      if (ctx) {
        this.charts[chartId] = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Probabilidad %',
              data,
              backgroundColor: colors,
              borderColor: colors.map(c => c.replace('0.7', '1')),
              borderWidth: 2,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1a1a2e',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#4CAF50',
                borderWidth: 1,
                callbacks: {
                  label: (context) => `Probabilidad: ${context.parsed.y}%`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  color: '#b4b4b4',
                  callback: (value) => value + '%'
                },
                grid: { color: '#353548' }
              },
              x: {
                ticks: { color: '#b4b4b4' },
                grid: { display: false }
              }
            }
          }
        });
      }
    }, 100);

    return section;
  }

  // Gráfico de métricas clave
  createMetricsChart(analysis) {
    const section = document.createElement('div');
    section.className = 'chart-section';

    const chartId = 'metricsChart_' + Date.now();
    section.innerHTML = `
      <div class="chart-header">
        <h3>Métricas Clave</h3>
        <p>Factores de tu perfil crediticio</p>
      </div>
      <div class="chart-container">
        <canvas id="${chartId}"></canvas>
      </div>
    `;

    setTimeout(() => {
      const metrics = analysis.metrics || analysis.key_metrics || {};
      const labels = Object.keys(metrics).map(k => this.formatMetricName(k));
      const data = Object.values(metrics).map(v => {
        // Normalizar valores a porcentajes si es posible
        if (typeof v === 'string') {
          const match = v.match(/(\d+)%/);
          return match ? parseInt(match[1]) : 50;
        }
        return typeof v === 'number' ? v : 50;
      });

      const ctx = document.getElementById(chartId);
      if (ctx && labels.length > 0) {
        this.charts[chartId] = new Chart(ctx, {
          type: 'radar',
          data: {
            labels,
            datasets: [{
              label: 'Tu Perfil',
              data,
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              borderColor: '#4CAF50',
              borderWidth: 2,
              pointBackgroundColor: '#4CAF50',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
              legend: { display: false }
            },
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: { color: '#b4b4b4', backdropColor: 'transparent' },
                grid: { color: '#353548' },
                pointLabels: { color: '#fff', font: { size: 12 } }
              }
            }
          }
        });
      }
    }, 100);

    return section;
  }

  // Desglose visual del score
  createScoreBreakdown(analysis) {
    const section = document.createElement('div');
    section.className = 'chart-section';

    const chartId = 'breakdownChart_' + Date.now();
    section.innerHTML = `
      <div class="chart-header">
        <h3>Composición del Puntaje</h3>
        <p>Factores que afectan tu score</p>
      </div>
      <div class="chart-container">
        <canvas id="${chartId}"></canvas>
      </div>
    `;

    setTimeout(() => {
      const ctx = document.getElementById(chartId);
      if (ctx) {
        // Factores típicos de FICO
        this.charts[chartId] = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [
              'Historial de Pagos (35%)',
              'Utilización (30%)',
              'Antigüedad (15%)',
              'Mix de Crédito (10%)',
              'Consultas (10%)'
            ],
            datasets: [{
              data: [35, 30, 15, 10, 10],
              backgroundColor: [
                'rgba(76, 175, 80, 0.8)',
                'rgba(33, 150, 243, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(156, 39, 176, 0.8)',
                'rgba(255, 87, 34, 0.8)'
              ],
              borderColor: '#1a1a2e',
              borderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#fff',
                  padding: 15,
                  font: { size: 12 }
                }
              },
              tooltip: {
                backgroundColor: '#1a1a2e',
                titleColor: '#fff',
                bodyColor: '#fff'
              }
            }
          }
        });
      }
    }, 100);

    return section;
  }

  // Card de texto mejorada
  createTextCard(title, content, type) {
    const card = document.createElement('div');
    card.className = `text-card ${type}`;

    card.innerHTML = `
      <div class="card-header">
        <h3>${title}</h3>
      </div>
      <div class="card-content">
        ${this.formatTextContent(content)}
      </div>
    `;

    return card;
  }

  // Card de recomendaciones con prioridades
  createRecommendationsCard(recommendations) {
    const card = document.createElement('div');
    card.className = 'recommendations-card';

    let html = `
      <div class="card-header">
        <h3>🎯 Recomendaciones Prioritarias</h3>
      </div>
      <div class="recommendations-list">
    `;

    recommendations.forEach((rec, index) => {
      const priority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';
      const icon = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
      const text = typeof rec === 'string' ? rec : rec.text || rec.description;

      html += `
        <div class="rec-item priority-${priority}">
          <div class="rec-icon">${icon}</div>
          <div class="rec-content">
            <div class="rec-number">#${index + 1}</div>
            <div class="rec-text">${text}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    card.innerHTML = html;

    return card;
  }

  // Formatear contenido de texto
  formatTextContent(content) {
    if (!content) return '';

    // Detectar si es JSON
    if (typeof content === 'object') {
      content = JSON.stringify(content, null, 2);
    }

    // Formatear listas
    content = content.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    if (content.includes('<li>')) {
      content = '<ul>' + content + '</ul>';
    }

    // Formatear headers
    content = content.replace(/^#+\s+(.+)$/gm, '<h4>$1</h4>');

    // Formatear números importantes
    content = content.replace(/(\d{3})/g, '<strong>$1</strong>');
    content = content.replace(/(\d+%)/g, '<span class="highlight">$1</span>');

    // Preservar saltos de línea
    content = content.replace(/\n\n/g, '<br><br>');

    return content;
  }

  // Utilidades
  getScoreClassification(score) {
    if (score >= 800) return {
      label: 'Excepcional',
      color: '#4CAF50',
      description: 'Crédito excelente, mejores tasas disponibles'
    };
    if (score >= 740) return {
      label: 'Muy Bueno',
      color: '#8BC34A',
      description: 'Excelente crédito, muy buenas tasas'
    };
    if (score >= 670) return {
      label: 'Bueno',
      color: '#FFC107',
      description: 'Crédito aceptable, tasas promedio'
    };
    if (score >= 580) return {
      label: 'Regular',
      color: '#FF9800',
      description: 'Crédito limitado, tasas altas'
    };
    return {
      label: 'Pobre',
      color: '#f44336',
      description: 'Crédito muy limitado, difícil aprobación'
    };
  }

  getProbabilityColor(prob) {
    if (prob >= 80) return 'rgba(76, 175, 80, 0.7)';
    if (prob >= 60) return 'rgba(139, 195, 74, 0.7)';
    if (prob >= 40) return 'rgba(255, 193, 7, 0.7)';
    if (prob >= 20) return 'rgba(255, 152, 0, 0.7)';
    return 'rgba(244, 67, 54, 0.7)';
  }

  formatLoanType(type) {
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

  formatMetricName(name) {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CreditVisualizer;
}
