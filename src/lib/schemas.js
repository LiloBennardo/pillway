import { z } from 'zod'

export const MedicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit faire au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-\.]+$/, 'Caractères invalides dans le nom'),

  dosage: z
    .string()
    .max(50, 'Dosage trop long')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\.\,\/\-µ]*$/, 'Format dosage invalide')
    .optional()
    .or(z.literal('')),

  form: z.enum(['comprimé', 'gélule', 'sirop', 'poudre', 'patch', 'injection', 'autre']),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),

  notes: z
    .string()
    .max(500, 'Notes trop longues')
    .optional()
    .or(z.literal('')),
})

export const ReminderSchema = z.object({
  scheduledTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format heure invalide (HH:MM)'),

  daysOfWeek: z
    .array(z.number().int().min(1).max(7))
    .min(1, 'Choisissez au moins un jour')
    .max(7),

  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide'),

  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal(''))
    .nullable(),

  alertMinutes: z
    .number()
    .int()
    .min(0)
    .max(120),
})

export const ProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nom trop court')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères invalides'),

  alert_minutes: z.number().int().min(0).max(120),
})

export const DoctorEmailSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .max(254)
    .toLowerCase(),
})

export function getZodErrors(schema, data) {
  const result = schema.safeParse(data)
  if (result.success) return null
  const errors = {}
  result.error.issues.forEach(issue => {
    errors[issue.path[0]] = issue.message
  })
  return errors
}
