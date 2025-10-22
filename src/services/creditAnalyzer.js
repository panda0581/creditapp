class CreditAnalyzer {
  constructor(openRouterService) {
    this.openRouter = openRouterService;
  }

  async analyzeReport(text, model, analysisType = 'complete') {
    const prompt = this.buildPrompt(text, analysisType);

    try {
      const response = await this.openRouter.chat([
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ], model, {
        temperature: 0.3, // Más determinista para análisis financiero
        max_tokens: 4000
      });

      return this.parseResponse(response, analysisType);
    } catch (error) {
      console.error('Error analizando reporte:', error);
      throw error;
    }
  }

  getSystemPrompt() {
    return `Eres un experto analista de crédito financiero con más de 20 años de experiencia.
Tu trabajo es analizar reportes de crédito de manera exhaustiva y profesional.

Debes analizar TODOS los datos disponibles incluyendo:
- Historial de crédito y puntaje (FICO, VantageScore, etc.)
- Cuentas abiertas y cerradas
- Historial de pagos y morosidades
- Utilización de crédito
- Consultas de crédito (hard/soft pulls)
- Deudas pendientes y colecciones
- Bancarrotas, juicios y gravámenes
- Información personal y laboral
- Relación deuda-ingreso

Proporciona análisis precisos, basados en datos y con recomendaciones accionables.
Siempre incluye probabilidades de aprobación y justificación detallada.`;
  }

  buildPrompt(text, analysisType) {
    let basePrompt = `Analiza el siguiente reporte de crédito de manera exhaustiva:\n\n${text}\n\n`;

    switch (analysisType) {
      case 'complete':
        basePrompt += `Proporciona un análisis COMPLETO que incluya:

1. RESUMEN EJECUTIVO:
   - Puntaje de crédito actual y clasificación
   - Estado general del perfil crediticio
   - Fortalezas principales
   - Debilidades críticas

2. ANÁLISIS DETALLADO:
   - Historial de pagos (porcentaje de pagos a tiempo)
   - Utilización de crédito (por cuenta y total)
   - Antigüedad del crédito (promedio y cuenta más antigua)
   - Mix de crédito (tipos de cuentas)
   - Consultas recientes e impacto

3. CUENTAS ACTIVAS:
   - Lista de todas las cuentas abiertas
   - Límites, balances y utilización
   - Estado de cada cuenta

4. ELEMENTOS NEGATIVOS:
   - Morosidades y retrasos
   - Colecciones
   - Cargos por mora
   - Bancarrotas o gravámenes

5. PROBABILIDAD DE APROBACIÓN:
   Para cada tipo de producto financiero:
   - Tarjetas de crédito premium (>5%): X%
   - Tarjetas de crédito estándar: X%
   - Préstamo automotriz: X%
   - Préstamo hipotecario: X%
   - Préstamo personal: X%

   Justifica cada probabilidad con datos específicos.

6. RECOMENDACIONES PRIORITARIAS:
   - Top 3 acciones inmediatas
   - Estrategias a mediano plazo (3-6 meses)
   - Objetivos a largo plazo (6-12 meses)

7. MÉTRICAS CLAVE:
   - Relación deuda-ingreso estimada
   - Capacidad de pago disponible
   - Tendencia del puntaje (mejorando/declinando)

Formato: JSON estructurado para fácil procesamiento.`;
        break;

      case 'quick':
        basePrompt += `Proporciona un análisis RÁPIDO que incluya:
1. Puntaje de crédito y clasificación
2. Top 3 fortalezas
3. Top 3 debilidades
4. Probabilidad de aprobación (tarjetas y préstamos)
5. 3 recomendaciones principales

Formato: JSON estructurado.`;
        break;

      case 'approval':
        basePrompt += `Enfócate en PROBABILIDAD DE APROBACIÓN:
1. Analiza exhaustivamente todos los factores que afectan aprobaciones
2. Calcula probabilidad específica para:
   - Tarjetas premium, estándar y básicas
   - Préstamos hipotecarios
   - Préstamos automotrices
   - Préstamos personales
   - Líneas de crédito
3. Justifica cada probabilidad con datos concretos
4. Indica qué mejorar para aumentar probabilidades

Formato: JSON estructurado.`;
        break;

      case 'improvement':
        basePrompt += `Enfócate en PLAN DE MEJORA:
1. Identifica todos los problemas del reporte
2. Prioriza acciones por impacto (alto/medio/bajo)
3. Crea timeline de 12 meses con objetivos mensuales
4. Calcula mejora esperada del puntaje
5. Estrategias para:
   - Reducir utilización
   - Eliminar negativos
   - Construir historial positivo
   - Optimizar mix de crédito

Formato: JSON estructurado.`;
        break;
    }

    basePrompt += `\n\nIMPORTANTE:
- Responde SOLO con JSON válido, sin markdown ni texto adicional
- Sé extremadamente preciso con los números
- Basa TODO en los datos del reporte
- Si falta información, indícalo claramente`;

    return basePrompt;
  }

  parseResponse(response, analysisType) {
    try {
      // Limpiar el response si viene con markdown
      let cleanResponse = response.trim();

      // Remover bloques de código markdown
      if (cleanResponse.includes('```')) {
        // Extraer contenido entre ```json y ``` o entre ``` y ```
        const jsonMatch = cleanResponse.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[1].trim();
        } else {
          // Si no encuentra el patrón, remover todos los ```
          cleanResponse = cleanResponse.replace(/```(?:json)?/g, '').replace(/```/g, '');
        }
      }

      // Intentar parsear JSON
      const parsed = JSON.parse(cleanResponse);

      // Validar que tenga los campos mínimos esperados
      this.validateAnalysis(parsed, analysisType);

      console.log('✓ Análisis parseado correctamente como JSON');
      return parsed;
    } catch (error) {
      console.error('Error parseando JSON:', error.message);
      console.log('Usando parser de respaldo para análisis en texto...');

      // Si el JSON falla, intentar extraer información estructurada del texto
      return this.fallbackParse(response, analysisType);
    }
  }

  validateAnalysis(analysis, analysisType) {
    // Validaciones básicas según el tipo de análisis
    if (analysisType === 'complete' || analysisType === 'quick') {
      if (!analysis.creditScore && !analysis.credit_score) {
        console.warn('Análisis no incluye puntaje de crédito');
      }
    }

    if (analysisType === 'approval' || analysisType === 'complete') {
      if (!analysis.approvalProbabilities && !analysis.approval_probabilities) {
        console.warn('Análisis no incluye probabilidades de aprobación');
      }
    }

    return true;
  }

  fallbackParse(response, analysisType) {
    console.log('Usando fallback parser - extrayendo datos del texto...');

    // Intento de parseo de respaldo si el JSON falla
    const analysis = {
      rawResponse: response,
      analysisType,
      timestamp: new Date().toISOString(),
      note: 'Análisis procesado desde texto',
      summary: this.extractSummary(response),
      details: response
    };

    // Intentar extraer puntaje de crédito del texto
    const scoreMatch = response.match(/(?:credit score|puntaje|score|fico)[\s:]*(\d{3})/i);
    if (scoreMatch) {
      analysis.creditScore = parseInt(scoreMatch[1]);
      console.log('✓ Puntaje extraído:', analysis.creditScore);
    }

    // Intentar extraer probabilidades
    const probabilities = {};
    const probPatterns = [
      /(?:premium|tarjeta premium)[\s\S]{0,100}?(\d+)%/i,
      /(?:standard|estándar|tarjeta estándar)[\s\S]{0,100}?(\d+)%/i,
      /(?:mortgage|hipoteca)[\s\S]{0,100}?(\d+)%/i,
      /(?:auto|automotriz)[\s\S]{0,100}?(\d+)%/i
    ];

    const probTypes = ['premium_card', 'standard_card', 'mortgage', 'auto_loan'];
    probPatterns.forEach((pattern, index) => {
      const match = response.match(pattern);
      if (match) {
        probabilities[probTypes[index]] = parseInt(match[1]);
      }
    });

    if (Object.keys(probabilities).length > 0) {
      analysis.approvalProbabilities = probabilities;
      console.log('✓ Probabilidades extraídas:', probabilities);
    }

    // Intentar extraer recomendaciones
    const recommendations = [];
    const recSection = response.match(/(?:recomendaciones|recommendations)[\s\S]*?(?:\n\n|$)/i);
    if (recSection) {
      const lines = recSection[0].split('\n').filter(line =>
        line.trim().match(/^[-*\d.]/));
      recommendations.push(...lines.map(l => l.trim()));
    }

    if (recommendations.length > 0) {
      analysis.recommendations = recommendations;
      console.log('✓ Recomendaciones extraídas:', recommendations.length);
    }

    console.log('✓ Fallback parse completado');
    return analysis;
  }

  extractSummary(text) {
    // Extraer primeras líneas como resumen
    const lines = text.split('\n').filter(line => line.trim());
    return lines.slice(0, 5).join(' ');
  }

  // Análisis específicos por tipo de préstamo
  async analyzeForLoanType(text, loanType, model) {
    const loanPrompts = {
      'mortgage': 'hipotecario (mortgage)',
      'auto': 'automotriz',
      'personal': 'personal',
      'credit_card': 'tarjeta de crédito',
      'business': 'negocio'
    };

    const prompt = `Analiza este reporte de crédito específicamente para un préstamo ${loanPrompts[loanType]}:

${text}

Proporciona:
1. Probabilidad de aprobación (0-100%)
2. Tasa de interés estimada
3. Monto máximo aprobable
4. Factores a favor
5. Factores en contra
6. Requisitos adicionales probables
7. Recomendaciones para mejorar probabilidad

Formato: JSON estructurado`;

    const response = await this.openRouter.chat([
      { role: 'system', content: this.getSystemPrompt() },
      { role: 'user', content: prompt }
    ], model);

    return this.parseResponse(response, 'loan_specific');
  }

  // Calcular score basado en factores conocidos
  calculateEstimatedScore(factors) {
    // Algoritmo simplificado de scoring
    let score = 300; // Base mínima

    // Historial de pagos (35%)
    if (factors.paymentHistory) {
      score += (factors.paymentHistory.onTimePercentage / 100) * 350;
    }

    // Utilización de crédito (30%)
    if (factors.creditUtilization) {
      const utilization = factors.creditUtilization.percentage;
      if (utilization < 10) score += 300;
      else if (utilization < 30) score += 250;
      else if (utilization < 50) score += 150;
      else if (utilization < 75) score += 50;
    }

    // Historial de crédito (15%)
    if (factors.creditAge) {
      const years = factors.creditAge.years;
      if (years >= 10) score += 150;
      else if (years >= 5) score += 100;
      else if (years >= 2) score += 50;
    }

    // Mix de crédito (10%)
    if (factors.creditMix) {
      score += Math.min(factors.creditMix.types * 20, 100);
    }

    // Nuevas consultas (10%)
    if (factors.inquiries) {
      const recent = factors.inquiries.last6Months;
      if (recent === 0) score += 100;
      else if (recent <= 2) score += 75;
      else if (recent <= 5) score += 25;
    }

    return Math.min(Math.round(score), 850);
  }
}

module.exports = CreditAnalyzer;
