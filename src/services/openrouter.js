const axios = require('axios');

class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://credit-analyzer.app',
        'X-Title': 'Credit Report Analyzer'
      }
    });
  }

  async getAvailableModels() {
    try {
      const response = await this.client.get('/models');
      return response.data.data.map(model => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description,
        pricing: model.pricing,
        context_length: model.context_length
      }));
    } catch (error) {
      console.error('Error obteniendo modelos:', error);
      throw new Error('No se pudieron obtener los modelos disponibles');
    }
  }

  async chat(messages, model = 'anthropic/claude-3.5-sonnet', options = {}) {
    try {
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000,
        top_p: options.top_p || 1,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error en llamada a OpenRouter:', error.response?.data || error);
      throw new Error(`Error al comunicarse con el modelo: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async streamChat(messages, model, onChunk, options = {}) {
    try {
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000,
        stream: true
      }, {
        responseType: 'stream'
      });

      return new Promise((resolve, reject) => {
        let fullContent = '';

        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.includes('[DONE]')) {
              resolve(fullContent);
              return;
            }

            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices[0]?.delta?.content;

                if (content) {
                  fullContent += content;
                  onChunk(content);
                }
              } catch (e) {
                // Ignorar errores de parsing
              }
            }
          }
        });

        response.data.on('end', () => {
          resolve(fullContent);
        });

        response.data.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error en streaming:', error);
      throw error;
    }
  }
}

module.exports = OpenRouterService;
