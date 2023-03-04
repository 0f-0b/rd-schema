import {
  type GetType,
  withGetType as g,
  zodToTs as f,
  type ZodToTsOptions as O,
} from "https://esm.sh/zod-to-ts@1.1.2?deps=typescript@4.9.5,zod@3.21.0&target=esnext&pin=v108";

export { default as ts } from "https://esm.sh/typescript@4.9.5?target=esnext&pin=v108";

export type ZodToTsOptions = O;
export const zodToTs = f as {
  (zod: unknown, identifier?: string, options?: O): ReturnType<typeof f>;
};
export const withGetType = g as {
  <T>(schema: T, getType?: GetType["getType"]): T;
};
