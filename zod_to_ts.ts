import type { $ZodRegistry, $ZodType, $ZodTypes } from "zod/v4/core";

import { fail } from "./fail.ts";

function literal(
  value: string | number | bigint | boolean | null | undefined,
): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    return "number";
  }
  if (typeof value === "bigint") {
    return `${value}n`;
  }
  return `${value}`;
}

function union(variants: readonly string[]): string {
  switch (variants.length) {
    case 0:
      return "never";
    case 1:
      return variants[0];
    default:
      return `(${variants.join(" | ")})`;
  }
}

export function zodToTs(
  root: $ZodType,
  metadata: $ZodRegistry<{ id?: string | undefined }>,
): string {
  const cache = new Map<$ZodType, { text: string | null }>();
  const emitNoCache = (type: $ZodType): string => {
    const def = (type as $ZodTypes)._zod.def;
    switch (def.type) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "object": {
        const props: string[] = [];
        for (const [key, value] of Object.entries(def.shape)) {
          const optional = value._zod.optout === "optional";
          props.push(`${key}${optional ? "?" : ""}: ${emit(value)}`);
        }
        return `{ ${props.join("; ")} }`;
      }
      case "array":
        return `${emit(def.element)}[]`;
      case "union":
        return union(def.options.map(emit));
      case "nullable":
        return union([emit(def.innerType), "null"]);
      case "null":
        return "null";
      case "tuple": {
        const items: string[] = [];
        for (const item of def.items) {
          items.push(emit(item));
        }
        if (def.rest) {
          items.push(`...${emit(def.rest)}[]`);
        }
        return `[${items.join(", ")}]`;
      }
      case "literal":
        return union(def.values.map(literal));
      case "enum":
        return union(Object.values(def.entries).map(literal));
      case "optional":
        return union([emit(def.innerType), "undefined"]);
      default:
        console.warn(`Unimplemented type: ${def.type}`);
        return "never";
    }
  };
  let exports = "";
  const emit = (type: $ZodType) => {
    let entry = cache.get(type);
    if (entry) {
      return entry.text ??
        fail(new TypeError("Recursive type must have an `id` metadata field"));
    }
    cache.set(type, entry = { text: metadata.get(type)?.id ?? null });
    const text = emitNoCache(type);
    if (entry.text === null) {
      entry.text = text;
    } else {
      exports += `export type ${entry.text} = ${text};\n`;
    }
    return entry.text;
  };
  emit(root);
  return exports;
}
