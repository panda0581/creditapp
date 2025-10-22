# Guía de Uso - Credit Report Analyzer

## Inicio Rápido

### 1. Primera Configuración

Al abrir la aplicación por primera vez:

1. Haz clic en "Configuración" en el menú lateral
2. Ingresa tu API key de OpenRouter
3. Selecciona tu modelo de IA preferido
4. Haz clic en "Guardar Configuración"
5. (Opcional) Haz clic en "Probar Conexión" para verificar

### 2. Analizar un Reporte de Crédito

#### Paso 1: Cargar el documento

**Opción A - Arrastrar y Soltar:**
- Arrastra tu archivo PDF o imagen directamente al área de carga

**Opción B - Seleccionar archivo:**
- Haz clic en el área de carga
- Selecciona tu archivo en el explorador

**Formatos aceptados:**
- PDF (.pdf) - hasta 50MB
- Imágenes (.png, .jpg, .jpeg, .tiff, .bmp) - hasta 20MB

#### Paso 2: Procesamiento automático

La aplicación automáticamente:
- Extrae el texto del PDF
- O procesa la imagen con OCR
- Valida que sea un reporte de crédito
- Muestra una vista previa del texto extraído

#### Paso 3: Configurar el análisis

1. **Seleccionar Modelo de IA:**
   - Claude 3.5 Sonnet (Recomendado para análisis detallado)
   - GPT-4 Turbo (Excelente razonamiento)
   - Gemini Pro (Buena relación costo/beneficio)
   - Otros modelos disponibles

2. **Seleccionar Tipo de Análisis:**

   **Completo** - Análisis exhaustivo
   - Resumen ejecutivo completo
   - Todas las métricas
   - Probabilidades de aprobación detalladas
   - Recomendaciones priorizadas
   - Duración: ~30-60 segundos

   **Rápido** - Resumen ejecutivo
   - Visión general rápida
   - Principales fortalezas y debilidades
   - Probabilidades básicas
   - Duración: ~15-30 segundos

   **Probabilidad de Aprobación** - Enfocado en aprobaciones
   - Cálculo detallado de probabilidades
   - Por tipo de producto financiero
   - Factores que afectan cada probabilidad
   - Duración: ~30-45 segundos

   **Plan de Mejora** - Estrategias de mejora
   - Identificación de problemas
   - Acciones priorizadas por impacto
   - Timeline de 12 meses
   - Duración: ~40-60 segundos

3. **Hacer clic en "Analizar Reporte"**

#### Paso 4: Revisar resultados

El análisis mostrará:

**Puntaje de Crédito:**
- Valor numérico (300-850)
- Clasificación (Excepcional, Muy Bueno, Bueno, Regular, Pobre)

**Probabilidades de Aprobación:**
- Tarjetas Premium (>5% APR)
- Tarjetas Estándar
- Tarjetas Básicas
- Préstamos Hipotecarios
- Préstamos Automotrices
- Préstamos Personales

**Métricas Clave:**
- Utilización de crédito
- Historial de pagos
- Antigüedad del crédito
- Mix de crédito
- Consultas recientes

**Recomendaciones:**
- Acciones de alta prioridad (rojo)
- Acciones de media prioridad (naranja)
- Acciones de baja prioridad (verde)

#### Paso 5: Exportar resultados

1. Haz clic en "Exportar"
2. Elige el formato (JSON o TXT)
3. Selecciona la ubicación
4. Guarda el archivo

## Casos de Uso Específicos

### Caso 1: Prepararse para solicitar una hipoteca

1. Carga tu reporte de crédito más reciente
2. Selecciona análisis tipo "Probabilidad de Aprobación"
3. Revisa específicamente:
   - Probabilidad de aprobación hipotecaria
   - Factores negativos que la afectan
   - Recomendaciones para mejorar

### Caso 2: Mejorar tu crédito en 6 meses

1. Carga tu reporte actual
2. Selecciona análisis tipo "Plan de Mejora"
3. Sigue el timeline mensual de acciones
4. Repite el análisis cada mes para ver progreso

### Caso 3: Entender por qué te rechazaron

1. Carga tu reporte de crédito
2. Usa análisis "Completo"
3. Revisa la sección de elementos negativos
4. Lee las recomendaciones priorizadas

### Caso 4: Comparar múltiples reportes

1. Analiza el primer reporte
2. Ve a "Historial"
3. Analiza el segundo reporte
4. Compara métricas y puntuaciones

## Interpretación de Resultados

### Puntajes de Crédito

| Puntaje | Clasificación | Significado |
|---------|---------------|-------------|
| 800-850 | Excepcional | Crédito excelente, mejores tasas |
| 740-799 | Muy Bueno | Excelente crédito, buenas tasas |
| 670-739 | Bueno | Crédito aceptable, tasas promedio |
| 580-669 | Regular | Crédito limitado, tasas altas |
| 300-579 | Pobre | Crédito muy limitado |

