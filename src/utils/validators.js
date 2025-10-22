// Validadores específicos para reportes de crédito

class CreditReportValidators {
  // Validar que el texto parece ser un reporte de crédito
  isLikelyCreditReport(text) {
    if (!text || typeof text !== 'string') {
      return { valid: false, confidence: 0, reason: 'Texto inválido' };
    }

    const indicators = {
      // Términos comunes en reportes de crédito
      creditTerms: [
        'credit score', 'fico', 'vantagescore', 'credit report',
        'puntaje de crédito', 'reporte de crédito', 'historial crediticio',
        'equifax', 'experian', 'transunion',
        'payment history', 'historial de pagos',
        'credit utilization', 'utilización de crédito',
        'delinquent', 'moroso', 'collection', 'colección',
        'account', 'cuenta', 'balance', 'limit', 'límite'
      ],

      // Términos de cuentas
      accountTerms: [
        'revolving', 'installment', 'mortgage', 'hipoteca',
        'auto loan', 'préstamo', 'credit card', 'tarjeta de crédito',
        'current balance', 'saldo actual', 'payment status', 'estado de pago'
      ],

      // Patrones numéricos (scores, fechas, montos)
      patterns: {
        score: /\b[3-8]\d{2}\b/g, // Scores típicamente 300-850
        date: /\d{1,2}\/\d{1,2}\/\d{2,4}/g,
        currency: /\$[\d,]+\.?\d*/g,
        percentage: /\d+\.?\d*%/g
      }
    };

    let confidence = 0;
    const foundTerms = [];

    // Buscar términos de crédito (40% del score)
    const creditTermsFound = indicators.creditTerms.filter(term =>
      text.toLowerCase().includes(term.toLowerCase())
    );
    confidence += (creditTermsFound.length / indicators.creditTerms.length) * 40;
    foundTerms.push(...creditTermsFound);

    // Buscar términos de cuentas (30% del score)
    const accountTermsFound = indicators.accountTerms.filter(term =>
      text.toLowerCase().includes(term.toLowerCase())
    );
    confidence += (accountTermsFound.length / indicators.accountTerms.length) * 30;
    foundTerms.push(...accountTermsFound);

    // Buscar patrones numéricos (30% del score)
    let patternScore = 0;
    for (const [name, pattern] of Object.entries(indicators.patterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        patternScore += 7.5; // 7.5 * 4 patterns = 30
      }
    }
    confidence += Math.min(patternScore, 30);

    const isValid = confidence >= 30; // Umbral de confianza del 30%

    return {
      valid: isValid,
      confidence: Math.round(confidence),
      foundTerms: foundTerms.slice(0, 10), // Top 10 términos encontrados
      reason: isValid
        ? `Detectado como reporte de crédito con ${Math.round(confidence)}% de confianza`
        : `No parece ser un reporte de crédito (confianza: ${Math.round(confidence)}%)`
    };
  }

  // Extraer información básica del reporte
  extractBasicInfo(text) {
    const info = {
      possibleScores: [],
      dates: [],
      amounts: [],
      accounts: []
    };

    // Buscar posibles scores
    const scorePattern = /(?:score|puntaje|fico|vantagescore)[\s:]*(\d{3})/gi;
    let match;
    while ((match = scorePattern.exec(text)) !== null) {
      const score = parseInt(match[1]);
      if (score >= 300 && score <= 850) {
        info.possibleScores.push(score);
      }
    }

    // Buscar fechas
    const datePattern = /\d{1,2}\/\d{1,2}\/\d{2,4}/g;
    info.dates = text.match(datePattern) || [];

    // Buscar montos
    const amountPattern = /\$[\d,]+\.?\d*/g;
    info.amounts = text.match(amountPattern) || [];

    // Buscar tipos de cuentas
    const accountTypes = ['credit card', 'mortgage', 'auto loan', 'student loan', 'personal loan'];
    accountTypes.forEach(type => {
      if (text.toLowerCase().includes(type)) {
        info.accounts.push(type);
      }
    });

    return info;
  }

  // Validar longitud mínima del texto
  hasMinimumContent(text, minLength = 200) {
    if (!text) return false;
    return text.trim().length >= minLength;
  }

  // Detectar idioma del reporte
  detectLanguage(text) {
    const spanishWords = ['crédito', 'préstamo', 'cuenta', 'puntaje', 'historial', 'pago'];
    const englishWords = ['credit', 'loan', 'account', 'score', 'history', 'payment'];

    const spanishCount = spanishWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;

    const englishCount = englishWords.filter(word =>
      text.toLowerCase().includes(word)
    ).length;

    if (spanishCount > englishCount) {
      return { language: 'es', confidence: spanishCount / spanishWords.length };
    } else if (englishCount > spanishCount) {
      return { language: 'en', confidence: englishCount / englishWords.length };
    } else {
      return { language: 'unknown', confidence: 0 };
    }
  }

  // Validar que el análisis del modelo sea coherente
  validateAnalysisStructure(analysis) {
    const errors = [];
    const warnings = [];

    // Verificar campos esperados
    if (analysis.creditScore || analysis.credit_score) {
      const score = analysis.creditScore || analysis.credit_score;
      const scoreValue = typeof score === 'object' ? score.value : score;

      if (scoreValue < 300 || scoreValue > 850) {
        errors.push(`Puntaje fuera de rango: ${scoreValue}`);
      }
    } else {
      warnings.push('No se encontró puntaje de crédito en el análisis');
    }

    // Verificar probabilidades
    if (analysis.approvalProbabilities || analysis.approval_probabilities) {
      const probs = analysis.approvalProbabilities || analysis.approval_probabilities;

      for (const [type, prob] of Object.entries(probs)) {
        const value = typeof prob === 'object' ? prob.percentage : prob;

        if (value < 0 || value > 100) {
          errors.push(`Probabilidad inválida para ${type}: ${value}%`);
        }
      }
    }

    // Verificar recomendaciones
    if (analysis.recommendations) {
      if (!Array.isArray(analysis.recommendations)) {
        errors.push('Recomendaciones debe ser un array');
      } else if (analysis.recommendations.length === 0) {
        warnings.push('No hay recomendaciones en el análisis');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

module.exports = new CreditReportValidators();
