import {
  type GetType,
  withGetType as withGetTypeFn,
  zodToTs as zodToTsFn,
} from "npm:zod-to-ts@1.1.2";

export { default as ts } from "npm:typescript@4.9.5";

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
export const setTsType = withGetTypeFn as {
  <T>(schema: T, getType?: GetType["getType"]): T;
};
