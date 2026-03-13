import { ShopeeVehicleType } from './types';

export const SHOPEE_PRICING = {
  Passeio: [
    { min: 0, max: 100, price: 229 },
    { min: 101, max: 150, price: 256 },
    { min: 151, max: 200, price: 284 },
    { min: 201, max: 250, price: 314 },
    { min: 251, max: 300, price: 330 },
    { min: 301, max: 350, price: 361 },
    { min: 351, max: 400, price: 378 },
    { min: 401, max: 450, price: 411 },
    { min: 451, max: 500, price: 441 },
  ],
  Fiorino: [
    { min: 0, max: 100, price: 272 },
    { min: 101, max: 150, price: 301 },
    { min: 151, max: 200, price: 334 },
    { min: 201, max: 250, price: 367 },
    { min: 251, max: 300, price: 385 },
    { min: 301, max: 350, price: 419 },
    { min: 351, max: 400, price: 443 },
    { min: 401, max: 450, price: 497 },
    { min: 451, max: 500, price: 537 },
  ],
};

export const calculateShopeeEarnings = (km: number, vehicleType: ShopeeVehicleType): number => {
  const table = SHOPEE_PRICING[vehicleType];
  const range = table.find((r) => km >= r.min && km <= r.max);
  if (range) return range.price;
  
  // If over 500km, use the last range price
  const lastRange = table[table.length - 1];
  if (km > lastRange.max) return lastRange.price;
  
  return 0;
};

export const PLATFORM_NAMES = {
  ifood: 'iFood',
  shopee: 'Shopee Entregas',
  mercadolivre: 'Mercado Livre Entregas',
};

export const TRANSPORT_MODE_NAMES = {
  motorcycle: 'Moto',
  car: 'Carro',
  fiorino: 'Fiorino',
  bicycle: 'Bicicleta',
  walking: 'A pé',
  scooter: 'Patinete',
};
