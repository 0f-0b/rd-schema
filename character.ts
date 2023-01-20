import { z } from "./deps/zod.ts";

export const Clip = z.object({
  name: z.string(),
  frames: z.number().int().array(),
  loopStart: z.number().int().optional(),
  loop: z.enum(["yes", "onBeat", "no"]),
  fps: z.number(),
  portraitOffset: z.number().int().array().min(2).max(2).optional(),
  portraitSize: z.number().int().array().min(2).max(2).optional(),
  portraitScale: z.number().optional(),
});
export const Character = z.object({
  $schema: z.string().url().optional(),
  name: z.string().optional(),
  voice: z.string().optional(),
  size: z.number().int().array().min(2).max(2),
  clips: Clip.array(),
  rowPreviewOffset: z.number().int().array().min(2).max(2).optional(),
  rowPreviewFrame: z.number().int().optional(),
});
