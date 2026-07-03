const PALETA_PADRAO = ['#7C9885', '#C97B84', '#E8A33D', '#5B3A56', '#6B8CAE'];

export function hexParaRgba(hex, alpha) {
  const limpo = (hex || '').replace('#', '');
  const normalizado = limpo.length === 3
    ? limpo.split('').map((c) => c + c).join('')
    : limpo;
  const bigint = parseInt(normalizado, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Aceita tanto um hex salvo (#RRGGBB) quanto valores antigos (sage, rose...) por compatibilidade
const CHAVES_ANTIGAS = {
  sage: '#7C9885',
  rose: '#C97B84',
  marigold: '#E8A33D',
  plum: '#5B3A56',
  azul: '#6B8CAE',
};

export function resolverCorHex(corSalva, index) {
  if (corSalva && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(corSalva)) {
    return corSalva;
  }
  if (corSalva && CHAVES_ANTIGAS[corSalva]) {
    return CHAVES_ANTIGAS[corSalva];
  }
  return PALETA_PADRAO[index % PALETA_PADRAO.length];
}
