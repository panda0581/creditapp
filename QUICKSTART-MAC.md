# 🚀 Instalación Rápida en macOS

## Opción 1: Instalación Automática (Recomendado)

### Paso a Paso

1. **Abre Terminal** (Aplicaciones > Utilidades > Terminal)

2. **Clona el repositorio:**
   ```bash
   git clone https://github.com/panda0581/creditapp.git
   cd creditapp
   ```

3. **Ejecuta el instalador automático:**
   ```bash
   chmod +x install-mac.sh
   ./install-mac.sh
   ```

   El instalador hará todo automáticamente:
   - ✅ Verificará Node.js (lo instalará si no lo tienes)
   - ✅ Instalará todas las dependencias
   - ✅ Verificará que todo funcione
   - ✅ Te preguntará si quieres ejecutar la app

4. **Obtén tu API key:**
   - Ve a: https://openrouter.ai/keys
   - Crea una cuenta (si no tienes)
   - Genera una nueva API key
   - Cópiala (empieza con `sk-or-...`)

5. **Configura la app:**
   - Abre Credit Report Analyzer
   - Ve a "Configuración"
   - Pega tu API key
   - Guarda

¡Listo! Ya puedes analizar reportes de crédito.

---

## Opción 2: Instalación Manual

### Prerrequisitos

Necesitas tener instalado:
- **Homebrew** (gestor de paquetes para Mac)
- **Node.js** v16 o superior

### Instalar Homebrew (si no lo tienes)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Instalar Node.js

```bash
brew install node
```

### Instalar la Aplicación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/panda0581/creditapp.git
   cd creditapp
   ```

2. **Instalar dependencias del sistema:**
   ```bash
   brew install pkg-config cairo pango libpng jpeg giflib librsvg
   ```

3. **Instalar dependencias de Node:**
   ```bash
   npm install
   ```

4. **Verificar instalación:**
   ```bash
   node verify.js
   ```

   Deberías ver: `✅ ¡Verificación completada exitosamente!`

5. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

---

## Opción 3: Descargar App Compilada (Próximamente)

Una vez que compile la aplicación, podrás descargar el archivo `.dmg`:

1. Descarga `Credit-Report-Analyzer-1.0.0.dmg`
2. Abre el archivo
3. Arrastra la app a "Aplicaciones"
4. Abre desde Aplicaciones
5. Configura tu API key

---

## Comandos Útiles

Una vez instalado, puedes usar:

```bash
# Ejecutar aplicación
npm start

# Ejecutar en modo desarrollo (con DevTools)
npm run dev

# Compilar para distribución
npm run build

# Compilar versión universal (Intel + Apple Silicon)
npm run build:universal
```

---

## Solución Rápida de Problemas

### "Command not found: node"
```bash
brew install node
```

### "Cannot find module 'electron'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error con canvas/cairo
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm rebuild canvas
```

### La app no abre (primera vez)
1. Ve a: Preferencias del Sistema > Seguridad y Privacidad
2. Haz clic en "Abrir de todas formas"

O en Terminal:
```bash
xattr -cr /Applications/Credit\ Report\ Analyzer.app
```

---

## Estructura de Archivos Después de Instalar

```
creditapp/
├── node_modules/          # Dependencias (creado por npm install)
├── src/                   # Código fuente
├── dist/                  # Apps compiladas (después de build)
├── package.json           # Configuración
├── README.md             # Documentación
├── INSTALL.md            # Guía detallada
├── USAGE.md              # Guía de uso
└── install-mac.sh        # Instalador automático
```

---

## Primera Ejecución

Cuando ejecutes por primera vez:

1. **Se abrirá la aplicación** con interfaz oscura moderna
2. **Ve a "Configuración"** (ícono de engranaje en el sidebar)
3. **Ingresa tu OpenRouter API key:**
   - Pega la key que copiaste de https://openrouter.ai/keys
4. **Selecciona un modelo:**
   - Claude 3.5 Sonnet (recomendado para análisis detallado)
   - GPT-4 Turbo (excelente razonamiento)
   - Gemini Pro (más económico)
5. **Haz clic en "Guardar Configuración"**
6. **Opcional:** Haz clic en "Probar Conexión" para verificar

¡Ya estás listo para analizar reportes de crédito!

---

## Usar la Aplicación

### Análisis Básico

1. **Cargar reporte:**
   - Arrastra tu PDF o imagen a la app
   - O haz clic y selecciona el archivo

2. **Esperar procesamiento:**
   - PDF: ~5 segundos
   - Imagen con OCR: ~15-30 segundos

3. **Seleccionar tipo de análisis:**
   - **Completo:** Análisis exhaustivo (~60 seg)
   - **Rápido:** Resumen ejecutivo (~30 seg)
   - **Probabilidad de Aprobación:** Enfocado en aprobaciones (~45 seg)
   - **Plan de Mejora:** Estrategias de mejoramiento (~60 seg)

4. **Ver resultados:**
   - Puntaje de crédito
   - Probabilidades de aprobación
   - Métricas clave
   - Recomendaciones

5. **Exportar (opcional):**
   - Haz clic en "Exportar"
   - Elige formato (JSON o TXT)
   - Guarda donde quieras

---

## Costos

La aplicación es **GRATIS**, pero pagas por el uso de IA:

| Modelo | Costo por Análisis |
|--------|-------------------|
| Claude 3.5 Sonnet | $0.10 - $0.30 |
| GPT-4 Turbo | $0.15 - $0.40 |
| Gemini Pro | $0.05 - $0.15 |
| Llama 3.1 | Gratis* |

*Algunos proveedores ofrecen Llama gratis

---

## Soporte

**¿Problemas?**
- Consulta [INSTALL.md](INSTALL.md) para guía detallada
- Lee [USAGE.md](USAGE.md) para tutoriales
- Abre un issue en GitHub

**¿Preguntas sobre uso?**
- Lee la documentación completa en el README
- Revisa la sección de FAQ en USAGE.md

---

## Actualizar la Aplicación

```bash
cd creditapp
git pull origin main
npm install
npm start
```

---

## Desinstalar

```bash
# Eliminar aplicación
rm -rf /Applications/Credit\ Report\ Analyzer.app

# Eliminar código fuente
rm -rf ~/path/to/creditapp

# Eliminar datos de usuario (opcional)
rm -rf ~/Library/Application\ Support/credit-report-analyzer
```

---

¡Disfruta analizando tus reportes de crédito! 🎉
