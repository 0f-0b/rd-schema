#!/usr/bin/env -S deno run --no-prompt --allow-import=jsr.io:443 --allow-read --allow-write=character.json,level.json --allow-env=RD_ASSEMBLY_PATH

import type { ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { Character, characterTypedefs } from "../character.ts";
import { Level, levelTypedefs } from "../level.ts";

async function generate(
  path: string,
  url: string,
  type: ZodType,
  definitions: Record<string, ZodType>,
): Promise<undefined> {
  const schema = Object.assign(
    zodToJsonSchema(type, { definitions }),
    { $id: url },
  );
  await Deno.writeTextFile(path, JSON.stringify(schema, undefined, 2) + "\n");
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
