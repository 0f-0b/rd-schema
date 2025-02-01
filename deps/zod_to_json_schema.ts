import { zodToJsonSchema as zodToJsonSchemaFn } from "npm:zod-to-json-schema@3.24.1";
import type { LiteralUnion } from "type-fest/literal-union";
import type { ZodType } from "zod";

type Id<T> = T;
export type JsonSchemaType = typeof zodToJsonSchemaFn<"jsonSchema7"> extends
  (type: ZodType) => { definitions?: Record<string, infer T> | undefined } ? T
  : JsonSchemaType;
type DefaultDefinitionPath = "definitions";
type GetDefinitionPath<T extends { definitionPath?: string }> =
  T["definitionPath"] extends infer P extends string ? P
    : DefaultDefinitionPath;
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
      (type: never, options?: string | infer T) => unknown ? T
      : ZodToJsonSchemaOptions
  > {
  definitionPath?: LiteralUnion<"definitions" | "$defs", string>;
}

export type ZodToJsonSchemaResult<P extends string = DefaultDefinitionPath> =
  & Result<JsonSchemaType, P>
  & { $schema: string };
export const zodToJsonSchema = zodToJsonSchemaFn as {
  <T extends ZodToJsonSchemaOptions>(
    type: ZodType,
    options: T,
  ): ZodToJsonSchemaResult<GetDefinitionPath<T>>;
  <T extends ZodToOpenApiOptions>(
    type: ZodType,
    options: T,
  ): ZodToOpenApiResult<GetDefinitionPath<T>>;
  (type: ZodType, name?: string): ZodToJsonSchemaResult;
};
