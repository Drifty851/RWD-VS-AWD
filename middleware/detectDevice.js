/**
 * Middleware de detección de contexto (núcleo del AWD).
 *
 * Estrategia, en orden de prioridad:
 *  1. Client Hint  `Sec-CH-UA-Mobile`  (?1 = móvil, ?0 = no móvil).
 *     Lo envían por defecto los navegadores basados en Chromium (Chrome, Edge...).
 *  2. Cabecera `User-Agent` + expresión regular (Safari y Firefox no envían el hint).
 *
 * Tabletas (iPad, Android sin "Mobile"): se tratan como "desktop" porque tienen
 * pantalla grande. Es una decisión de negocio y uno de los puntos débiles del AWD:
 * hay que mantener esta lista de reglas.
 *
 * Resultado:
 *  - req.device = 'mobile' | 'desktop'
 *  - Cabecera de depuración  X-Device-Detected  (para evidenciar en DevTools)
 *  - Cabecera  Vary: User-Agent, Sec-CH-UA-Mobile
 *    -> IMPRESCINDIBLE: le dice a la CDN/proxy que la misma URL produce respuestas
 *       distintas según esas cabeceras. Sin ella, la CDN podría servir la versión
 *       móvil a un usuario desktop. Con ella, la caché se fragmenta (más costo/misses).
 */
const MOBILE_UA = /Mobi|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i;

function detectDevice(req, res, next) {
  const hint = req.get('Sec-CH-UA-Mobile');
  const ua = req.get('User-Agent') || '';

  let device;
  let via;
  if (hint) {
    device = hint.includes('?1') ? 'mobile' : 'desktop';
    via = 'client-hint';
  } else {
    device = MOBILE_UA.test(ua) ? 'mobile' : 'desktop';
    via = 'user-agent';
  }

  req.device = device;
  res.set('X-Device-Detected', `${device}; via=${via}`);
  res.vary('User-Agent');
  res.vary('Sec-CH-UA-Mobile');
  next();
}

module.exports = { detectDevice };
