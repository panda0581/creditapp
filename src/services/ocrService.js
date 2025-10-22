const Tesseract = require('tesseract.js');
const fs = require('fs');

class OCRService {
  constructor() {
    this.supportedFormats = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp'];
    this.languages = ['eng', 'spa']; // Inglés y Español
  }

  async extractText(filePath, options = {}) {
    try {
      this.validateFile(filePath);

      const result = await Tesseract.recognize(
        filePath,
        this.languages.join('+'),
        {
          logger: options.logger || ((m) => {
            if (options.onProgress && m.status === 'recognizing text') {
              options.onProgress(m.progress * 100);
            }
          })
        }
      );

      if (!result.data.text || result.data.text.trim().length === 0) {
        throw new Error('No se pudo extraer texto de la imagen');
      }

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words?.length || 0,
        lines: result.data.lines?.length || 0
      };
    } catch (error) {
      console.error('Error en OCR:', error);
      throw new Error(`No se pudo procesar la imagen: ${error.message}`);
    }
  }

  async extractTextAdvanced(filePath, options = {}) {
    try {
      this.validateFile(filePath);

      const worker = await Tesseract.createWorker(this.languages);

      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: '1',
      });

      const result = await worker.recognize(filePath);
      await worker.terminate();

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words,
        lines: result.data.lines,
        paragraphs: result.data.paragraphs
      };
    } catch (error) {
      console.error('Error en OCR avanzado:', error);
      throw error;
    }
  }

  validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error('El archivo no existe');
    }

    const ext = filePath.toLowerCase().slice(filePath.lastIndexOf('.'));
    if (!this.supportedFormats.includes(ext)) {
      throw new Error('Formato de imagen no soportado');
    }

    const stats = fs.statSync(filePath);
    if (stats.size > 20 * 1024 * 1024) { // 20MB límite
      throw new Error('La imagen es demasiado grande (máximo 20MB)');
    }

    return true;
  }

  getSupportedFormats() {
    return this.supportedFormats;
  }
}

module.exports = OCRService;
