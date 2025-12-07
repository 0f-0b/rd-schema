import { z } from "zod";

export const Clip = z.object({
  name: z.string(),
  frames: z.int32().array(),
  loopStart: z.int32().optional(),
  loop: z.enum(["yes", "onBeat", "no"]),
  fps: z.number(),
  pivotOffset: z.tuple([z.number(), z.number()]).optional(),
  reflectionOffset: z.number().optional(),
  portraitOffset: z.tuple([z.number(), z.number()]).optional(),
  portraitSize: z.tuple([z.number(), z.number()]).optional(),
  portraitScale: z.number().optional(),
}).meta({ id: "Clip" });
export const Character = z.object({
  $schema: z.url().optional(),
  name: z.string().optional(),
  voice: z.string().optional(),
  size: z.tuple([z.int32(), z.int32()]),
  clips: Clip.array(),
  rowPreviewOffset: z.tuple([z.number(), z.number()]).optional(),
  rowPreviewFrame: z.int32().optional(),
  rowPreviewScale: z.number().optional(),
  pivotOffset: z.tuple([z.number(), z.number()]).optional(),
  reflectionOffset: z.number().optional(),
  portraitOffset: z.tuple([z.number(), z.number()]).optional(),
  portraitSize: z.tuple([z.number(), z.number()]).optional(),
  portraitScale: z.number().optional(),
}).meta({ id: "Character" });
