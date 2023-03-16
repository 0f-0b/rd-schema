import {
  type GetType,
  withGetType as withGetTypeFn,
  zodToTs as zodToTsFn,
} from "https://esm.sh/zod-to-ts@1.1.2?deps=typescript@4.9.5,zod@3.21.4&target=esnext&pin=v111";

export { default as ts } from "https://esm.sh/typescript@4.9.5?target=esnext&pin=v111";

type Id<T> = T;

// deno-lint-ignore no-empty-interface
export interface ZodToTsOptions extends
  Id<
    typeof zodToTsFn extends
      (type: never, identifier?: string, options?: infer T) => unknown ? T
      : never
  > {}

export type ZodToTsResult = ReturnType<typeof zodToTsFn>;
export const zodToTs = zodToTsFn as {
  (type: unknown, identifier?: string, options?: ZodToTsOptions): ZodToTsResult;
};
export const withGetType = withGetTypeFn as {
  <T>(schema: T, getType?: GetType["getType"]): T;
};
