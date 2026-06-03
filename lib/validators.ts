// lib/validators.ts
import { z } from 'zod'

export const PredictionSchema = z.object({
  homeScore: z
    .number()
    .int('Placar deve ser número inteiro')
    .min(0, 'Placar não pode ser negativo')
    .max(20, 'Máximo 20 gols por time'),
  awayScore: z
    .number()
    .int('Placar deve ser número inteiro')
    .min(0, 'Placar não pode ser negativo')
    .max(20, 'Máximo 20 gols por time'),
});

export type Prediction = z.infer<typeof PredictionSchema>;

export const validatePrediction = (homeScore: unknown, awayScore: unknown) => {
  try {
    return PredictionSchema.parse({
      homeScore,
      awayScore,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => e.message),
      };
    }
    return {
      valid: false,
      errors: ['Erro ao validar palpite'],
    };
  }
};