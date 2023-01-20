#!/usr/bin/env -S deno run --no-prompt --allow-write=character.d.ts,level.d.ts

import { ts, withGetType, zodToTs } from "./deps/zod_to_ts.ts";

import { characterTypedefs } from "./character.ts";
import { levelTypedefs } from "./level.ts";

const sourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const exportModifier = ts.factory.createModifier(ts.SyntaxKind.ExportKeyword);

async function generate(
  path: string,
  definitions: Record<string, unknown>,
): Promise<undefined> {
  let sourceText = "";
  for (const [name, type] of Object.entries(definitions)) {
    const { node } = zodToTs(type, name);
    const ident = ts.factory.createIdentifier(name);
    const typeAlias = ts.factory.createTypeAliasDeclaration(
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
    withGetType(type, () => ident);
  }
  await Deno.writeTextFile(path, sourceText);
  return;
}

await Promise.all([
  generate("character.d.ts", characterTypedefs),
  generate("level.d.ts", levelTypedefs),
]);
