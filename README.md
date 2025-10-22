# Credit Report Analyzer

Analizador profesional de reportes de crédito con inteligencia artificial para macOS.

## Características

- **Análisis Completo con IA**: Utiliza los mejores modelos de lenguaje (Claude, GPT-4, Gemini, etc.) a través de OpenRouter
- **Múltiples Formatos**: Lee PDFs y procesa imágenes con OCR
- **Análisis Detallado**: Proporciona puntajes, probabilidades de aprobación y recomendaciones
- **Visualización Gráfica**: Gráficos y métricas visuales para mejor comprensión
- **Interfaz Moderna**: Diseño intuitivo y profesional optimizado para macOS
- **Seguridad**: Almacenamiento encriptado de API keys
- **Historial**: Guarda y revisa análisis anteriores

## Requisitos

- macOS 10.13 o superior
- Cuenta en [OpenRouter](https://openrouter.ai) con API key
- Conexión a Internet

## Instalación

### Opción 1: Desde código fuente

```bash
# Clonar el repositorio
git clone https://github.com/panda0581/creditapp.git
cd creditapp

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para macOS
npm run build
```

### Opción 2: Descarga directa

Descarga el archivo `.dmg` desde la sección de Releases y arrastra la aplicación a tu carpeta de Aplicaciones.

## Configuración Inicial

1. Abre la aplicación
2. Ve a la sección de **Configuración**
3. Ingresa tu API key de OpenRouter
   - Obtén tu API key en: https://openrouter.ai/keys
4. Selecciona tu modelo de IA preferido
5. Guarda la configuración

## Uso

### 1. Cargar Reporte de Crédito

- Arrastra y suelta un archivo PDF o imagen
- O haz clic para seleccionar un archivo
- Formatos soportados: PDF, PNG, JPG, JPEG

### 2. Procesar el Documento

- La aplicación extraerá automáticamente el texto
- Para PDFs: extracción directa de texto
- Para imágenes: procesamiento OCR en inglés y español

### 3. Configurar Análisis

Selecciona el tipo de análisis:

- **Completo**: Análisis exhaustivo con todas las métricas
- **Rápido**: Resumen ejecutivo rápido
- **Probabilidad de Aprobación**: Enfocado en chances de aprobación para préstamos
- **Plan de Mejora**: Estrategias para mejorar el crédito

### 4. Ver Resultados

El análisis incluirá:

- Puntaje de crédito y clasificación
- Probabilidades de aprobación para:
  - Tarjetas de crédito (premium, estándar, básica)
  - Préstamos hipotecarios
  - Préstamos automotrices
  - Préstamos personales
- Métricas clave (utilización, historial, etc.)
- Recomendaciones prioritarias
- Análisis detallado completo

### 5. Exportar Resultados

- Exporta el análisis en formato JSON
- Guarda para registros o comparación futura

## Modelos de IA Disponibles

La aplicación soporta todos los modelos disponibles en OpenRouter, incluyendo:

- **Anthropic Claude** (3.5 Sonnet, Opus) - Recomendado para análisis detallado
- **OpenAI GPT-4** (Turbo, o1) - Excelente razonamiento
- **Google Gemini** Pro - Buena relación costo/beneficio
- **Meta Llama** 3.1 - Opción de código abierto
- Y muchos más...

## Seguridad y Privacidad

- **Almacenamiento local**: Todos tus datos se guardan localmente en tu Mac
- **Encriptación**: Las API keys se almacenan encriptadas
- **Sin telemetría**: No enviamos ningún dato a servidores externos (excepto a OpenRouter para el análisis)
- **Código abierto**: Puedes revisar todo el código fuente

## Solución de Problemas

### El OCR no funciona bien

- Asegúrate de que la imagen tenga buena calidad y resolución
- El texto debe estar horizontal y legible
- Prueba con un PDF en lugar de una captura de pantalla

### Error de API

- Verifica que tu API key sea válida
- Asegúrate de tener créditos en tu cuenta de OpenRouter
- Revisa tu conexión a Internet

### La aplicación no abre

- Verifica que tienes macOS 10.13 o superior
- En Preferencias del Sistema > Seguridad, permite la ejecución de la app

## Desarrollo

### Estructura del Proyecto

```
creditapp/
├── src/
│   ├── main.js              # Proceso principal de Electron
│   ├── services/            # Servicios backend
│   │   ├── openrouter.js    # Cliente de OpenRouter API
│   │   ├── pdfService.js    # Procesamiento de PDF
│   │   ├── ocrService.js    # Servicio OCR
│   │   └── creditAnalyzer.js # Motor de análisis
│   └── renderer/            # Interfaz de usuario
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── assets/                  # Recursos (iconos, etc.)
├── build/                   # Configuración de build
└── package.json
```

### Scripts Disponibles

```bash
npm start          # Ejecutar aplicación
npm run dev        # Ejecutar en modo desarrollo
npm run build      # Compilar para macOS (ambas arquitecturas)
npm run pack       # Empaquetar sin crear instalador
```

## Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

MIT License - ver archivo LICENSE para más detalles

## Soporte

Para reportar bugs o solicitar features, por favor abre un issue en GitHub.

## Roadmap

- [ ] Soporte para más idiomas en OCR
- [ ] Exportación a PDF con formato
- [ ] Comparación de análisis históricos
- [ ] Alertas y recordatorios
- [ ] Integración con bureaus de crédito
- [ ] Modo oscuro/claro personalizable
- [ ] Gráficos interactivos avanzados

## Agradecimientos

- OpenRouter por proporcionar acceso a múltiples modelos de IA
- La comunidad de Electron
- Tesseract.js para OCR
- Chart.js para visualizaciones

---

Hecho con ❤️ para ayudarte a entender y mejorar tu crédito
