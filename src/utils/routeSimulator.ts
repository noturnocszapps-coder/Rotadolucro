import { calculateShopeeEarnings } from '../constants';
import { ShopeeVehicleType, VehicleSettings } from '../types';

export type PlatformType = 'shopee' | 'mercadolivre';
export type AllocationMode = 'none' | 'daily' | 'proportional';

export interface SimulationInput {
  platform: PlatformType;
  date?: string;
  kmDriven: number;
  hoursWorked: number;
  packagesCount: number;
  extraExpenses: number;
  tolls: number;
  foodExpenses: number;
  parking: number;
  fuelEstimate: number;
  maintenanceEstimate: number;
  allocationMode: AllocationMode;
  vehicleType?: ShopeeVehicleType;
  grossAmountManual?: number;
  routesCount?: number;
}

export interface SimulationResult {
  grossAmount: number;
  variableCosts: number;
  fixedCostAllocated: number;
  totalRouteCost: number;
  estimatedNetProfit: number;
  earningsPerKm: number;
  earningsPerHour: number;
  earningsPerPackage: number;
  breakEvenCostPerKm: number;
  profitabilityStatus: 'Muito boa' | 'Aceitável' | 'Baixa' | 'Prejuízo';
}

export const calculateSimulation = (
  input: SimulationInput,
  vehicleSettings?: VehicleSettings | null
): SimulationResult => {
  const {
    platform,
    kmDriven,
    hoursWorked,
    packagesCount,
    extraExpenses,
    tolls,
    foodExpenses,
    parking,
    fuelEstimate,
    maintenanceEstimate,
    allocationMode,
    vehicleType,
    grossAmountManual,
  } = input;

  // 1. Gross Amount
  let grossAmount = 0;
  if (platform === 'shopee' && vehicleType) {
    grossAmount = calculateShopeeEarnings(kmDriven, vehicleType);
  } else if (platform === 'mercadolivre' && grossAmountManual) {
    grossAmount = grossAmountManual;
  }

  // 2. Variable Costs
  const variableCosts =
    fuelEstimate +
    maintenanceEstimate +
    extraExpenses +
    tolls +
    foodExpenses +
    parking;

  // 3. Fixed Cost Allocation
  let fixedCostAllocated = 0;
  if (vehicleSettings && allocationMode !== 'none') {
    const monthlyFixedCosts =
      (vehicleSettings.insurance_monthly || 0) +
      (vehicleSettings.financing_monthly || 0) +
      (vehicleSettings.maintenance_monthly || 0) +
      (vehicleSettings.other_fixed_costs || 0) +
      ((vehicleSettings.ipva_annual || 0) / 12);

    const dailyFixedCost = monthlyFixedCosts / 30;

    if (allocationMode === 'daily') {
      fixedCostAllocated = dailyFixedCost;
    } else if (allocationMode === 'proportional') {
      // Proportional based on hours (assuming 8h day) or just a fraction
      // Let's assume proportional to hours worked relative to a 10h day for simplicity or just use hours
      const hoursPerDay = 10;
      fixedCostAllocated = (hoursWorked / hoursPerDay) * dailyFixedCost;
    }
  }

  // 4. Totals
  const totalRouteCost = variableCosts + fixedCostAllocated;
  const estimatedNetProfit = grossAmount - totalRouteCost;

  // 5. Unit Metrics
  const earningsPerKm = kmDriven > 0 ? grossAmount / kmDriven : 0;
  const earningsPerHour = hoursWorked > 0 ? grossAmount / hoursWorked : 0;
  const earningsPerPackage = packagesCount > 0 ? grossAmount / packagesCount : 0;
  const breakEvenCostPerKm = kmDriven > 0 ? totalRouteCost / kmDriven : 0;

  // 6. Profitability Status
  let profitabilityStatus: SimulationResult['profitabilityStatus'] = 'Baixa';
  const margin = grossAmount > 0 ? estimatedNetProfit / grossAmount : 0;

  if (estimatedNetProfit < 0) {
    profitabilityStatus = 'Prejuízo';
  } else if (margin > 0.4) {
    profitabilityStatus = 'Muito boa';
  } else if (margin > 0.2) {
    profitabilityStatus = 'Aceitável';
  } else {
    profitabilityStatus = 'Baixa';
  }

  return {
    grossAmount,
    variableCosts,
    fixedCostAllocated,
    totalRouteCost,
    estimatedNetProfit,
    earningsPerKm,
    earningsPerHour,
    earningsPerPackage,
    breakEvenCostPerKm,
    profitabilityStatus,
  };
};
