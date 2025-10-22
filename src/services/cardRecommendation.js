// Motor de recomendación de tarjetas de crédito

class CardRecommendationEngine {
  constructor() {
    // Base de datos de tarjetas disponibles
    this.cards = [
      {
        id: 'chase_sapphire_reserve',
        name: 'Chase Sapphire Reserve',
        issuer: 'Chase',
        type: 'premium',
        annual_fee: 550,
        rewards: {
          travel: 3,
          dining: 3,
          general: 1
        },
        benefits: ['Airport Lounge Access', '$300 Travel Credit', 'Priority Pass'],
        min_credit_score: 750,
        min_income: 60000,
        best_for: ['frequent travelers', 'high spenders']
      },
      {
        id: 'amex_platinum',
        name: 'American Express Platinum',
        issuer: 'American Express',
        type: 'premium',
        annual_fee: 695,
        rewards: {
          travel: 5,
          dining: 1,
          general: 1
        },
        benefits: ['Centurion Lounge', '$200 Hotel Credit', '$200 Airline Credit'],
        min_credit_score: 740,
        min_income: 70000,
        best_for: ['luxury travelers', 'amex users']
      },
      {
        id: 'chase_sapphire_preferred',
        name: 'Chase Sapphire Preferred',
        issuer: 'Chase',
        type: 'standard',
        annual_fee: 95,
        rewards: {
          travel: 2,
          dining: 2,
          general: 1
        },
        benefits: ['Travel Insurance', 'No Foreign Transaction Fees'],
        min_credit_score: 690,
        min_income: 35000,
        best_for: ['moderate travelers', 'reward seekers']
      },
      {
        id: 'citi_double_cash',
        name: 'Citi Double Cash',
        issuer: 'Citi',
        type: 'standard',
        annual_fee: 0,
        rewards: {
          cashback: 2
        },
        benefits: ['No Annual Fee', 'Simple Cashback'],
        min_credit_score: 670,
        min_income: 25000,
        best_for: ['cashback lovers', 'simple rewards']
      },
      {
        id: 'discover_it',
        name: 'Discover it Cash Back',
        issuer: 'Discover',
        type: 'standard',
        annual_fee: 0,
        rewards: {
          rotating: 5,
          general: 1
        },
        benefits: ['No Annual Fee', '5% Rotating Categories', 'Cashback Match'],
        min_credit_score: 640,
        min_income: 20000,
        best_for: ['students', 'building credit']
      },
      {
        id: 'capital_one_venture',
        name: 'Capital One Venture',
        issuer: 'Capital One',
        type: 'standard',
        annual_fee: 95,
        rewards: {
          travel: 2,
          general: 2
        },
        benefits: ['Global Entry Credit', 'No Foreign Transaction Fees'],
        min_credit_score: 680,
        min_income: 30000,
        best_for: ['flexible travelers', 'simple redemption']
      },
      {
        id: 'secured_card',
        name: 'Secured Credit Card',
        issuer: 'Various',
        type: 'secured',
        annual_fee: 0,
        deposit_required: 200,
        rewards: {},
        benefits: ['Build Credit', 'Graduate to Unsecured'],
        min_credit_score: 300,
        min_income: 12000,
        best_for: ['building credit', 'no credit history']
      }
    ];
  }

  // Analizar perfil financiero completo
  analyzeFinancialProfile(profile) {
    const {
      creditScore,
      monthlyIncome,
      monthlyExpenses,
      currentDebt,
      utilization,
      paymentHistory
    } = profile;

    // Calcular métricas clave
    const dti = (currentDebt / (monthlyIncome * 12)) * 100; // Debt-to-Income ratio
    const availableIncome = monthlyIncome - monthlyExpenses - (currentDebt / 12);
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

    return {
      creditScore,
      dti,
      availableIncome,
      savingsRate,
      utilization,
      paymentHistory,
      financialHealth: this.calculateFinancialHealth(profile)
    };
  }

