// Utilidades de seguridad para la aplicación

const crypto = require('crypto');

class Security {
  constructor() {
    this.algorithm = 'aes-256-cbc';
  }

  // Validar API Key de OpenRouter
  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return { valid: false, error: 'API key es requerida' };
    }

    // OpenRouter keys empiezan con sk-or-
    if (!apiKey.startsWith('sk-or-')) {
      return { valid: false, error: 'API key de OpenRouter debe empezar con sk-or-' };
    }

    if (apiKey.length < 20) {
      return { valid: false, error: 'API key parece ser inválida (muy corta)' };
    }

    return { valid: true };
  }

  // Sanitizar texto extraído
  sanitizeText(text) {
    if (!text) return '';

    // Remover caracteres de control excepto saltos de línea y tabs
    text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Limitar longitud máxima (por seguridad y límites de API)
    const maxLength = 100000; // ~100k caracteres
    if (text.length > maxLength) {
      console.warn(`Texto truncado de ${text.length} a ${maxLength} caracteres`);
      text = text.substring(0, maxLength);
    }

    return text.trim();
  }

  // Validar archivo antes de procesar
  validateFile(filePath, maxSize = 50 * 1024 * 1024) {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'El archivo no existe' };
    }

    // Verificar que es un archivo
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return { valid: false, error: 'La ruta no apunta a un archivo válido' };
    }

    // Verificar tamaño
    if (stats.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      return { valid: false, error: `El archivo excede el tamaño máximo de ${sizeMB}MB` };
    }

    // Verificar extensión
    const ext = path.extname(filePath).toLowerCase();
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'];

    if (!allowedExtensions.includes(ext)) {
      return { valid: false, error: 'Tipo de archivo no permitido' };
    }

    return { valid: true, size: stats.size, extension: ext };
  }

  // Sanitizar nombre de archivo para guardar
  sanitizeFileName(fileName) {
    // Remover caracteres peligrosos
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255); // Límite de longitud
  }

  // Validar respuesta de modelo de IA
  validateAIResponse(response) {
    if (!response || typeof response !== 'string') {
      return { valid: false, error: 'Respuesta del modelo inválida' };
    }

    // Verificar longitud razonable
    if (response.length < 10) {
      return { valid: false, error: 'Respuesta demasiado corta' };
    }

    if (response.length > 50000) {
      console.warn('Respuesta muy larga del modelo');
    }

    return { valid: true };
  }

  // Detectar posible información sensible en texto
  detectSensitiveInfo(text) {
    const patterns = {
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g, // SSN format
      creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
    };

    const found = {};
    let hasSensitive = false;

    for (const [type, pattern] of Object.entries(patterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        found[type] = matches.length;
        hasSensitive = true;
      }
    }

    return { hasSensitive, details: found };
  }

  // Rate limiting simple (prevenir abuso)
  createRateLimiter(maxRequests = 10, windowMs = 60000) {
    const requests = [];

    return {
      check: () => {
        const now = Date.now();
        // Limpiar requests antiguos
        const validRequests = requests.filter(time => now - time < windowMs);
        requests.length = 0;
        requests.push(...validRequests);

        if (requests.length >= maxRequests) {
          return {
            allowed: false,
            retryAfter: windowMs - (now - requests[0])
          };
        }

        requests.push(now);
        return { allowed: true };
      },
      reset: () => {
        requests.length = 0;
      }
    };
  }

  // Hash para comparaciones seguras
  hash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  // Generar ID único para análisis
  generateAnalysisId() {
    return `analysis_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  // Validar configuración de usuario
  validateConfig(config) {
    const errors = [];

    if (config.apiKey) {
      const apiKeyValidation = this.validateApiKey(config.apiKey);
      if (!apiKeyValidation.valid) {
        errors.push(apiKeyValidation.error);
      }
    }

    if (config.maxFileSize && typeof config.maxFileSize !== 'number') {
      errors.push('maxFileSize debe ser un número');
    }

    if (config.defaultModel && typeof config.defaultModel !== 'string') {
      errors.push('defaultModel debe ser un string');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = new Security();
