import { PE } from "pe-struct-0";
import { z, type ZodType } from "zod";

const clampInts = false;
const decoder = new TextDecoder(undefined, { fatal: true, ignoreBOM: false });

class DataReader {
  readonly #view: DataView;
  readonly #data: Uint8Array;
  #offset: number;

  constructor(view: ArrayBufferView, offset = 0) {
    const { buffer, byteOffset, byteLength } = view;
    this.#view = new DataView(buffer, byteOffset, byteLength);
    this.#data = new Uint8Array(buffer, byteOffset, byteLength);
    this.#offset = offset;
  }

  skip(count: number): undefined {
    this.#offset += count;
  }

  remaining(): Uint8Array {
    return this.#data.subarray(this.#offset);
  }

  readCString(): string {
    const offset = this.#offset;
    const nulPos = this.#data.indexOf(0, offset);
    if (nulPos === -1) {
      throw new TypeError(`Cannot find NUL byte at ${offset}`);
    }
    this.#offset = nulPos + 1;
    return decoder.decode(this.#data.subarray(offset, nulPos));
  }

  readPackedUint(): number {
    const offset = this.#offset;
    const size = PE.getCompressedIntSize(this.#view.getUint8(offset));
    this.#offset += size;
    return PE.decompressUint(this.#data.slice(offset, offset + size));
  }

  readBuffer(): Uint8Array {
    const length = this.readPackedUint();
    const offset = this.#offset;
    this.#offset += length;
    return this.#data.subarray(offset, offset + length);
  }

  readSerString(): string | null {
    return this.#view.getUint8(this.#offset) == 255
      ? null
      : decoder.decode(this.readBuffer());
  }

  readUint8(): number {
    const offset = this.#offset;
    this.#offset++;
    return this.#view.getUint8(offset);
  }

  readUint16LE(): number {
    const offset = this.#offset;
    this.#offset += 2;
    return this.#view.getUint16(offset, true);
  }

  readInt32LE(): number {
    const offset = this.#offset;
    this.#offset += 4;
    return this.#view.getInt32(offset, true);
  }

  readFloat32LE(): number {
    const offset = this.#offset;
    this.#offset += 4;
    return this.#view.getFloat32(offset, true);
  }
}

const assemblyPath = Deno.env.get("RD_ASSEMBLY_PATH");
if (assemblyPath === undefined) {
  throw new TypeError("'RD_ASSEMBLY_PATH' is not set");
}
const assembly = PE.load(Deno.readFileSync(assemblyPath).slice().buffer);
const stringsHeap = new DataView(
  assembly.data.buffer,
  assembly.mdsStrings!._off,
  assembly.mdsStrings!._sz,
);
const blobHeap = new DataView(
  assembly.data.buffer,
  assembly.mdsBlob!._off,
  assembly.mdsBlob!._sz,
);
const typeRefTable = assembly.mdtTypeRef!.values;
const typeDefTable = assembly.mdtTypeDef!.values;
const fieldTable = assembly.mdtField!.values;
const methodDefTable = assembly.mdtMethodDef!.values;
const customAttributeTable = assembly.mdtCustomAttribute!.values;
const getString = (offset: number) =>
  new DataReader(stringsHeap, offset).readCString();
const getBlob = (offset: number) =>
  new DataReader(blobHeap, offset).readBuffer();
const getFullNameOfType = (row: PE.MdtTypeDefItem | PE.MdtTypeRefItem) =>
  `${getString(row.Namespace.value)}\0${getString(row.Name.value)}`;
const getFullNameOfTypeByCodedIndex = (codedIndex: number) => {
  const table = [typeDefTable, typeRefTable][codedIndex & 3];
  const index = (codedIndex >> 2) - 1;
  return getFullNameOfType(table[index]);
};
const typeDefIndexByFullName = new Map(
  typeDefTable.map((row, index) => [getFullNameOfType(row), index]),
);
const getTypeDefIndexByFullName = (fullName: string) => {
  const typeDefIndex = typeDefIndexByFullName.get(fullName);
  if (typeDefIndex === undefined) {
    throw new TypeError(`Cannot find type '${fullName.replaceAll("\0", ".")}'`);
  }
  return typeDefIndex;
};
const getMethodListByTypeDefIndex = (
  typeDefIndex: number,
): [number, number] => [
  typeDefTable[typeDefIndex].MethodList.value - 1,
  Math.min(
    (typeDefTable[typeDefIndex + 1]?.MethodList.value ?? Infinity) - 1,
    methodDefTable.length,
  ),
];
const getFieldListByTypeDefIndex = (typeDefIndex: number): [number, number] => [
  typeDefTable[typeDefIndex].FieldList.value - 1,
  Math.min(
    (typeDefTable[typeDefIndex + 1]?.FieldList.value ?? Infinity) - 1,
    fieldTable.length,
  ),
];
const getCtorIndicesByFullName = (fullName: string) => {
  const typeDefIndex = getTypeDefIndexByFullName(fullName);
  const [methodDefStart, methodDefEnd] = getMethodListByTypeDefIndex(
    typeDefIndex,
  );
  const ctorIndices: number[] = [];
  for (
    let methodDefIndex = methodDefStart;
    methodDefIndex < methodDefEnd;
    methodDefIndex++
  ) {
    const methodDef = methodDefTable[methodDefIndex];
    if (
      (methodDef.Flags.value & PE.CorMethodAttr.SpecialName) &&
      getString(methodDef.Name.value) === ".ctor"
    ) {
      ctorIndices.push(methodDefIndex);
    }
  }
  return ctorIndices;
};
const getCtorIndexByFullName = (fullName: string) => {
  const ctorIndices = getCtorIndicesByFullName(fullName);
  if (ctorIndices.length !== 1) {
    throw new TypeError(
      `'${fullName.replaceAll("\0", ".")}' has multiple constructors`,
    );
  }
  return ctorIndices[0];
};
const getCustomAttribute = (
  tableIndex: number,
  rowIndex: number,
  customAttributeType: number,
) => {
  const customAttribute = customAttributeTable.find((row) =>
    row.Parent.tid === tableIndex &&
    row.Parent.rid - 1 === rowIndex &&
    row.Type.tid === PE.MdTableIndex.MethodDef &&
    row.Type.rid - 1 === customAttributeType
  );
  if (!customAttribute) {
    return undefined;
  }
  const reader = new DataReader(getBlob(customAttribute.Value.value));
  if (reader.readUint16LE() !== 1) {
    throw new TypeError("Invalid custom attribute");
  }
  return reader;
};
const levelEventInfoType = getCtorIndexByFullName("\0LevelEventInfoAttribute");
const jsonPropertyType = getCtorIndexByFullName("\0JsonPropertyAttribute");
const intInfoType = getCtorIndexByFullName("\0IntInfoAttribute");
const floatInfoType = getCtorIndexByFullName("\0FloatInfoAttribute");
const vector2InfoType = getCtorIndexByFullName("\0Vector2InfoAttribute");
export const ConditionExpression = z.string().or(z.number().int().array());
export const ColorOrPaletteIndex = z.string()
  .regex(/^(?:(?:[0-9A-Fa-f]{2}){3,4}|pal\d+)$/);
export const Sound = z.object({
  filename: z.string(),
  volume: z.number().int().optional(),
  pitch: z.number().int().optional(),
  pan: z.number().int().optional(),
  offset: z.number().int().optional(),
});
export const Border = z.enum(["None", "Outline", "Glow"]);
export const ContentMode = z.enum([
  "ScaleToFill",
  "AspectFit",
  "AspectFill",
  "Center",
  "Tiled",
  "Real",
]);
export const Hands = z.enum(["Left", "Right", "p1", "p2", "Both"]);
export const NarrationCategory = z.enum([
  "Fallback",
  "Navigation",
  "Instruction",
  "Notification",
  "Dialogue",
  "Description",
  "Subtitles",
]);
export const Player = z.enum(["P1", "P2", "CPU"]);
export const RowType = z.enum(["Classic", "Oneshot"]);
export const Easing = z.enum([
  "Unset",
  "Linear",
  "InSine",
  "OutSine",
  "InOutSine",
  "InQuad",
  "OutQuad",
  "InOutQuad",
  "InCubic",
  "OutCubic",
  "InOutCubic",
  "InQuart",
  "OutQuart",
  "InOutQuart",
  "InQuint",
  "OutQuint",
  "InOutQuint",
  "InExpo",
  "OutExpo",
  "InOutExpo",
  "InCirc",
  "OutCirc",
  "InOutCirc",
  "InElastic",
  "OutElastic",
  "InOutElastic",
  "InBack",
  "OutBack",
  "InOutBack",
  "InBounce",
  "OutBounce",
  "InOutBounce",
]);
export const Strength = z.enum(["Low", "Medium", "High"]);
export const TilingType = z.enum(["Scroll", "Pulse"]);
export const Language = z.enum([
  "English",
  "Spanish",
  "Portuguese",
  "ChineseSimplified",
  "ChineseTraditional",
  "Korean",
  "Polish",
  "Japanese",
  "German",
]);
const makeAutoPropertyValue = (
  fieldIndex: number,
  signature: DataReader,
): ZodType | null => {
  switch (signature.readUint8()) {
    case 2:
      return z.boolean();
    case 8: {
      let min = -0x80000000;
      let max = 0x7fffffff;
      const intInfo = getCustomAttribute(
        PE.MdTableIndex.Field,
        fieldIndex,
        intInfoType,
      );
      if (intInfo && clampInts) {
        min = intInfo.readInt32LE();
        max = intInfo.readInt32LE();
      }
      return z.number().int().min(min).max(max);
    }
    case 12: {
      let min = -Infinity;
      let max = Infinity;
      const floatInfo = getCustomAttribute(
        PE.MdTableIndex.Field,
        fieldIndex,
        floatInfoType,
      );
      if (floatInfo) {
        min = floatInfo.readFloat32LE();
        max = floatInfo.readFloat32LE();
      }
      let prop = z.number();
      if (min !== -Infinity) {
        prop = prop.min(min);
      }
      if (max !== Infinity) {
        prop = prop.max(max);
      }
      return prop;
    }
    case 14:
      return z.string();
    case 17:
      switch (getFullNameOfTypeByCodedIndex(signature.readPackedUint())) {
        case "\0BorderType":
          return Border;
        case "\0Character":
          return z.string();
        case "\0ColorOrPalette":
          return ColorOrPaletteIndex;
        case "\0ContentMode":
          return ContentMode;
        case "\0Hand":
          return Hands;
        case "\0HandAction":
          return z.enum(["Show", "Hide", "Raise", "Lower"]);
        case "\0HandExtent":
          return z.enum(["Full", "Short"]);
        case "\0HeartExplodeType":
          return z.enum([
            "OneBeatAfter",
            "Instant",
            "GatherNoCeil",
            "GatherAndCeil",
          ]);
        case "\0NarrationCategory":
          return NarrationCategory;
        case "\0OffsetType":
          return z.enum([
            "Perfect",
            "SlightlyEarly",
            "SlightlyLate",
            "VeryEarly",
            "VeryLate",
            "AnyEarlyOrLate",
            "Missed",
          ]);
        case "\0OverrideExpression":
          return z.enum([
            "Neutral",
            "Happy",
            "Barely",
            "Missed",
            "Prehit",
            "Beep",
          ]);
        case "\0PlayStyleChange":
          return z.enum([
            "Normal",
            "Loop",
            "Prolong",
            "Immediately",
            "ExtraImmediately",
            "ProlongOneBar",
            "Default",
            "OnNextBar",
            "BeatLoopOnly",
            "ScrubToNext",
            "None",
          ]);
        case "\0RDPlayer":
          return z.enum([...Player.options, "NoChange"]);
        case "\0RowEffect":
          return z.enum(["None", "Electric"]);
        case "\0RowType":
          return RowType;
        case "\0RowVisibilityMode":
          return z.enum(["Visible", "Hidden", "OnlyCharacter", "OnlyRow"]);
        case "\0TagAction":
          return z.enum([
            "Run",
            "RunAll",
            "Enable",
            "Disable",
            "EnableAll",
            "DisableAll",
          ]);
        case "\0TextureFilter":
          return z.enum(["NearestNeighbor", "Bilinear"]);
        case "DG.Tweening\0Ease":
          return Easing;
        case "RDLevelEditor\0BackgroundType":
          return z.enum(["Color", "Image"]);
        case "RDLevelEditor\0CustomSoundType":
          return z.enum([
            "CueSound",
            "MusicSound",
            "BeatSound",
            "HitSound",
            "OtherSound",
          ]);
        case "RDLevelEditor\0FloatingTextMode":
          return z.enum(["FadeOut", "HideAbruptly"]);
        case "RDLevelEditor\0PlayerMode":
          return z.enum(["OnePlayer", "TwoPlayers"]);
        case "RDLevelEditor\0SimpleDuration":
          return z.enum(["Short", "Medium", "Long"]);
        case "RDLevelEditor\0SoundDataStruct":
          return Sound;
        case "RDLevelEditor\0StrengthLevel":
          return Strength;
        case "RDLevelEditor\0StutterAction":
          return z.enum(["Add", "Cancel"]);
        case "RDLevelEditor\0TextExplosionDirection":
          return z.enum(["Left", "Right"]);
        case "RDLevelEditor\0TextExplosionMode":
          return z.enum(["OneColor", "Random"]);
        case "RDLevelEditor\0TilingType":
          return TilingType;
        case "RDLevelEditor\0TransitionType":
          return z.enum(["Smooth", "Instant", "Full"]);
        case "UnityEngine\0SystemLanguage":
          return Language;
        case "UnityEngine\0TextAnchor":
          return z.enum([
            "UpperLeft",
            "UpperCenter",
            "UpperRight",
            "MiddleLeft",
            "MiddleCenter",
            "MiddleRight",
            "LowerLeft",
            "LowerCenter",
            "LowerRight",
          ]);
        case "UnityEngine\0Vector2": {
          let minX = -Infinity;
          let maxX = Infinity;
          let minY = -Infinity;
          let maxY = Infinity;
          const vector2Info = getCustomAttribute(
            PE.MdTableIndex.Field,
            fieldIndex,
            vector2InfoType,
          );
          if (vector2Info) {
            minX = vector2Info.readFloat32LE();
            minY = vector2Info.readFloat32LE();
            maxX = vector2Info.readFloat32LE();
            maxY = vector2Info.readFloat32LE();
          }
          let propX = z.number();
          let propY = z.number();
          if (minX !== -Infinity) {
            propX = propX.min(minX);
          }
          if (maxX !== Infinity) {
            propX = propX.max(maxX);
          }
          if (minY !== -Infinity) {
            propY = propY.min(minY);
          }
          if (maxY !== Infinity) {
            propY = propY.max(maxY);
          }
          return z.tuple([propX, propY]);
        }
      }
      break;
    case 21: {
      switch (signature.readUint8()) {
        case 17:
          switch (getFullNameOfTypeByCodedIndex(signature.readPackedUint())) {
            case "System\0Nullable`1": {
              if (signature.readPackedUint() !== 1) {
                throw new TypeError(
                  "Nullable should have exactly 1 type argument",
                );
              }
              const prop = makeAutoPropertyValue(fieldIndex, signature);
              return prop ? prop.nullable() : null;
            }
          }
          break;
      }
      break;
    }
    case 29: {
      const prop = makeAutoPropertyValue(fieldIndex, signature);
      return prop ? prop.array() : null;
    }
  }
  return null;
};
const makeAutoProperties = (typeDefIndex: number) => {
  const [fieldStart, fieldEnd] = getFieldListByTypeDefIndex(typeDefIndex);
  const props: Record<string, ZodType> = {};
  for (let fieldIndex = fieldStart; fieldIndex < fieldEnd; fieldIndex++) {
    const field = fieldTable[fieldIndex];
    const jsonProperty = getCustomAttribute(
      PE.MdTableIndex.Field,
      fieldIndex,
      jsonPropertyType,
    );
    if (!jsonProperty) {
      continue;
    }
    const name = jsonProperty.readSerString() || getString(field.Name.value);
    const signature = new DataReader(getBlob(field.Signature.value));
    if (signature.readUint8() !== 6) {
      throw new TypeError("Invalid field signature");
    }
    const prop = makeAutoPropertyValue(fieldIndex, signature);
    if (!prop) {
      const typeDef = typeDefTable[typeDefIndex];
      console.warn(`${getString(typeDef.Name.value)}.${name}: Unknown type`);
      continue;
    }
    props[name] = prop.optional();
  }
  return props;
};
export const makeEventBaseProperties = (type: string) => ({
  bar: z.number().int().min(1),
  beat: z.number().min(1),
  y: z.number().int().optional(),
  type: z.literal(type),
  if: ConditionExpression.optional(),
  tag: z.string().optional(),
  active: z.boolean().optional(),
});
export const makeRowProperty = () => ({
  row: z.number().int(),
});
export const makeRoomsProperty = () => ({
  rooms: z.number().int().array().optional(),
});
export const makeEventAutoProperties = (type: string) => {
  const typeDefIndex = getTypeDefIndexByFullName(
    `RDLevelEditor\0LevelEvent_${type}`,
  );
  const levelEventInfo = getCustomAttribute(
    PE.MdTableIndex.TypeDef,
    typeDefIndex,
    levelEventInfoType,
  );
  if (!levelEventInfo) {
    throw new TypeError(`'${type}' does not have LevelEventInfo`);
  }
  levelEventInfo.skip(8);
  const roomsUsage = levelEventInfo.readInt32LE();
  levelEventInfo.skip(1);
  const defaultRow = levelEventInfo.readInt32LE();
  return {
    ...makeEventBaseProperties(type),
    ...defaultRow === -10 ? null : makeRowProperty(),
    ...roomsUsage === 0 ? null : makeRoomsProperty(),
    ...makeAutoProperties(typeDefIndex),
  };
};
export const makeConditionalBaseProperties = (type: string) => ({
  type: z.literal(type),
  tag: z.string().optional(),
  name: z.string(),
  id: z.number().int(),
});
export const makeConditionalAutoProperties = (type: string) => {
  const typeDefIndex = getTypeDefIndexByFullName(
    `RDLevelEditor\0Conditional_${type}`,
  );
  return {
    ...makeConditionalBaseProperties(type),
    ...makeAutoProperties(typeDefIndex),
  };
};
