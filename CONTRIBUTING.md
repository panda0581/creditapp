# Contribuyendo a Credit Report Analyzer

¡Gracias por tu interés en contribuir! Este documento te guiará en el proceso.

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

1. **Título descriptivo**: Resume el problema en una línea
2. **Descripción detallada**: Explica qué esperabas vs. qué ocurrió
3. **Pasos para reproducir**:
   - Paso 1...
   - Paso 2...
   - Resultado esperado vs. resultado actual
4. **Entorno**:
   - Versión de macOS
   - Versión de la aplicación
   - Versión de Node.js (si aplica)
5. **Screenshots/Logs**: Si es posible

### Sugerir Features

Para sugerir nuevas características:

1. Crea un issue con el tag "enhancement"
2. Describe el problema que resolvería
3. Propón una solución
4. Considera alternativas
5. ¿Estarías dispuesto a implementarlo?

### Pull Requests

#### Proceso

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```
3. **Haz tus cambios**
4. **Prueba** que todo funciona
5. **Commit** con mensajes descriptivos
6. **Push** a tu fork
7. **Crea un Pull Request**

#### Guías de Estilo

**JavaScript:**
- Usa ES6+ features
- 2 espacios para indentación
- Punto y coma al final de statements
- Nombres descriptivos de variables
- Comenta código complejo

```javascript
// Bueno
async function analyzeReport(text, options) {
  const sanitizedText = sanitize(text);
  return await analyzer.analyze(sanitizedText);
}

// Evitar
async function a(t,o){return await b(c(t))}
```

**CSS:**
- Usa variables CSS (--variable-name)
- Mobile-first approach
- BEM naming cuando sea apropiado
- Agrupa propiedades relacionadas

**Commits:**
- Usa el presente: "Add feature" no "Added feature"
- Primera línea: resumen corto (<50 chars)
- Cuerpo: explica el "qué" y "por qué", no el "cómo"

```
Add credit score validation

- Validates scores are between 300-850
- Shows error for invalid ranges
- Adds unit tests for edge cases
```

## Estructura del Proyecto

```
creditapp/
├── src/
│   ├── main.js              # Proceso principal Electron
│   ├── services/            # Lógica de negocio
│   │   ├── openrouter.js    # API client
│   │   ├── pdfService.js    # PDF processing
│   │   ├── ocrService.js    # OCR
│   │   └── creditAnalyzer.js # Core analysis
│   ├── renderer/            # Frontend
│   │   ├── index.html       # Main UI
│   │   ├── styles.css       # Styles
│   │   └── app.js           # UI logic
│   └── utils/               # Utilities
│       ├── security.js      # Security helpers
│       └── validators.js    # Validation logic
├── assets/                  # Static assets
├── build/                   # Build configs
└── tests/                   # Tests (future)
```

## Áreas que Necesitan Ayuda

### Alta Prioridad

- [ ] Tests unitarios y de integración
- [ ] Soporte para más idiomas
- [ ] Gráficos interactivos avanzados
- [ ] Export a PDF con formato

### Media Prioridad

- [ ] Modo oscuro/claro
- [ ] Comparación visual de análisis
- [ ] Plantillas de reportes
- [ ] Integración con calendarios

### Baja Prioridad

- [ ] Temas personalizables
- [ ] Plugins/extensiones
- [ ] Versión web
- [ ] Apps móviles

## Testing

Actualmente el proyecto necesita tests. Si quieres contribuir:

```bash
# Instalar dependencias de testing
npm install --save-dev jest electron-mocha

# Crear tests en tests/
# Ejecutar tests
npm test
```

### Ejemplo de Test

```javascript
// tests/validators.test.js
const validators = require('../src/utils/validators');

describe('Credit Report Validators', () => {
  test('should identify valid credit report', () => {
    const text = `
      Credit Score: 750
      Payment History: Excellent
      Credit Utilization: 25%
    `;

    const result = validators.isLikelyCreditReport(text);
    expect(result.valid).toBe(true);
    expect(result.confidence).toBeGreaterThan(30);
  });
});
```

## Configuración de Desarrollo

### Prerrequisitos

- Node.js 16+
- npm 7+
- macOS 10.13+ (para testing en Mac)
- Git

### Setup

```bash
# Clonar tu fork
git clone https://github.com/TU-USUARIO/creditapp.git
cd creditapp

# Añadir upstream
git remote add upstream https://github.com/panda0581/creditapp.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Mantener tu Fork Actualizado

```bash
# Obtener cambios del upstream
git fetch upstream

# Mergear a tu main
git checkout main
git merge upstream/main

# Push a tu fork
git push origin main
```

## Código de Conducta

### Nuestros Estándares

**Comportamiento Esperado:**
- Usar lenguaje inclusivo y acogedor
- Respetar puntos de vista diferentes
- Aceptar crítica constructiva
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

**Comportamiento Inaceptable:**
- Comentarios ofensivos o discriminatorios
- Ataques personales o políticos
- Acoso público o privado
- Compartir información privada sin permiso
- Conducta poco profesional

### Enforcement

Casos de comportamiento inaceptable pueden reportarse a los maintainers.
Todas las quejas serán revisadas e investigadas.

## Reconocimientos

Los contribuidores serán reconocidos en:
- README.md (sección de Contributors)
- Release notes
- Página de About en la app

## Preguntas

¿Tienes preguntas? Puedes:
- Abrir un issue con tag "question"
- Revisar issues existentes
- Contactar a los maintainers

## Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la MIT License.

---

¡Gracias por hacer Credit Report Analyzer mejor! 🎉
