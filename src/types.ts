export type UserRole = 'passenger' | 'driver' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type RequestStatus = 'open' | 'filled' | 'cancelled';

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface DriverProfile extends Profile {
  status: VerificationStatus;
  documentsUrl?: string;
  driverDashId?: string;
  isAvailable: boolean;
}

export interface TransportRequest {
  id: string;
  passengerId: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  status: RequestStatus;
  description: string;
  createdAt: string;
}

export interface EarningsRecord {
  id: string;
  user_id: string;
  date: string;
  platform: string;
  revenue: number;
  km: number;
  hours_worked: number;
  packages_count?: number;
  routes_count?: number;
  fuel_cost?: number;
  extra_expense?: number;
  notes?: string;
  created_at: string;
}

export interface ExpenseRecord {
  id: string;
  user_id: string;
  date: string;
  category: string;
  amount: number;
  description?: string;
  created_at: string;
}

export interface FreightCalculation {
  distance_km: number;
  packages_count: number;
  estimated_time: number;
  fuel_cost: number;
  toll: number;
  additional_cost: number;
  desired_profit: number;
  cost_per_km: number;
  cost_per_hour: number;
}

export interface FreightResult {
  total_cost: number;
  min_freight: number;
  recommended_freight: number;
  estimated_profit: number;
  profit_per_km: number;
  profit_per_hour: number;
}
