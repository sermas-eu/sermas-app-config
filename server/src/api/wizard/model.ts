import { z } from 'zod';

const HexColor = z
  .string()
  .regex(
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    'Expected a hex color like #fff or #ffffff',
  );

const TTSSchema = z
  .object({
    provider: z.string(),
    model: z.string(), // can be empty string
  })
  .strict();

const AvatarSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().url().optional(),
    gender: z.string().optional(),
    name: z.string().optional(),
    prompt: z.string().optional(),
    tts: TTSSchema.optional(),
  })
  .strict();

const SupportsEnum = z.enum(['dialogue', 'ui', 'session', 'detection']);

const ModuleSchema = z
  .object({
    moduleId: z.string().optional(),
    secret: z.string().optional(),
    supports: z.array(SupportsEnum).optional(),
    // Unknown/variable shape; allow any key/value
    config: z.record(z.any()).optional(),
  })
  .optional();

const SettingsSchema = z
  .object({
    login: z.boolean().optional(),
    avatar: z.string().optional(),
    language: z.string().optional(), // e.g., "en-US"
    chatModel: z.string().optional(), // e.g., "groq/openai/gpt-oss-120b"
    prompt: z.object({ text: z.string().optional() }).optional(),
    theme: z
      .object({
        primaryBgColor: HexColor.optional(),
        primaryTextColor: HexColor.optional(),
        secondaryBgColor: HexColor.optional(),
        secondaryTextColor: HexColor.optional(),
        background: z.string().optional(),
      })
      .optional(),
  })
  .optional();

const DocumentSchema = z
  .object({
    name: z.string().optional(),
    url: z.string().optional(),
    text: z.string().optional(),
  })
  .strict();

const KnowledgeSchema = z
  .object({
    documents: z.array(DocumentSchema),
  })
  .strict();

export const SermasAppSchema = z
  .object({
    name: z.string(),
    public: z.boolean().optional(),
    description: z.string().optional(),
    avatars: z.array(AvatarSchema).optional(),
    modules: z.array(ModuleSchema).optional(),
    settings: SettingsSchema.optional(),
    knowledge: KnowledgeSchema.optional(),
  })
  .strict();

export type SermasApp = z.infer<typeof SermasAppSchema>;
