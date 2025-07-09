import { fail } from "./fail.ts";

export function requireEnv(name: string): string {
  return Deno.env.get(name) ?? fail(new TypeError(`${name} is not set`));
}
