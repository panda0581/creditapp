# Guía de Instalación - Credit Report Analyzer

## Instalación desde Código Fuente

### Prerrequisitos

1. **Node.js** (v16 o superior)
   ```bash
   # Verificar instalación
   node --version
   npm --version
   ```

   Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

2. **Git**
   ```bash
   # Verificar instalación
   git --version
   ```

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/panda0581/creditapp.git
   cd creditapp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

   Esto instalará todas las dependencias necesarias incluyendo:
   - Electron
   - Servicios de PDF y OCR
   - Bibliotecas de UI
   - Cliente de OpenRouter

3. **Configurar variables de entorno (opcional)**

   Puedes crear un archivo `.env` para configuración adicional:
   ```bash
   # .env
   OPENROUTER_API_KEY=tu_api_key_aqui
   ```

### Ejecutar en Modo Desarrollo

```bash
npm run dev
```

Esto abrirá la aplicación con las herramientas de desarrollador activadas.

### Compilar para Producción

#### Opción 1: Build Universal (Intel + Apple Silicon)

```bash
npm run build:universal
```

Esto creará un instalador que funciona tanto en Macs Intel como en Apple Silicon (M1/M2/M3).

#### Opción 2: Build para arquitectura específica

```bash
# Solo para Apple Silicon (M1/M2/M3)
npm run build -- --arch arm64

# Solo para Intel
npm run build -- --arch x64
```

### Ubicación de la Aplicación Compilada

Después de compilar, encontrarás la aplicación en:

```
creditapp/
└── dist/
    ├── Credit Report Analyzer-1.0.0.dmg      # Instalador DMG
    ├── Credit Report Analyzer-1.0.0-mac.zip  # Aplicación comprimida
    └── mac/                                   # Archivos de la app
```

## Instalación desde DMG

1. **Descargar** el archivo `.dmg` desde la página de Releases

2. **Abrir** el archivo DMG haciendo doble clic

3. **Arrastrar** la aplicación "Credit Report Analyzer" a la carpeta "Applications"

4. **Primera ejecución**:
   - Abre la carpeta Applications
   - Haz clic derecho en "Credit Report Analyzer"
   - Selecciona "Abrir"
   - Confirma que deseas abrir la aplicación

   Nota: En macOS, las aplicaciones descargadas de Internet requieren confirmación la primera vez.

## Configuración Post-Instalación

### 1. Obtener API Key de OpenRouter

1. Ve a https://openrouter.ai
2. Crea una cuenta o inicia sesión
3. Ve a la sección "Keys"
4. Crea una nueva API key
5. Copia la key (comienza con `sk-or-...`)

### 2. Configurar la Aplicación

1. Abre Credit Report Analyzer
2. Ve a la pestaña "Configuración"
3. Pega tu API key
4. Selecciona tu modelo predeterminado
5. Haz clic en "Guardar Configuración"
6. (Opcional) Haz clic en "Probar Conexión" para verificar

## Solución de Problemas de Instalación

### Error: "La aplicación no se puede abrir porque proviene de un desarrollador no identificado"

**Solución**:
1. Ve a Preferencias del Sistema > Seguridad y Privacidad
2. En la pestaña "General", haz clic en "Abrir de todas formas"
3. Confirma que deseas abrir la aplicación

**O usa este comando en Terminal**:
```bash
xattr -cr /Applications/Credit\ Report\ Analyzer.app
```

### Error durante `npm install`

**Problema**: Fallo al instalar dependencias nativas (canvas, etc.)

**Solución**:
1. Instala las herramientas de desarrollo de Xcode:
   ```bash
   xcode-select --install
   ```

2. Si tienes problemas con canvas:
   ```bash
   brew install pkg-config cairo pango libpng jpeg giflib librsvg
   ```

### Error: "Cannot find module 'electron'"

**Solución**:
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### La aplicación se cierra inmediatamente

**Solución**:
1. Ejecuta desde Terminal para ver errores:
   ```bash
   /Applications/Credit\ Report\ Analyzer.app/Contents/MacOS/Credit\ Report\ Analyzer
   ```

2. Verifica que tienes las versiones correctas:
   ```bash
   node --version  # Debe ser v16+
   npm --version   # Debe ser v7+
   ```

### Error de permisos al compilar

**Solución**:
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```

## Desinstalación

Para desinstalar completamente la aplicación:

1. **Eliminar la aplicación**:
   ```bash
   rm -rf /Applications/Credit\ Report\ Analyzer.app
   ```

2. **Eliminar datos de usuario** (opcional):
   ```bash
   # Configuración y cache
   rm -rf ~/Library/Application\ Support/credit-report-analyzer

   # Preferencias
   rm -rf ~/Library/Preferences/com.creditanalyzer.app.plist

   # Logs
   rm -rf ~/Library/Logs/credit-report-analyzer
   ```

## Actualización

### Actualizar desde Código Fuente

```bash
cd creditapp
git pull origin main
npm install
npm run build
```

### Actualizar desde DMG

1. Descarga la nueva versión
2. Arrastra a Applications (reemplazará la versión anterior)
3. Tus configuraciones y datos se preservarán automáticamente

## Desarrollo Avanzado

### Debugging

```bash
# Ejecutar con logs detallados
DEBUG=* npm run dev

# Ejecutar con inspector de Node
npm run dev -- --inspect
```

### Limpiar builds anteriores

```bash
rm -rf dist/
npm run build
```

### Crear build sin firmar (desarrollo)

```bash
npm run build -- --publish=never
```

## Requisitos del Sistema

### Mínimos
- macOS 10.13 (High Sierra) o superior
- 4 GB RAM
- 500 MB de espacio en disco
- Conexión a Internet

### Recomendados
- macOS 11 (Big Sur) o superior
- 8 GB RAM
- 1 GB de espacio en disco
- Conexión a Internet estable

## Soporte

Si encuentras problemas durante la instalación:

1. Revisa esta guía completa
2. Busca en los [Issues de GitHub](https://github.com/panda0581/creditapp/issues)
3. Crea un nuevo issue con:
   - Versión de macOS
   - Versión de Node.js
   - Logs de error completos
   - Pasos para reproducir

## Recursos Adicionales

- [Documentación de Electron](https://www.electronjs.org/docs)
- [Documentación de OpenRouter](https://openrouter.ai/docs)
- [FAQ del proyecto](https://github.com/panda0581/creditapp/wiki/FAQ)

---

¡Gracias por usar Credit Report Analyzer!
