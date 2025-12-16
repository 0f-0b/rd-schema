#!/usr/bin/env -S deno run --unstable-raw-imports --allow-import=jsr.io:443 --allow-read --allow-write=character.d.ts,character.json,level.d.ts,level.json --allow-env=RD_ASSEMBLY_PATH

import { createFromBuffer } from "@dprint/formatter";
import tsPlugin from "@dprint/typescript/plugin.wasm" with { type: "bytes" };
import { globalRegistry, z, type ZodType } from "zod";

import { Character } from "./character.ts";
import { Level } from "./level.ts";
import { zodToTs } from "./zod_to_ts.ts";

const tsFormatter = createFromBuffer(tsPlugin);
tsFormatter.setConfig({}, { deno: true });

function generateDts(path: string, root: ZodType): undefined {
  Deno.writeTextFileSync(
    path,
    tsFormatter.formatText({
      filePath: path,
      fileText: zodToTs(root, globalRegistry),
    }),
  );
}

function generateJsonSchema(path: string, root: ZodType): undefined {
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

generateDts("character.d.ts", Character);
generateDts("level.d.ts", Level);
generateJsonSchema("character.json", Character);
generateJsonSchema("level.json", Level);
