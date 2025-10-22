# 📦 Instalación Súper Simple en tu Mac

## Lo que necesitas saber

Esta aplicación analiza reportes de crédito usando inteligencia artificial.
Es **GRATIS**, solo pagas ~$0.10-$0.30 por cada análisis a OpenRouter.

---

## ⚡ Instalación en 3 Pasos

### 1️⃣ Abre Terminal en tu Mac

**Opción A - Finder:**
- Ve a `Aplicaciones` > `Utilidades` > `Terminal`

**Opción B - Spotlight:**
- Presiona `Cmd + Espacio`
- Escribe "Terminal"
- Presiona Enter

---

### 2️⃣ Copia y pega estos comandos

**Copia TODO de una vez** y pégalo en Terminal:

```bash
# Ir a tu carpeta de Documentos
cd ~/Documents

# Descargar el proyecto
git clone https://github.com/panda0581/creditapp.git

# Entrar a la carpeta
cd creditapp

# Dar permiso al instalador
chmod +x install-mac.sh

# Ejecutar instalador (hace todo automáticamente)
./install-mac.sh
```

Presiona Enter y espera ~5-10 minutos.

**El instalador hará TODO por ti:**
- ✅ Instalará Node.js (si no lo tienes)
- ✅ Instalará todas las dependencias
- ✅ Verificará que funcione
- ✅ Te preguntará si quieres ejecutar la app

---

### 3️⃣ Configura tu API Key

Cuando la app abra:

1. **Obtén tu API key (GRATIS):**
   - Abre: https://openrouter.ai/keys
   - Crea cuenta con tu email
   - Haz clic en "Create Key"
   - Copia la key (empieza con `sk-or-...`)

2. **Configura en la app:**
   - Haz clic en "Configuración" (engranaje abajo)
   - Pega tu API key
   - Selecciona modelo (recomiendo "Claude 3.5 Sonnet")
   - Haz clic en "Guardar Configuración"

**¡LISTO!** Ya puedes analizar reportes de crédito 🎉

---

## 🎯 Cómo Usar

### Análisis Súper Fácil

1. **Arrastra tu PDF** a la ventana
   - O una captura de pantalla de tu reporte

2. **Espera** ~10-30 segundos mientras procesa

3. **Elige qué quieres analizar:**
   - "Completo" = Todo el análisis detallado
   - "Rápido" = Solo lo importante
   - "Probabilidad de Aprobación" = ¿Me aprobarán un préstamo?
   - "Plan de Mejora" = ¿Cómo mejoro mi crédito?

4. **Haz clic en "Analizar Reporte"**

5. **Ve los resultados:**
   - Tu puntaje de crédito
   - Probabilidad de aprobación para tarjetas/préstamos
   - Qué está bien ✅
   - Qué está mal ❌
   - Qué hacer para mejorar 📈

---

## 🆘 Si Algo Sale Mal

### No tengo git
```bash
# Instalar Homebrew primero
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Luego instalar git
brew install git
```

### Error: "command not found"
```bash
# Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Luego ejecuta el instalador de nuevo
./install-mac.sh
```

### La app no abre
1. Ve a **Preferencias del Sistema**
2. **Seguridad y Privacidad**
3. Abajo verás un mensaje sobre Credit Report Analyzer
4. Haz clic en **"Abrir de todas formas"**

### Necesito ayuda
Abre un issue aquí: https://github.com/panda0581/creditapp/issues

---

## 💰 ¿Cuánto Cuesta?

| Lo que pagas | Precio |
|--------------|--------|
| **La aplicación** | GRATIS |
| **API Key de OpenRouter** | GRATIS registrarse |
| **Por cada análisis** | $0.10 - $0.30 |

**Ejemplo:** Con $5 en OpenRouter puedes hacer ~20-50 análisis.

---

## 🔒 ¿Es Seguro?

- ✅ Todo se guarda en TU Mac (no en la nube)
- ✅ Tu API key se guarda encriptada
- ✅ Solo el texto del reporte va a OpenRouter para análisis
- ✅ Código abierto - puedes revisarlo todo

---

## 🚀 Ejecutar en el Futuro

Cada vez que quieras usar la app:

**Opción 1 - Desde Terminal:**
```bash
cd ~/Documents/creditapp
npm start
```

**Opción 2 - Crear un alias (más fácil):**
```bash
# Agregar a tu .zshrc o .bash_profile:
echo 'alias creditapp="cd ~/Documents/creditapp && npm start"' >> ~/.zshrc

# Luego solo escribe en Terminal:
creditapp
```

**Opción 3 - Compilar app real:**
```bash
cd ~/Documents/creditapp
npm run build

# La app estará en dist/
# Arrástrala a Aplicaciones
```

---

## 📹 Video Tutorial

*(Si alguien crea uno, lo agregaremos aquí)*

---

## ❓ Preguntas Frecuentes

**P: ¿Funciona en MacBook M1/M2/M3?**
R: ¡Sí! Funciona en Intel y Apple Silicon.

**P: ¿Necesito saber programar?**
R: No, solo copia y pega los comandos.

**P: ¿Puedo usar sin Internet?**
R: No, necesita Internet para conectarse a los modelos de IA.

**P: ¿Los análisis son precisos?**
R: Son estimaciones muy buenas, pero no garantías. Úsalos como guía.

**P: ¿Funciona con reportes de México/otro país?**
R: Está optimizado para USA, pero puede analizar otros países.

**P: ¿Guarda mi información?**
R: Solo localmente en tu Mac. Nada se envía a ningún servidor (excepto el análisis a OpenRouter).

---

## 🎓 Aprende Más

- [README.md](README.md) - Documentación completa
- [USAGE.md](USAGE.md) - Guía detallada de uso
- [INSTALL.md](INSTALL.md) - Instalación avanzada

---

¡Cualquier duda, pregunta! 😊
