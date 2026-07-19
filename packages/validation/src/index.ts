import { z } from "zod";

export const invitationCodeSchema = z
  .string()
  .trim()
  .min(6)
  .max(32)
  .regex(/^[A-Z0-9-]+$/u, "Code invalide");

export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(24)
  .regex(/^[a-zA-Z0-9_]+$/u, "Utilise lettres, chiffres et underscores");

export const emailSchema = z.string().trim().email();

export const passwordSchema = z.string().min(10).max(128);

export const signUpSchema = z
  .object({
    invitationCode: invitationCodeSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    username: usernameSchema,
    acceptedPrivateRules: z
      .boolean()
      .refine((value) => value, "Les regles privees doivent etre acceptees"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const collectionSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(1000).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/u),
  displayOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const characterSchema = z.object({
  name: z.string().trim().min(2).max(120),
  alias: z.string().trim().max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  affiliation: z.string().trim().max(120).optional(),
  isActive: z.boolean(),
});

export const cardSchema = z.object({
  publicNumber: z.coerce.number().int().min(1),
  characterId: z.string().uuid(),
  collectionId: z.string().uuid(),
  rarityId: z.string().uuid(),
  editionName: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
  xpValue: z.coerce.number().int().min(0),
  duplicateValue: z.coerce.number().int().min(0),
  drawWeight: z.coerce.number().positive(),
  isActive: z.boolean(),
  isEventCard: z.boolean(),
  frameStyle: z.string().trim().min(1).max(80),
  animationProfile: z.string().trim().min(1).max(80),
  displayOrder: z.coerce.number().int().min(0),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type CharacterInput = z.infer<typeof characterSchema>;
export type CardInput = z.infer<typeof cardSchema>;
