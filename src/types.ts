export type PlatformType = 'ifood' | 'shopee' | 'mercadolivre';
export type TransportMode = 'motorcycle' | 'car' | 'fiorino' | 'bicycle' | 'walking' | 'scooter';
export type ExpenseCategory = 'fuel' | 'maintenance' | 'insurance' | 'financing' | 'cleaning' | 'toll' | 'other';
export type ShopeeVehicleType = 'Passeio' | 'Fiorino';

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface UserWorkProfile {
  id: string;
  user_id: string;
  platform_type: PlatformType;
  active: boolean;
  created_at: string;
}

export interface VehicleSettings {
  id: string;
  user_id: string;
  platform_type?: PlatformType;
  transport_mode: TransportMode;
  vehicle_model: string;
  fuel_type: string;
  average_consumption: number;
  insurance_monthly: number;
  financing_monthly: number;
  ipva_annual: number;
  maintenance_monthly: number;
  other_fixed_costs: number;
  created_at: string;
}

export interface WorkLog {
  id: string;
  user_id: string;
  platform_type: PlatformType;
  date: string;
  gross_amount: number;
  bonus_amount: number;
  hours_worked: number;
  km_driven: number;
  deliveries_count: number;
  packages_count: number;
  routes_count: number;
  notes?: string;
  vehicle_type?: ShopeeVehicleType;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  platform_type?: PlatformType;
  created_at: string;
}

export interface FuelLog {
  id: string;
  user_id: string;
  date: string;
  liters: number;
  price_per_liter: number;
  total_value: number;
  odometer_km: number;
  vehicle_type: string;
  platform_type?: PlatformType;
  created_at: string;
}

export interface MaintenanceLog {
  id: string;
  user_id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  odometer_km: number;
  platform_type?: PlatformType;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  platform_type?: PlatformType;
  target_amount: number;
  current_amount: number;
  month: string;
  active: boolean;
  created_at: string;
}
