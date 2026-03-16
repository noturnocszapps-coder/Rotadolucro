export const PLATFORMS = {
  COMBINADO: 'Combinado',
  SHOPEE: 'Shopee Entregas',
  MERCADO_LIVRE: 'Mercado Livre',
  FRETE: 'Frete / Autônomo',
} as const;

export const DEPRECATED_PLATFORMS = {
  IFOOD: 'iFood',
  UBER: 'Uber',
  NINETY_NINE: '99',
  INDRIVE: 'inDrive',
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS] | typeof DEPRECATED_PLATFORMS[keyof typeof DEPRECATED_PLATFORMS];

export const ACTIVE_PLATFORMS = Object.values(PLATFORMS);
