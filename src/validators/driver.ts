import { z } from 'zod';

export const DriverOnboardingSchema = z.object({
  fullName: z.string().min(5, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone inválido"),
  vehicleModel: z.string().min(2, "Modelo do veículo é obrigatório"),
  vehiclePlate: z.string().length(7, "Placa deve ter 7 caracteres (Padrão Mercosul ou Antigo)"),
  driverDashId: z.string().optional(),
  cnhUrl: z.string().url("Documento CNH é obrigatório"),
  crlvUrl: z.string().url("Documento CRLV é obrigatório"),
});

export type DriverOnboardingData = z.infer<typeof DriverOnboardingSchema>;
