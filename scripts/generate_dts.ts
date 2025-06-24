#!/usr/bin/env -S deno run --no-prompt --allow-import=jsr.io:443 --allow-read --allow-write=character.d.ts,level.d.ts --allow-env=RD_ASSEMBLY_PATH --allow-run=./scripts/deno_fmt.sh

import "../clear_node_env.ts";

import { fromFileUrl } from "@std/path/from-file-url";
import { ts } from "typescript";
import type { ZodType } from "zod";
import { setTsType, zodToTs } from "zod-to-ts";

import { characterTypedefs } from "../character.ts";
import { levelTypedefs } from "../level.ts";

const f = ts.factory;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const sourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const exportModifier = f.createModifier(ts.SyntaxKind.ExportKeyword);
const fmtPath = fromFileUrl(import.meta.resolve("./deno_fmt.sh"));

async function generate(
  path: string,
  definitions: Record<string, ZodType>,
): Promise<undefined> {
  let sourceText = "";
  for (const [name, type] of Object.entries(definitions)) {
    const { node } = zodToTs(type, name);
    const ident = f.createIdentifier(name);
    const typeAlias = f.createTypeAliasDeclaration(
      [exportModifier],
      ident,
      undefined,
      node,
    );
    sourceText += printer.printNode(
      ts.EmitHint.Unspecified,
      typeAlias,
      sourceFile,
    ) + "\n";
    setTsType(type, () => ident);
  }
  const child = new Deno.Command(fmtPath, {
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).spawn();
  ReadableStream.from([encoder.encode(sourceText)])
    .pipeTo(child.stdin).catch(() => {});
  const { success, stdout, stderr } = await child.output();
  if (!success) {
    throw new Error(decoder.decode(stderr));
  }
  await Deno.writeFile(path, stdout);
}

await Promise.all([
  generate("character.d.ts", characterTypedefs),
  generate("level.d.ts", levelTypedefs),
]);
