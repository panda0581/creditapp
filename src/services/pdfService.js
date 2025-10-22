const fs = require('fs');
const pdfParse = require('pdf-parse');

class PDFService {
  constructor() {
    this.supportedFormats = ['.pdf'];
  }

  async extractText(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer, {
        max: 0, // 0 = extraer todas las páginas
        version: 'default'
      });

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('El PDF no contiene texto extraíble. Intente con OCR si es una imagen escaneada.');
      }

      return {
        text: data.text,
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error extrayendo texto del PDF:', error);
      throw new Error(`No se pudo procesar el PDF: ${error.message}`);
    }
  }

  async extractTextWithOCR(filePath, ocrService) {
    // Si el PDF no tiene texto, intentar con OCR
    try {
      const text = await this.extractText(filePath);
      return text;
    } catch (error) {
      console.log('Intentando OCR en PDF...');
      // Aquí se podría implementar conversión de PDF a imágenes y luego OCR
      throw new Error('Este PDF requiere procesamiento OCR avanzado');
    }
  }

  validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error('El archivo no existe');
    }

    const ext = filePath.toLowerCase().slice(filePath.lastIndexOf('.'));
    if (!this.supportedFormats.includes(ext)) {
      throw new Error('Formato de archivo no soportado');
    }

    const stats = fs.statSync(filePath);
    if (stats.size > 50 * 1024 * 1024) { // 50MB límite
      throw new Error('El archivo es demasiado grande (máximo 50MB)');
    }

    return true;
  }
}

module.exports = PDFService;
