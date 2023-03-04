#!/usr/bin/env -S deno run --allow-write=character.json,level.json

import type { ZodTypeAny } from "../deps/zod.ts";
import { zodToJsonSchema } from "../deps/zod_to_json_schema.ts";

import { Character, characterTypedefs } from "../character.ts";
import { Level, levelTypedefs } from "../level.ts";

async function generate(
  path: string,
  url: string,
  type: ZodTypeAny,
  definitions: Record<string, ZodTypeAny>,
): Promise<undefined> {
  const schema = Object.assign(
    zodToJsonSchema(type, { definitions }),
    { $id: url },
  );
  await Deno.writeTextFile(path, JSON.stringify(schema, undefined, 2) + "\n");
  return;
}

await Promise.all([
  generate(
    "character.json",
    "https://0f-0b.github.io/rd-schema/character.json",
    Character,
    characterTypedefs,
  ),
  generate(
    "level.json",
    "https://0f-0b.github.io/rd-schema/level.json",
    Level,
    levelTypedefs,
  ),
]);