  // Calcular salud financiera general
  calculateFinancialHealth(profile) {
    let score = 0;
    const factors = [];

    // Factor 1: Credit Score (35%)
    if (profile.creditScore >= 750) {
      score += 35;
      factors.push({ name: 'Puntaje de Crédito', value: 'Excelente', impact: 35 });
    } else if (profile.creditScore >= 670) {
      score += 25;
      factors.push({ name: 'Puntaje de Crédito', value: 'Bueno', impact: 25 });
    } else if (profile.creditScore >= 580) {
      score += 15;
      factors.push({ name: 'Puntaje de Crédito', value: 'Regular', impact: 15 });
    } else {
      score += 5;
      factors.push({ name: 'Puntaje de Crédito', value: 'Pobre', impact: 5 });
    }

    // Factor 2: DTI Ratio (25%)
    const dti = (profile.currentDebt / (profile.monthlyIncome * 12)) * 100;
    if (dti < 20) {
      score += 25;
      factors.push({ name: 'Relación Deuda-Ingreso', value: `${dti.toFixed(1)}% (Excelente)`, impact: 25 });
    } else if (dti < 36) {
      score += 18;
      factors.push({ name: 'Relación Deuda-Ingreso', value: `${dti.toFixed(1)}% (Bueno)`, impact: 18 });
    } else if (dti < 43) {
      score += 10;
      factors.push({ name: 'Relación Deuda-Ingreso', value: `${dti.toFixed(1)}% (Aceptable)`, impact: 10 });
    } else {
      score += 3;
      factors.push({ name: 'Relación Deuda-Ingreso', value: `${dti.toFixed(1)}% (Alto)`, impact: 3 });
    }

    // Factor 3: Utilization (20%)
    if (profile.utilization < 10) {
      score += 20;
      factors.push({ name: 'Utilización de Crédito', value: `${profile.utilization}% (Óptimo)`, impact: 20 });
    } else if (profile.utilization < 30) {
      score += 15;
      factors.push({ name: 'Utilización de Crédito', value: `${profile.utilization}% (Bueno)`, impact: 15 });
    } else if (profile.utilization < 50) {
      score += 8;
      factors.push({ name: 'Utilización de Crédito', value: `${profile.utilization}% (Alto)`, impact: 8 });
    } else {
      score += 2;
      factors.push({ name: 'Utilización de Crédito', value: `${profile.utilization}% (Muy Alto)`, impact: 2 });
    }

    // Factor 4: Payment History (20%)
    if (profile.paymentHistory >= 98) {
      score += 20;
      factors.push({ name: 'Historial de Pagos', value: `${profile.paymentHistory}% (Perfecto)`, impact: 20 });
    } else if (profile.paymentHistory >= 90) {
      score += 15;
      factors.push({ name: 'Historial de Pagos', value: `${profile.paymentHistory}% (Excelente)`, impact: 15 });
    } else if (profile.paymentHistory >= 75) {
      score += 8;
      factors.push({ name: 'Historial de Pagos', value: `${profile.paymentHistory}% (Regular)`, impact: 8 });
    } else {
      score += 2;
      factors.push({ name: 'Historial de Pagos', value: `${profile.paymentHistory}% (Pobre)`, impact: 2 });
    }

    let healthLevel;
    if (score >= 85) healthLevel = 'Excelente';
    else if (score >= 70) healthLevel = 'Muy Bueno';
    else if (score >= 50) healthLevel = 'Bueno';
    else if (score >= 30) healthLevel = 'Regular';
    else healthLevel = 'Necesita Mejorar';

    return {
      score,
      level: healthLevel,
      factors
    };
  }

  // Recomendar tarjetas basadas en perfil
  recommendCards(profile, limit = 5) {
    const analyzed = this.analyzeFinancialProfile(profile);
    const recommendations = [];

    for (const card of this.cards) {
      const score = this.scoreCard(card, profile, analyzed);

      if (score.eligible) {
        recommendations.push({
          ...card,
          matchScore: score.total,
          approvalProbability: score.approvalProbability,
          reasons: score.reasons,
          warnings: score.warnings,
          estimatedLimit: this.estimateCreditLimit(card, profile)
        });
      }
    }

    // Ordenar por match score
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return recommendations.slice(0, limit);
  }

