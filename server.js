/**
 * Servidor del laboratorio RWD vs AWD.
 *
 *   /            -> índice con enlaces a las dos versiones
 *   /responsive  -> Versión A (RWD): MISMO HTML para todos los clientes
 *   /adaptive    -> Versión B (AWD): el servidor elige plantilla según el dispositivo
 *   /whoami      -> JSON con lo que el servidor detecta (útil para comprobar)
 */
const path = require('path');
const express = require('express');
const compression = require('compression');
const { products, categories } = require('./data/products');
const { detectDevice } = require('./middleware/detectDevice');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

// gzip para TODAS las respuestas de texto (HTML/CSS/JS): se mide en condiciones reales.
app.use(compression());

// Archivos estáticos: css, js, img.
app.use(express.static(path.join(__dirname, 'public')));
// Chart.js se sirve desde node_modules (instalado con npm install).
app.use('/vendor/chart', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));

app.get('/', (req, res) => res.render('index'));

// ---------- Versión A: RWD ----------
// Una sola plantilla, sin mirar quién pregunta. Adaptación 100 % en el navegador.
app.get('/responsive', (req, res) => {
  res.render('responsive', { products, categories });
});

// ---------- Versión B: AWD ----------
// El servidor inspecciona cabeceras y renderiza una plantilla distinta.
app.get('/adaptive', detectDevice, (req, res) => {
  const view = req.device === 'mobile' ? 'mobile' : 'desktop';
  res.render(view, { products, categories });
});

app.get('/whoami', detectDevice, (req, res) => {
  res.json({
    device: req.device,
    userAgent: req.get('User-Agent'),
    secChUaMobile: req.get('Sec-CH-UA-Mobile') || null,
  });
});

app.listen(PORT, () => {
  console.log(`Laboratorio RWD vs AWD en http://localhost:${PORT}`);
});
