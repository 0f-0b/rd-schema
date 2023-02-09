import { zodToJsonSchema as f } from "https://esm.sh/zod-to-json-schema@3.20.3?deps=zod@3.20.6&target=esnext&pin=v106";
import type { ZodTypeAny } from "./zod.ts";

export type ZodToJsonSchemaOptions = Parameters<typeof f<"jsonSchema7">>[1];
export type JsonSchema = ReturnType<typeof f<"jsonSchema7">>;
export const zodToJsonSchema: {
  (schema: ZodTypeAny, name?: string): JsonSchema;
  (schema: ZodTypeAny, options?: ZodToJsonSchemaOptions): JsonSchema;
} = f<"jsonSchema7">;
