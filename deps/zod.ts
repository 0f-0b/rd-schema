import type {
  ZodType as ZodTypeBase,
  ZodTypeDef,
} from "https://esm.sh/zod@3.20.2?target=esnext&pin=v103";

export * from "https://esm.sh/zod@3.20.2?target=esnext&pin=v103";
export type ZodType<T> = ZodTypeBase<T, ZodTypeDef, unknown>;
