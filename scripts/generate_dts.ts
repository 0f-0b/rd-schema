#!/usr/bin/env -S deno run --allow-read --allow-write=character.d.ts,level.d.ts --allow-env=RD_ASSEMBLY_PATH --allow-run=./scripts/deno_fmt.sh

import { ts } from "../deps/typescript.ts";
import type { ZodTypeAny } from "../deps/zod.ts";
import { setTsType, zodToTs } from "../deps/zod_to_ts.ts";

import { characterTypedefs } from "../character.ts";
import { levelTypedefs } from "../level.ts";

const f = ts.factory;
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const sourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const exportModifier = f.createModifier(ts.SyntaxKind.ExportKeyword);

async function generate(
  path: string,
  definitions: Record<string, ZodTypeAny>,
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
  const sourceReadable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(sourceText));
      controller.close();
    },
  });
  const child = new Deno.Command(new URL("deno_fmt.sh", import.meta.url), {
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).spawn();
  sourceReadable.pipeTo(child.stdin).catch(() => {});
  const { success, stdout, stderr } = await child.output();
  if (!success) {
    throw new Error(decoder.decode(stderr));
  }
  await Deno.writeFile(path, stdout);
  return;
}

await Promise.all([
  generate("character.d.ts", characterTypedefs),
  generate("level.d.ts", levelTypedefs),
]);
