import { z } from 'zod';

export const TransportRequestSchema = z.object({
  eventId: z.string().min(1, "ID do evento é obrigatório"),
  eventName: z.string().min(1, "Nome do evento é obrigatório"),
  eventLocation: z.string().min(1, "Local do evento é obrigatório"),
  eventDate: z.string().min(1, "Data do evento é obrigatória"),
  
  origin: z.string().min(5, "Ponto de partida é obrigatório (Ex: Bairro/Rua)"),
  destination: z.string().min(5, "Destino é obrigatório (Ex: Nome do Local/Evento)"),
  departureTime: z.string().min(1, "Horário de saída é obrigatório"),
  hasReturn: z.boolean().default(false),
  
  notes: z.string().max(500, "Notas muito longas").optional(),
  contactPreference: z.enum(['whatsapp', 'chat_only']).default('chat_only'),
  legalAccepted: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar que a Roxou não opera as corridas",
  }),
});

export type TransportRequestData = z.infer<typeof TransportRequestSchema>;
