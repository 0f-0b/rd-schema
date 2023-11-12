// deno-lint-ignore-file no-explicit-any
// Use `any` here because typechecking would be too slow otherwise.
import { zodToJsonSchema as zodToJsonSchemaFn } from "npm:zod-to-json-schema@3.21.4";
import { LiteralUnion } from "./type_fest/literal_union.d.ts";

type Id<T> = T;
export type JsonSchemaType = typeof zodToJsonSchemaFn<"jsonSchema7"> extends
  (type: any) => { definitions?: Record<string, infer T> } ? T
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
    type: any,
    options: T,
  ): ZodToJsonSchemaResult<GetDefinitionPath<T>>;
  <T extends ZodToOpenApiOptions>(
    type: any,
    options: T,
  ): ZodToOpenApiResult<GetDefinitionPath<T>>;
  (type: any, name?: string): ZodToJsonSchemaResult;
};
