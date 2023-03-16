import { zodToJsonSchema as zodToJsonSchemaFn } from "https://esm.sh/zod-to-json-schema@3.20.4?deps=zod@3.21.4&target=esnext&pin=v111";
import type { ZodTypeAny } from "./zod.ts";

type Id<T> = T;
export type JsonSchemaType = typeof zodToJsonSchemaFn<"jsonSchema7"> extends
  (type: ZodTypeAny) => { definitions?: Record<string, infer T> } ? T
  : JsonSchemaType;
type DefaultDefinitionPath = "definitions";
type GetDefinitionPath<T extends { definitionPath?: string }> = T extends
  { definitionPath: infer P } ? P : DefaultDefinitionPath;
type Result<S, P extends string> = Partial<Record<P, Record<string, S>>> & S;

export interface ZodToOpenApiOptions
  extends Omit<ZodToJsonSchemaOptions, "target"> {
  target: "openApi3";
}

export type ZodToOpenApiResult<P extends string = DefaultDefinitionPath> =
  Result<Record<string, unknown>, P>;

export interface ZodToJsonSchemaOptions extends
  Id<
    typeof zodToJsonSchemaFn<"jsonSchema7"> extends
      (type: never, options?: string | infer T) => unknown
      ? Omit<T, "definitionPath">
      : never
  > {
  // deno-lint-ignore ban-types
  definitionPath?: "definitions" | "$defs" | (string & {});
}

export type ZodToJsonSchemaResult<P extends string = DefaultDefinitionPath> =
  & { $schema: string }
  & Result<JsonSchemaType, P>;
export const zodToJsonSchema = zodToJsonSchemaFn as {
  <T extends ZodToJsonSchemaOptions>(
    type: ZodTypeAny,
    options: T,
  ): ZodToJsonSchemaResult<GetDefinitionPath<T>>;
  <T extends ZodToOpenApiOptions>(
    type: ZodTypeAny,
    options: T,
  ): ZodToOpenApiResult<GetDefinitionPath<T>>;
  (type: ZodTypeAny, name?: string): ZodToJsonSchemaResult;
};
