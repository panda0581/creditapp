#!/bin/bash

# Credit Report Analyzer - Instalador Automático para macOS
# Este script instala todas las dependencias y configura la aplicación

set -e  # Detener si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Banner
clear
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          Credit Report Analyzer - Instalador                ║
║                                                              ║
║          Análisis de Reportes de Crédito con IA             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo ""

# Verificar que estamos en macOS
print_header "Verificando Sistema Operativo"
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "Este script es solo para macOS"
    print_info "Sistema detectado: $OSTYPE"
    exit 1
fi
print_success "macOS detectado"

# Verificar directorio
if [ ! -f "package.json" ]; then
    print_error "Este script debe ejecutarse desde el directorio del proyecto"
    print_info "Por favor, navega a la carpeta 'creditapp' primero"
    exit 1
fi

# Verificar Node.js
print_header "Verificando Node.js"
if ! command -v node &> /dev/null; then
    print_warning "Node.js no está instalado"
    print_info "Instalando Node.js con Homebrew..."

    # Verificar Homebrew
    if ! command -v brew &> /dev/null; then
        print_warning "Homebrew no está instalado"
        print_info "Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi

    brew install node
    print_success "Node.js instalado"
else
    NODE_VERSION=$(node --version)
    print_success "Node.js ya instalado: $NODE_VERSION"

    # Verificar versión mínima (v16)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 16 ]; then
        print_warning "Node.js $NODE_VERSION es muy antiguo"
        print_info "Se requiere Node.js v16 o superior"
        print_info "Actualizando Node.js..."
        brew upgrade node
    fi
fi

# Verificar npm
NPM_VERSION=$(npm --version)
print_success "npm versión: $NPM_VERSION"

# Limpiar instalación previa
print_header "Limpiando instalación previa (si existe)"
if [ -d "node_modules" ]; then
    print_info "Eliminando node_modules antiguo..."
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    print_info "Eliminando package-lock.json antiguo..."
    rm -f package-lock.json
fi
print_success "Limpieza completada"

# Instalar dependencias
print_header "Instalando Dependencias"
print_info "Este proceso puede tomar varios minutos..."
echo ""

# Instalar dependencias de sistema para canvas (si es necesario)
if ! brew list cairo &> /dev/null; then
    print_info "Instalando dependencias del sistema para canvas..."
    brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
fi

# Instalar dependencias de Node
npm install --verbose

if [ $? -eq 0 ]; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error al instalar dependencias"
    print_info "Intenta ejecutar: npm install --verbose"
    exit 1
fi

# Verificar instalación
print_header "Verificando Instalación"
node verify.js

if [ $? -ne 0 ]; then
    print_error "La verificación falló"
    exit 1
fi

# Crear archivo de configuración de ejemplo
print_header "Configurando Aplicación"
if [ ! -f ".env" ]; then
    print_info "Creando archivo .env desde .env.example..."
    cp .env.example .env
    print_warning "IMPORTANTE: Necesitas configurar tu API key"
    print_info "Edita el archivo .env y agrega tu OpenRouter API key"
else
    print_success "Archivo .env ya existe"
fi

# Instrucciones finales
print_header "¡Instalación Completada! 🎉"
echo ""
print_success "Credit Report Analyzer está listo para usar"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  📝 PRÓXIMOS PASOS:"
echo ""
echo "  1. Obtén tu API key de OpenRouter:"
echo "     ${BLUE}https://openrouter.ai/keys${NC}"
echo ""
echo "  2. Ejecuta la aplicación:"
echo "     ${GREEN}npm start${NC}"
echo ""
echo "     O en modo desarrollo:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  3. Configura tu API key en la aplicación:"
echo "     - Ve a 'Configuración'"
echo "     - Pega tu API key"
echo "     - Selecciona tu modelo preferido"
echo "     - ¡Listo!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  🔧 COMANDOS ÚTILES:"
echo ""
echo "  ${GREEN}npm start${NC}              - Ejecutar aplicación"
echo "  ${GREEN}npm run dev${NC}            - Ejecutar con DevTools"
echo "  ${GREEN}npm run build${NC}          - Compilar para macOS"
echo "  ${GREEN}npm run build:universal${NC} - Build universal (Intel + M1/M2/M3)"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
print_info "Para más información, consulta README.md y USAGE.md"
echo ""

# Preguntar si quiere ejecutar ahora
echo ""
read -p "¿Quieres ejecutar la aplicación ahora? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    print_info "Iniciando Credit Report Analyzer..."
    echo ""
    npm start
fi