### Probabilidades de Aprobación

| Probabilidad | Significado |
|-------------|-------------|
| 80-100% | Muy alta - Aprobación casi segura |
| 60-79% | Alta - Buenas posibilidades |
| 40-59% | Media - Posible pero incierto |
| 20-39% | Baja - Poco probable |
| 0-19% | Muy baja - Improbable |

### Utilización de Crédito

| Utilización | Impacto |
|------------|---------|
| 0-10% | Excelente |
| 11-30% | Bueno |
| 31-50% | Aceptable |
| 51-75% | Negativo |
| 76-100% | Muy negativo |

## Funciones Avanzadas

### Historial de Análisis

- Accede a todos tus análisis previos
- Haz clic en cualquier análisis para verlo
- Compara resultados a lo largo del tiempo
- Exporta análisis históricos

### Edición de Texto

Si el OCR no fue perfecto:
1. En la vista previa, haz clic en "Editar texto"
2. Corrige manualmente el texto
3. Procede con el análisis

### Múltiples Modelos

Prueba diferentes modelos de IA:
- Claude 3.5 Sonnet: Mejor para análisis detallado
- GPT-4: Excelente razonamiento lógico
- Gemini Pro: Más económico
- Llama 3.1: Código abierto, gratuito

### Configuraciones Adicionales

**Auto-guardar análisis:**
- Guarda automáticamente cada análisis en el historial

**Notificaciones:**
- Recibe alertas cuando el análisis termine

## Solución de Problemas

### El texto extraído es ilegible

**Problema:** El OCR no funcionó correctamente

**Soluciones:**
1. Asegúrate de que la imagen tenga buena calidad
2. Prueba con el PDF original en lugar de una captura
3. Edita manualmente el texto extraído
4. Mejora la iluminación de la captura

### El análisis no tiene sentido

**Problema:** El modelo no entendió el reporte

**Soluciones:**
1. Verifica que cargaste un reporte de crédito real
2. Prueba con un modelo diferente
3. Asegúrate de que el texto extraído esté completo
4. Usa análisis "Completo" en lugar de "Rápido"

### Error de API

**Problema:** No se puede conectar con OpenRouter

**Soluciones:**
1. Verifica tu conexión a Internet
2. Confirma que tu API key es válida
3. Revisa que tengas créditos en OpenRouter
4. Prueba con "Probar Conexión" en Configuración

### La probabilidad parece incorrecta

**Importante:** Las probabilidades son estimaciones basadas en:
- Datos del reporte de crédito
- Patrones generales de aprobación
- Análisis del modelo de IA

NO son garantías. Factores adicionales que afectan aprobaciones:
- Ingreso actual
- Deuda-ingreso ratio
- Empleo estable
- Políticas específicas del prestamista

## Mejores Prácticas

### Para Mejores Resultados

1. **Usa reportes oficiales:**
   - De Experian, Equifax o TransUnion
   - No screenshots de apps móviles
   - PDFs completos, no parciales

2. **Análisis regular:**
   - Analiza cada 1-3 meses
   - Mantén historial para comparar progreso
   - Actúa sobre las recomendaciones

3. **Múltiples fuentes:**
   - Analiza reportes de las 3 bureaus
   - Pueden tener información diferente
   - Compara resultados

4. **Privacidad:**
   - Los datos se guardan solo en tu Mac
   - No se comparten con terceros
   - Puedes eliminar el historial cuando quieras

## Costos

### OpenRouter

La aplicación es gratuita, pero necesitas pagar por el uso de modelos:

**Costos aproximados por análisis:**
- Claude 3.5 Sonnet: $0.10 - $0.30
- GPT-4 Turbo: $0.15 - $0.40
- Gemini Pro: $0.05 - $0.15
- Llama 3.1: Gratis (en algunos proveedores)

Los costos varían según:
- Longitud del reporte
- Tipo de análisis
- Modelo seleccionado

## Preguntas Frecuentes

**¿Es seguro subir mi reporte de crédito?**
Sí. Todo se procesa localmente en tu Mac. Solo el texto se envía a OpenRouter para análisis (no se guarda allí).

**¿Puedo usar sin Internet?**
No. Se requiere conexión para comunicarse con los modelos de IA.

**¿Los resultados son 100% precisos?**
Son estimaciones basadas en IA. Úsalos como guía, no como garantía.

**¿Puedo analizar reportes de otros países?**
Sí, pero está optimizado para reportes de USA. Los resultados pueden variar.

**¿Cuántos análisis puedo hacer?**
Ilimitados, mientras tengas créditos en tu cuenta de OpenRouter.

## Soporte

Para ayuda adicional:
- Revisa el README.md
- Consulta INSTALL.md para problemas técnicos
- Abre un issue en GitHub
- Revisa la documentación de OpenRouter

---

¡Disfruta mejorando tu crédito con Credit Report Analyzer!
