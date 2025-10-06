#!/usr/bin/env -S deno run --unstable-raw-imports --allow-import=jsr.io:443 --allow-read --allow-write=character.d.ts,level.d.ts --allow-env=RD_ASSEMBLY_PATH

import { createFromBuffer } from "@dprint/formatter";
import tsPlugin from "@dprint/typescript/plugin.wasm" with { type: "bytes" };
import { globalRegistry, type ZodType } from "zod";

import { Character } from "../character.ts";
import { Level } from "../level.ts";
import { zodToTs } from "../zod_to_ts.ts";

const formatter = createFromBuffer(tsPlugin);
formatter.setConfig({}, { deno: true });

function generate(path: string, root: ZodType): undefined {
  Deno.writeTextFileSync(
    path,
    formatter.formatText({
      filePath: path,
      fileText: zodToTs(root, globalRegistry),
    }),
  );
}

generate("character.d.ts", Character);
generate("level.d.ts", Level);
