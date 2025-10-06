#!/usr/bin/env -S deno run --allow-import=jsr.io:443 --allow-read --allow-write=character.json,level.json --allow-env=RD_ASSEMBLY_PATH

import { z, type ZodType } from "zod";

import { Character } from "../character.ts";
import { Level } from "../level.ts";

function generate(path: string, root: ZodType): undefined {
  const schema = z.toJSONSchema(root.clone(), {
    target: "draft-7",
    override: (ctx) => {
      const schema = ctx.jsonSchema;
      if (ctx.path.length === 0) {
        schema.$id = `https://0f-0b.github.io/rd-schema/${path}`;
      }
      if (schema.allOf?.length === 1) {
        Object.assign(schema, schema.allOf[0]);
        delete schema.allOf;
      }
      if (
        schema.anyOf?.every((variant) => {
          const keys = Object.keys(variant);
          return keys.length === 1 && keys[0] === "type";
        })
      ) {
        (schema.type as unknown) = schema.anyOf.map((variant) => variant.type);
        delete schema.anyOf;
      }
    },
  });
  if (schema.definitions) {
    for (const def of Object.values(schema.definitions)) {
      delete def.id;
    }
  }
  Deno.writeTextFileSync(path, JSON.stringify(schema, undefined, 2) + "\n");
}

generate("character.json", Character);
generate("level.json", Level);
