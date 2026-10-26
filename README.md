# RWD vs. AWD

Catálogo de hardware de servidor con **Node.js + Express + EJS**:

| Ruta | Arquitectura | Qué hace el servidor |
|---|---|---|
| `/responsive` | **RWD** (Responsive Web Design) | Envía **el mismo HTML** a todos. El navegador adapta con CSS Grid/Flexbox, media queries y `<picture>/srcset`. |
| `/adaptive` | **AWD** (Adaptive Web Design) | **Detecta el dispositivo** (`Sec-CH-UA-Mobile` / `User-Agent`) y renderiza `mobile.ejs` o `desktop.ejs`. |
| `/whoami` | — | Muestra qué detecta el servidor de tu navegador (útil para comprobar). |

## Requisitos
- Node.js 18 o superior (`node -v`)

## Instalación y arranque
```bash
npm install
npm start
# http://localhost:3000
```
Las imágenes ya vienen generadas en `public/img`. Para regenerarlas (opcional): `pip install pillow numpy && python3 scripts/generate_images.py`.

## Estructura
```
server.js                  Rutas y arranque de Express
middleware/detectDevice.js Detección de dispositivo por cabeceras HTTP (+ cabecera Vary)
data/products.js           Los 12 productos y sus fichas técnicas
views/responsive.ejs       RWD: un solo HTML para todos
views/desktop.ejs          AWD: HTML de escritorio (gráfico + tabla completa)
views/mobile.ejs           AWD: HTML móvil (SIN gráfico, SIN tabla, SIN Chart.js)
views/partials/            Fragmentos reutilizados (header, tarjeta, filtros, gráfico, tabla)
public/css/responsive.css  RWD: mobile-first + media queries (640 px / 1024 px) 
public/css/awd-*.css       AWD: una hoja por dispositivo, sin media queries de layout
public/js/                 filters.js (filtros + panel colapsable), chart-init.js (Chart.js)
```

## Qué diferencia a cada versión (lo que se mide)
| Elemento | RWD (`/responsive`) | AWD móvil (`/adaptive`) |
|---|---|---|
| HTML | Incluye tabla completa y gráfico (en móvil se ocultan con `display:none`, pero **viajan igual**) | No los incluye |
| JavaScript | `chart.umd.js` + `filters.js` + `chart-init.js` | Solo `filters.js` |
| CSS | 1 hoja con las reglas de móvil, tablet y desktop | 1 hoja solo con reglas móviles |
| Imágenes | `<picture>` con AVIF/WebP/JPG y `srcset` 400/800/1600 w: elige el navegador | `<img>` WebP de 400 px: elige el servidor |

## Cómo comprobar la detección (tamaño del HTML)
```bash
UA_MOVIL="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
UA_DESK="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

# Bytes transferidos (comprimidos con gzip)
curl -s -o /dev/null -w "RWD  móvil : %{size_download} B\n" -H "Accept-Encoding: gzip" -H "User-Agent: $UA_MOVIL" localhost:3000/responsive
curl -s -o /dev/null -w "AWD  móvil : %{size_download} B\n" -H "Accept-Encoding: gzip" -H "User-Agent: $UA_MOVIL" localhost:3000/adaptive
curl -s -o /dev/null -w "AWD desktop: %{size_download} B\n" -H "Accept-Encoding: gzip" -H "User-Agent: $UA_DESK"  localhost:3000/adaptive

# Ver la cabecera de depuración y el Vary
curl -sI -H "User-Agent: $UA_MOVIL" localhost:3000/adaptive | grep -iE "x-device|vary"
```
(Quita `-H "Accept-Encoding: gzip"` para ver el tamaño sin comprimir.)

## Protocolo de medición (Chrome DevTools)
1. Ventana de **incógnito** (sin extensiones que alteren la red).
2. `F12` → icono de dispositivo → **Dimensions: iPhone 12 Pro (390 × 844)** (así el servidor ve un móvil real).
3. Pestaña **Network**: marcar **Disable cache** y elegir **Fast 4G**.
4. Pestaña **Performance** → ⚙ → **CPU: 4× slowdown**.
5. Recargar con `Ctrl+Shift+R`. En la barra inferior de Network anotar: *requests*, *transferred* y *resources*. Clic en la fila del documento para ver el tamaño transferido del HTML.
6. Pestaña **Lighthouse** → Mode *Navigation*, Device *Mobile*, categoría *Performance* → anotar **LCP** y **CLS**.
7. Repetir **3 veces** cada ruta y usar la **mediana**. Mismas condiciones para ambas rutas.
8. Capturar Network y Lighthouse de cada ruta para el reporte.

**Delta (%)** = (AWD − RWD) / RWD × 100
