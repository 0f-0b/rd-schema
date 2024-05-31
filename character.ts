import { z } from "zod";

export const Clip = z.object({
  name: z.string(),
  frames: z.number().int().array(),
  loopStart: z.number().int().optional(),
  loop: z.enum(["yes", "onBeat", "no"]),
  fps: z.number(),
  pivotOffset: z.tuple([z.number(), z.number()]).optional(),
  portraitOffset: z.tuple([z.number(), z.number()]).optional(),
  portraitSize: z.tuple([z.number().int(), z.number().int()]).optional(),
  portraitScale: z.number().optional(),
});
export const Character = z.object({
  $schema: z.string().url().optional(),
  name: z.string().optional(),
  voice: z.string().optional(),
  size: z.tuple([z.number().int(), z.number().int()]),
  clips: Clip.array(),
  rowPreviewOffset: z.tuple([z.number(), z.number()]).optional(),
  rowPreviewFrame: z.number().int().optional(),
  pivotOffset: z.tuple([z.number(), z.number()]).optional(),
  portraitOffset: z.tuple([z.number(), z.number()]).optional(),
  portraitSize: z.tuple([z.number().int(), z.number().int()]).optional(),
  portraitScale: z.number().optional(),
});
export const characterTypedefs = {
  Clip,
  Character,
};
