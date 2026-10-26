/** Dibuja el gráfico de comparativa. Solo se carga en RWD y AWD-desktop. */
(function () {
  var el = document.getElementById('compareChart');
  if (!el || !window.Chart || !window.CHART_DATA) return;

  new Chart(el, {
    type: 'bar',
    data: {
      labels: window.CHART_DATA.labels,
      datasets: [{ label: 'Índice de rendimiento', data: window.CHART_DATA.scores, backgroundColor: '#1f4fd8' }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } },
      scales: { x: { min: 0, max: 100 } }
    }
  });
})();