  // Calcular score de match de tarjeta
  scoreCard(card, profile, analyzed) {
    let total = 0;
    const reasons = [];
    const warnings = [];
    let eligible = true;

    // Verificar elegibilidad básica
    if (profile.creditScore < card.min_credit_score - 30) {
      eligible = false;
      return { total: 0, eligible: false, reasons: ['Puntaje de crédito demasiado bajo'] };
    }

    if (profile.monthlyIncome * 12 < card.min_income * 0.8) {
      warnings.push('Ingreso por debajo del mínimo sugerido');
    }

    // Score por crédito (40%)
    const creditDiff = profile.creditScore - card.min_credit_score;
    if (creditDiff >= 50) {
      total += 40;
      reasons.push('Puntaje de crédito muy por encima del mínimo');
    } else if (creditDiff >= 20) {
      total += 30;
      reasons.push('Buen puntaje de crédito para esta tarjeta');
    } else if (creditDiff >= 0) {
      total += 20;
      reasons.push('Cumple con el puntaje mínimo');
    } else if (creditDiff >= -30) {
      total += 10;
      warnings.push('Puntaje de crédito justo por debajo del ideal');
    }

    // Score por ingreso (30%)
    const incomeDiff = (profile.monthlyIncome * 12) - card.min_income;
    if (incomeDiff >= 30000) {
      total += 30;
      reasons.push('Ingreso significativamente por encima del mínimo');
    } else if (incomeDiff >= 10000) {
      total += 22;
      reasons.push('Buen nivel de ingresos');
    } else if (incomeDiff >= 0) {
      total += 15;
    } else {
      total += 5;
    }

    // Score por DTI (15%)
    if (analyzed.dti < 20) {
      total += 15;
      reasons.push('Excelente relación deuda-ingreso');
    } else if (analyzed.dti < 36) {
      total += 10;
    } else if (analyzed.dti < 43) {
      total += 5;
      warnings.push('Relación deuda-ingreso elevada');
    }

    // Score por utilización (15%)
    if (profile.utilization < 10) {
      total += 15;
      reasons.push('Utilización de crédito óptima');
    } else if (profile.utilization < 30) {
      total += 10;
    } else if (profile.utilization < 50) {
      total += 5;
      warnings.push('Utilización de crédito alta');
    } else {
      warnings.push('Utilización de crédito muy alta');
    }

    // Calcular probabilidad de aprobación
    let approvalProbability = (total / 100) * 100;
    if (warnings.length > 2) approvalProbability -= 15;
    if (warnings.length > 0) approvalProbability -= 5;
    approvalProbability = Math.max(0, Math.min(100, approvalProbability));

    return {
      total,
      eligible,
      reasons,
      warnings,
      approvalProbability
    };
  }

  // Estimar límite de crédito
  estimateCreditLimit(card, profile) {
    const baseLimit = profile.monthlyIncome * 0.3;
    let multiplier = 1;

    if (card.type === 'premium') multiplier = 3;
    else if (card.type === 'standard') multiplier = 2;
    else if (card.type === 'secured') multiplier = 0;

    const limit = baseLimit * multiplier;

    // Ajustar por puntaje de crédito
    let adjustment = 1;
    if (profile.creditScore >= 750) adjustment = 1.5;
    else if (profile.creditScore >= 700) adjustment = 1.2;
    else if (profile.creditScore >= 650) adjustment = 1.0;
    else adjustment = 0.7;

    const estimatedLimit = limit * adjustment;

    return {
      min: Math.round(estimatedLimit * 0.7 / 100) * 100,
      max: Math.round(estimatedLimit * 1.3 / 100) * 100,
      likely: Math.round(estimatedLimit / 100) * 100
    };
  }
}

module.exports = CardRecommendationEngine;
