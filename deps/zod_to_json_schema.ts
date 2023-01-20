import { zodToJsonSchema as f } from "https://esm.sh/zod-to-json-schema@3.20.2?pin=v103";

export interface ZodToJsonSchemaOptions {
  name?: string;
  $refStrategy?: "root" | "relative" | "none";
  basePath?: string[];
  effectStrategy?: "input" | "any";
  strictUnions?: boolean;
  definitionPath?: string;
  definitions?: Record<string, unknown>;
  errorMessages?: boolean;
}

// workaround for TS2589: zod types are too complex for tsc
export type JsonSchema = ReturnType<typeof f<"jsonSchema7">>;
export const zodToJsonSchema = f as {
  (schema: unknown, name?: string): JsonSchema;
  (schema: unknown, options?: ZodToJsonSchemaOptions): JsonSchema;
};
