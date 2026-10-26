/**
 * Catálogo con productos reales (fichas verificadas en octubre de 2026 en las páginas de
 * AMD, Intel, NVIDIA, Samsung, Kingston, Seasonic y distribuidores).
 * Precios en USD de REFERENCIA: cámbialos por los que consultes tú. Los marcados
 * "ESTIMADO" no pude confirmarlos.
 * "—" = dato no confirmado.
 */
const categories = {
  cpu: 'Procesador',
  gpu: 'Acelerador GPU',
  ram: 'Memoria RAM',
  ssd: 'Almacenamiento',
  net: 'Red',
  psu: 'Fuente de poder',
};

const products = [
  { id: 'p01', code: '9654', name: 'AMD EPYC 9654', cat: 'cpu', price: 8452, stock: 14, // precio de lista AMD (1 000 unidades)
    highlights: ['96 núcleos / 192 hilos', '2.4 GHz base · 3.7 GHz máx.', 'TDP 360 W · Socket SP5'],
    specs: { cap: '96 núcleos / 192 hilos', iface: 'PCIe 5.0 · 128 carriles', form: 'Socket SP5 (1P / 2P)', mem: '384 MB L3 · DDR5-4800 de 12 canales', freq: '2.4 GHz base · 3.7 GHz máx.', tdp: '360 W (cTDP 320–400 W)', warranty: '—', cert: 'AMD Infinity Guard' } },
  { id: 'p02', code: '6430', name: 'Intel Xeon Gold 6430', cat: 'cpu', price: 2383, stock: 0, // precio de lista Intel
    highlights: ['32 núcleos / 64 hilos', '2.1 GHz base · 3.4 GHz turbo', 'TDP 270 W · LGA 4677'],
    specs: { cap: '32 núcleos / 64 hilos', iface: 'Socket LGA 4677', form: 'Xeon Scalable de 4.ª gen.', mem: '60 MB caché · DDR5 de 8 canales', freq: '2.1 GHz base · 3.4 GHz turbo', tdp: '270 W', warranty: '—', cert: 'AMX · AVX-512' } },
  { id: 'p03', code: 'H100', name: 'NVIDIA H100 PCIe 80 GB', cat: 'gpu', price: 25000, stock: 5, // ESTIMADO: verifica
    highlights: ['80 GB HBM2e', '2 TB/s de ancho de banda', 'PCIe 5.0 x16 · hasta 350 W'],
    specs: { cap: '80 GB HBM2e', iface: 'PCIe 5.0 x16', form: 'Doble ranura, refrigeración pasiva', mem: '2 TB/s · ECC', freq: '14,592 núcleos CUDA · 456 Tensor', tdp: 'hasta 350 W', warranty: '—', cert: 'MIG (hasta 7 instancias) · NVLink 600 GB/s' } },
  { id: 'p04', code: 'L40S', name: 'NVIDIA L40S 48 GB', cat: 'gpu', price: 8000, stock: 11, // ESTIMADO: verifica
    highlights: ['48 GB GDDR6 con ECC', '864 GB/s de ancho de banda', 'PCIe 4.0 x16 · 350 W'],
    specs: { cap: '48 GB GDDR6 con ECC', iface: 'PCIe 4.0 x16', form: 'Doble ranura, refrigeración pasiva', mem: '864 GB/s · bus de 384 bits', freq: '18,176 núcleos CUDA', tdp: '350 W', warranty: '—', cert: 'Arquitectura Ada Lovelace · vGPU' } },
  { id: 'p05', code: '64GB', name: 'Kingston Server Premier 64 GB DDR5-4800', cat: 'ram', price: 900, stock: 60, // referencia de distribuidor (varía mucho)
    highlights: ['64 GB DDR5 RDIMM', '4800 MT/s · CL40 · ECC', 'Doble rango 2Rx4 · 1.1 V'],
    specs: { cap: '64 GB', iface: 'DDR5 RDIMM', form: 'DIMM 288 pines', mem: 'ECC registrada · 2Rx4', freq: 'DDR5-4800 · CL40', tdp: '—', warranty: 'De por vida (limitada)', cert: 'ECC on-die · 1.1 V' } },
  { id: 'p06', code: '32GB', name: 'Kingston Server Premier 32 GB DDR5-4800', cat: 'ram', price: 500, stock: 28, // referencia de distribuidor (varía mucho)
    highlights: ['32 GB DDR5 RDIMM', '4800 MT/s · CL40 · ECC', 'Doble rango 2Rx8 · 1.1 V'],
    specs: { cap: '32 GB', iface: 'DDR5 RDIMM', form: 'DIMM 288 pines', mem: 'ECC registrada · 2Rx8', freq: 'DDR5-4800 · CL40', tdp: '—', warranty: 'De por vida (limitada)', cert: 'ECC on-die · 1.1 V' } },
  { id: 'p07', code: '7.68T', name: 'Samsung PM9A3 7.68 TB U.2', cat: 'ssd', price: 1100, stock: 17, // ESTIMADO: verifica
    highlights: ['7.68 TB NVMe', '6.7 GB/s lectura · 4.0 GB/s escritura', 'U.2 · 1 DWPD'],
    specs: { cap: '7.68 TB', iface: 'PCIe 4.0 x4 · NVMe', form: 'U.2 2.5" (7 mm)', mem: 'V-NAND TLC', freq: '6.7 / 4.0 GB/s · 1.1 M IOPS lectura', tdp: '11 W lectura / 13.5 W escritura', warranty: '5 años', cert: 'Protección ante cortes de energía · 1 DWPD' } },
  { id: 'p08', code: '3.84T', name: 'Samsung PM9A3 3.84 TB U.2', cat: 'ssd', price: 600, stock: 33, // ESTIMADO: verifica
    highlights: ['3.84 TB NVMe', '6.9 GB/s lectura · 4.1 GB/s escritura', 'U.2 · 1 DWPD'],
    specs: { cap: '3.84 TB', iface: 'PCIe 4.0 x4 · NVMe', form: 'U.2 2.5" (7 mm)', mem: 'V-NAND TLC', freq: '6.9 / 4.1 GB/s · 1.0 M IOPS lectura', tdp: '11 W lectura / 13.5 W escritura', warranty: '5 años', cert: 'Protección ante cortes de energía · 1 DWPD' } },
  { id: 'p09', code: '100G', name: 'Intel Ethernet E810-CQDA2', cat: 'net', price: 500, stock: 9, // precio sugerido ≈ 500 USD
    highlights: ['2 puertos QSFP28 (100 GbE)', 'Compatible con 10/25/100 GbE', 'PCIe 4.0 x16 · perfil bajo'],
    specs: { cap: '2 × 100 GbE (QSFP28)', iface: 'PCIe 4.0 x16', form: 'Perfil bajo', mem: 'Compatible con 10/25/100 GbE', freq: '—', tdp: '—', warranty: '—', cert: '—' } },
  { id: 'p10', code: '25G', name: 'Intel Ethernet E810-XXVDA2', cat: 'net', price: 250, stock: 41, // ESTIMADO: verifica
    highlights: ['2 puertos SFP28 (25 GbE)', 'Compatible con 10/25 GbE', 'PCIe 4.0 x8 · perfil bajo'],
    specs: { cap: '2 × 25 GbE (SFP28)', iface: 'PCIe 4.0 x8', form: 'Perfil bajo', mem: 'Compatible con 10/25 GbE', freq: '—', tdp: '—', warranty: '—', cert: '—' } },
  { id: 'p11', code: 'TX-1600', name: 'Seasonic PRIME TX-1600', cat: 'psu', price: 610, stock: 22, // precio de lanzamiento
    highlights: ['1600 W · 80 PLUS Titanium', 'ATX 3.0 · 2 × 12VHPWR', 'Totalmente modular · 12 años'],
    specs: { cap: '1600 W', iface: 'ATX 3.0 · 2 × 12VHPWR', form: 'ATX · 210 × 150 × 86 mm', mem: 'Totalmente modular', freq: '80 PLUS Titanium · ventilador 135 mm', tdp: '—', warranty: '12 años', cert: 'Cybenetics Titanium · Lambda A' } },
  { id: 'p12', code: 'PX-1600', name: 'Seasonic PRIME PX-1600', cat: 'psu', price: 510, stock: 35, // precio de lanzamiento
    highlights: ['1600 W · 80 PLUS Platinum', 'ATX 3.0 · 2 × 12VHPWR', 'Totalmente modular · 12 años'],
    specs: { cap: '1600 W', iface: 'ATX 3.0 · 2 × 12VHPWR', form: 'ATX', mem: 'Totalmente modular', freq: '80 PLUS Platinum', tdp: '—', warranty: '12 años', cert: '—' } },
];

module.exports = { products, categories };