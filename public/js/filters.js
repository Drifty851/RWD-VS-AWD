/**
 * Filtros del catálogo + panel de filtros colapsable (hoja inferior en pantallas pequeñas).
 * Sin librerías. Funciona igual en RWD y en las dos vistas de AWD:
 * si un elemento no existe en el DOM (p. ej. el botón "Filtros" en desktop), se ignora.
 */
(function () {
  var grid = document.getElementById('grid');
  var form = document.getElementById('filters');
  if (!grid || !form) return;

  var cards = [].slice.call(grid.querySelectorAll('.card'));
  var price = document.getElementById('maxPrice');
  var priceOut = document.getElementById('priceOut');
  var stock = document.getElementById('inStock');
  var count = document.getElementById('resultCount');

  function apply() {
    var cats = [].slice.call(form.querySelectorAll('input[name=cat]:checked'))
      .map(function (i) { return i.value; });
    var max = Number(price.value);
    var visible = 0;

    priceOut.textContent = '$' + max.toLocaleString('en-US');
    cards.forEach(function (c) {
      var ok = (!cats.length || cats.indexOf(c.dataset.cat) > -1) &&
               Number(c.dataset.price) <= max &&
               (!stock.checked || Number(c.dataset.stock) > 0);
      c.hidden = !ok;
      if (ok) visible++;
    });
    count.textContent = visible + (visible === 1 ? ' producto' : ' productos');

        // Resalta en el navbar la categoría activa ("Todos" si no hay una sola)
    var active = cats.length === 1 ? cats[0] : 'all';
    [].forEach.call(document.querySelectorAll('#nav a'), function (a) {
      if (a.dataset.cat === active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  // ---- Navbar: filtra por categoría y baja a la cuadrícula ----
  var nav = document.getElementById('nav');
  if (nav) {
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a[data-cat]');
      if (!link) return;
      e.preventDefault();
      [].forEach.call(form.querySelectorAll('input[name=cat]'), function (box) {
        box.checked = link.dataset.cat !== 'all' && box.value === link.dataset.cat;
      });
      apply();
      var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      grid.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    });
  }

  form.addEventListener('input', apply);
  form.addEventListener('reset', function () { setTimeout(apply, 0); });
  apply();

  // ---- Panel colapsable (solo existe en RWD y AWD-móvil) ----
  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('scrim');
  var toggle = document.getElementById('filterToggle');
  var closeBtn = document.getElementById('sheetClose');
  if (!toggle || !scrim) return;

  function setOpen(open) {
    sidebar.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () { setOpen(!sidebar.classList.contains('open')); });
  scrim.addEventListener('click', function () { setOpen(false); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
})();
