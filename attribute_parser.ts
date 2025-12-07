import PE from "pe-struct";
import { z, type ZodType } from "zod";

import { requireEnv } from "./env.ts";

const clampInts = false;
const decoder = new TextDecoder(undefined, { fatal: true, ignoreBOM: true });

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
    return this.#view.getUint8(this.#offset) === 255
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

const assemblyPath = requireEnv("RD_ASSEMBLY_PATH");
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
const methodDefTable = assembly.mdtMethodDef!.values;
const customAttributeTable = assembly.mdtCustomAttribute!.values;
const propertyMapTable = assembly.mdtPropertyMap!.values;
const propertyTable = assembly.mdtProperty!.values;
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
const getPropertyListByTypeDefIndex = (
  typeDefIndex: number,
): [number, number] => {
  const index = propertyMapTable
    .findIndex((row) => row.Parent.value - 1 === typeDefIndex);
  return index === -1 ? [0, 0] : [
    propertyMapTable[index].PropertyList.value - 1,
    Math.min(
      (propertyMapTable[index + 1]?.PropertyList.value ?? Infinity) - 1,
      propertyTable.length,
    ),
  ];
};
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
const float2InfoType = getCtorIndexByFullName("\0Float2InfoAttribute");
const vector2InfoType = getCtorIndexByFullName("\0Vector2InfoAttribute");
const descriptionType = getCtorIndexByFullName(
  "RDLevelEditor\0DescriptionAttribute",
);
const buttonType = getCtorIndexByFullName("RDLevelEditor\0ButtonAttribute");
export const ConditionExpression = z.string().or(z.int32().array())
  .meta({ id: "ConditionExpression" });
export const ColorOrPaletteIndex = z.string()
  .regex(/^(?:(?:[0-9A-Fa-f]{2}){3,4}|pal\d+)$/)
  .meta({ id: "ColorOrPaletteIndex" });
export const Expression = z.union([
  z.number(),
  z.string(),
  z.null(),
]).meta({ id: "Expression" });
export const Sound = z.object({
  filename: z.string(),
  volume: z.int32().optional(),
  pitch: z.int32().optional(),
  pan: z.int32().optional(),
  offset: z.int32().optional(),
}).meta({ id: "Sound" });
export const Border = z.enum([
  "None",
  "Outline",
  "Glow",
]).meta({ id: "Border" });
export const ContentMode = z.enum([
  "ScaleToFill",
  "AspectFit",
  "AspectFill",
  "Center",
  "Tiled",
  "Real",
]).meta({ id: "ContentMode" });
export const Hands = z.enum([
  "Left",
  "Right",
  "p1",
  "p2",
  "Both",
]).meta({ id: "Hands" });
export const NarrationCategory = z.enum([
  "Fallback",
  "Navigation",
  "Instruction",
  "Notification",
  "Dialogue",
  "Description",
  "Subtitles",
]).meta({ id: "NarrationCategory" });
export const Player = z.enum(["P1", "P2", "CPU"]).meta({ id: "Player" });
export const SortingLayer = z.enum([
  "Default",
  "Background",
  "Foreground",
]).meta({ id: "SortingLayer" });
export const RowType = z.enum(["Classic", "Oneshot"]).meta({ id: "RowType" });
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
]).meta({ id: "Easing" });
export const FilterMode = z.enum([
  "NearestNeighbor",
  "Bilinear",
]).meta({ id: "FilterMode" });
export const GameSoundType = z.enum([
  "ClapSoundP1Classic",
  "ClapSoundP2Classic",
  "ClapSoundP1Oneshot",
  "ClapSoundP2Oneshot",
  "SmallMistake",
  "BigMistake",
  "Hand1PopSound",
  "Hand2PopSound",
  "HeartExplosion",
  "HeartExplosion2",
  "HeartExplosion3",
  "ClapSoundHoldLongEnd",
  "ClapSoundHoldLongStart",
  "ClapSoundHoldShortEnd",
  "ClapSoundHoldShortStart",
  "PulseSoundHoldStart",
  "PulseSoundHoldShortEnd",
  "PulseSoundHoldEnd",
  "PulseSoundHoldStartAlt",
  "PulseSoundHoldShortEndAlt",
  "PulseSoundHoldEndAlt",
  "ClapSoundCPUClassic",
  "ClapSoundCPUOneshot",
  "ClapSoundHoldLongEndP2",
  "ClapSoundHoldLongStartP2",
  "ClapSoundHoldShortEndP2",
  "ClapSoundHoldShortStartP2",
  "PulseSoundHoldStartP2",
  "PulseSoundHoldShortEndP2",
  "PulseSoundHoldEndP2",
  "PulseSoundHoldStartAltP2",
  "PulseSoundHoldShortEndAltP2",
  "PulseSoundHoldEndAltP2",
  "FreezeshotSoundCueLow",
  "FreezeshotSoundCueHigh",
  "FreezeshotSoundRiser",
  "FreezeshotSoundCymbal",
  "BurnshotSoundCueLow",
  "BurnshotSoundCueHigh",
  "BurnshotSoundRiser",
  "BurnshotSoundCymbal",
  "ClapSoundHold",
  "PulseSoundHold",
  "ClapSoundHoldP2",
  "PulseSoundHoldP2",
  "FreezeshotSound",
  "BurnshotSound",
  "Skipshot",
]).meta({ id: "GameSoundType" });
export const Strength = z.enum([
  "Low",
  "Medium",
  "High",
]).meta({ id: "Strength" });
export const TilingType = z.enum([
  "Scroll",
  "Pulse",
]).meta({ id: "TilingType" });
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
]).meta({ id: "Language" });
const makeAutoPropertyValue = (
  propertyIndex: number,
  signature: DataReader,
): ZodType | null => {
  switch (signature.readUint8()) {
    case 2:
      return z.boolean();
    case 8: {
      let min = -0x80000000;
      let max = 0x7fffffff;
      const intInfo = getCustomAttribute(
        PE.MdTableIndex.Property,
        propertyIndex,
        intInfoType,
      );
      if (intInfo && clampInts) {
        min = intInfo.readInt32LE();
        max = intInfo.readInt32LE();
      }
      return z.int32().min(min).max(max);
    }
    case 12: {
      let min = -Infinity;
      let max = Infinity;
      const floatInfo = getCustomAttribute(
        PE.MdTableIndex.Property,
        propertyIndex,
        floatInfoType,
      );
      if (floatInfo) {
        min = floatInfo.readFloat32LE();
        max = floatInfo.readFloat32LE();
      }
      return z.number().min(min).max(max);
    }
    case 14:
      return z.string();
    case 17:
      switch (getFullNameOfTypeByCodedIndex(signature.readPackedUint())) {
        case "\0AlphaMode":
          return z.enum(["Normal", "Inverted"]);
        case "\0BackgroundType":
          return z.enum(["Color", "Image"]);
        case "\0BorderType":
          return Border;
        case "\0Character":
          return z.string();
        case "\0CharacterReorderType":
          return z.enum(["Smooth", "Instant", "None"]);
        case "\0ColorOrPalette":
          return ColorOrPaletteIndex;
        case "\0ContentMode":
          return ContentMode;
        case "\0EasingType":
          return z.enum(["Repeat", "Mirror"]);
        case "\0EditorShakeType":
          return z.enum(["Normal", "Smooth", "Rotate", "BassDrop"]);
        case "\0Float2": {
          let minX = -Infinity;
          let maxX = Infinity;
          let minY = -Infinity;
          let maxY = Infinity;
          const float2Info = getCustomAttribute(
            PE.MdTableIndex.Property,
            propertyIndex,
            float2InfoType,
          );
          if (float2Info) {
            minX = float2Info.readFloat32LE();
            minY = float2Info.readFloat32LE();
            maxX = float2Info.readFloat32LE();
            maxY = float2Info.readFloat32LE();
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
          return z.tuple([propX.nullable(), propY.nullable()]);
        }
        case "\0FloatExpression":
          return Expression;
        case "\0FloatExpression2":
          return z.tuple([Expression, Expression]);
        case "\0FreezeBurnMode":
          return z.enum(["Freezeshot", "Burnshot"]);
        case "\0GameSoundType":
          return GameSoundType;
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
            "Disabled",
          ]);
        case "\0HoldCueType":
          return z.enum(["Auto", "Early", "Late"]);
        case "\0MaskType":
          return z.enum(["Image", "Room", "Color", "None"]);
        case "\0MoveRowTarget":
          return z.enum(["WholeRow", "Character", "Heart"]);
        case "\0NarrateInfoType":
          return z.enum([
            "Connect",
            "Update",
            "Disconnect",
            "Online",
            "Offline",
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
        case "\0OneshotPulseType":
          return z.enum(["Wave", "Square", "Heart", "Triangle"]);
        case "\0OverrideExpression":
          return z.enum([
            "Neutral",
            "Happy",
            "Barely",
            "Missed",
            "Prehit",
            "Beep",
          ]);
        case "\0PanelSide":
          return z.enum(["Bottom", "Top"]);
        case "\0PivotAnchorType":
          return z.enum([
            "None",
            "LeftEdge",
            "RightEdge",
            "BottomEdge",
            "TopEdge",
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
        case "\0PortraitSide":
          return z.enum(["Left", "Right"]);
        case "\0RDPlayer":
          return z.enum([...Player.options, "NoChange"]);
        case "\0RDSortingLayer":
          return SortingLayer;
        case "\0RDTheme":
        case "\0RDThemeFX":
          return z.unknown();
        case "\0ReferenceType":
          return z.enum(["Center", "Edge"]);
        case "\0RoomSelectType":
          return z.int32().min(0).max(3);
        case "\0RowEffect":
          return z.enum(["None", "Electric"]);
        case "\0RowType":
          return RowType;
        case "\0RowVisibilityMode":
          return z.enum(["Visible", "Hidden", "OnlyCharacter", "OnlyRow"]);
        case "\0SamePresetBehavior":
          return z.enum(["Keep", "Reset"]);
        case "\0SpriteBlendType":
          return z.enum(["None", "Additive", "Multiply", "Invert"]);
        case "\0StutterAction":
          return z.enum(["Add", "Cancel"]);
        case "\0SyncoStyle":
          return z.enum(["Chirp", "Beep"]);
        case "\0TagAction":
          return z.enum([
            "Run",
            "RunAll",
            "Enable",
            "Disable",
            "EnableAll",
            "DisableAll",
          ]);
        case "\0TextExplosionDirection":
          return z.enum(["Left", "Right"]);
        case "\0TextExplosionMode":
          return z.enum(["OneColor", "Random"]);
        case "\0TextureFilter":
          return FilterMode;
        case "\0TilingType":
          return TilingType;
        case "\0TransitionType":
          return z.enum(["Smooth", "Instant", "Full"]);
        case "\0WaveType":
          return z.enum([
            "BoomAndRush",
            "Ball",
            "Spring",
            "Spike",
            "SpikeHuge",
            "Single",
          ]);
        case "\0WindowDancePreset":
          return z.enum(["Move", "Sway", "Wrap", "Ellipse", "ShakePer"]);
        case "DG.Tweening\0Ease":
          return Easing;
        case "RDLevelEditor\0CountingVoiceSource":
          return z.enum([
            "JyiCount",
            "JyiCountFast",
            "JyiCountCalm",
            "JyiCountTired",
            "JyiCountVeryTired",
            "JyiCountEnglish",
            "JyiCountJapanese",
            "IanCount",
            "IanCountFast",
            "IanCountCalm",
            "IanCountSlow",
            "IanCountSlower",
            "IanCountEnglish",
            "IanCountEnglishFast",
            "IanCountEnglishCalm",
            "IanCountEnglishSlow",
            "WhistleCount",
            "BirdCount",
            "ParrotCount",
            "OwlCount",
            "OrioleCount",
            "WrenCount",
            "CanaryCount",
            "SpearCount",
            "JyiCountLegacy",
            "Custom",
          ]);
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
        case "RDLevelEditor\0GameVoiceSource":
          return z.enum([
            "Nurse",
            "NurseTired",
            "NurseSwing",
            "NurseSwingCalm",
            "IanExcited",
            "IanCalm",
            "IanSlow",
            "NoneBottom",
            "NoneTop",
          ]);
        case "RDLevelEditor\0LevelEventExecutionTime":
          return z.enum(["OnPrebar", "OnBar"]);
        case "RDLevelEditor\0NarrateSkipBeats":
          return z.enum(["On", "Custom", "Off"]);
        case "RDLevelEditor\0OneshotPhraseToSay":
          return z.enum([
            "SayReaDyGetSetGoNew",
            "SayGetSetGo",
            "SayReaDyGetSetOne",
            "SayGetSetOne",
            "JustSayRea",
            "JustSayDy",
            "JustSayGet",
            "JustSaySet",
            "JustSayAnd",
            "JustSayGo",
            "JustSayStop",
            "JustSayAndStop",
            "SaySwitch",
            "SayWatch",
            "SayListen",
            "Count1",
            "Count2",
            "Count3",
            "Count4",
            "Count5",
            "Count6",
            "Count7",
            "Count8",
            "Count9",
            "Count10",
            "SayReadyGetSetGo",
            "JustSayReady",
          ]);
        case "RDLevelEditor\0PivotMode":
          return z.enum(["Default", "AnchorEdge"]);
        case "RDLevelEditor\0PlayerMode":
          return z.enum(["OnePlayer", "TwoPlayers", "OneOrTwoPlayers"]);
        case "RDLevelEditor\0PulseAction":
          return z.enum(["Increment", "Decrement", "Custom", "Remove"]);
        case "RDLevelEditor\0SetXs":
          return z.enum(["ThreeBeat", "FourBeat"]);
        case "RDLevelEditor\0SimpleDuration":
          return z.enum(["Short", "Medium", "Long"]);
        case "RDLevelEditor\0SoundDataStruct":
          return Sound;
        case "RDLevelEditor\0SpinningRowsAction":
          return z.enum([
            "Connect",
            "Disconnect",
            "Rotate",
            "ConstantRotation",
            "WavyRotation",
            "Merge",
            "Split",
          ]);
        case "RDLevelEditor\0StrengthLevel":
          return Strength;
        case "RDLevelEditor\0WindowContentMode":
          return z.enum(["OnTop", "Room"]);
        case "RDLevelEditor\0WindowNameAction":
          return z.enum(["Set", "Append", "Reset"]);
        case "RDLevelEditor\0ZoomMode":
          return z.enum(["Fill", "Fit", "None"]);
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
            PE.MdTableIndex.Property,
            propertyIndex,
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
              const prop = makeAutoPropertyValue(propertyIndex, signature);
              return prop && prop.nullable();
            }
          }
          break;
      }
      break;
    }
    case 29: {
      const prop = makeAutoPropertyValue(propertyIndex, signature);
      return prop && prop.array();
    }
  }
  return null;
};
const makeAutoProperties = (typeDefIndex: number) => {
  const [propertyStart, propertyEnd] = getPropertyListByTypeDefIndex(
    typeDefIndex,
  );
  const props: Record<string, ZodType> = {};
  for (
    let propertyIndex = propertyStart;
    propertyIndex < propertyEnd;
    propertyIndex++
  ) {
    const property = propertyTable[propertyIndex];
    const jsonProperty = getCustomAttribute(
      PE.MdTableIndex.Property,
      propertyIndex,
      jsonPropertyType,
    );
    if (
      !jsonProperty ||
      getCustomAttribute(
        PE.MdTableIndex.Property,
        propertyIndex,
        descriptionType,
      ) ||
      getCustomAttribute(
        PE.MdTableIndex.Property,
        propertyIndex,
        buttonType,
      )
    ) {
      continue;
    }
    const name = jsonProperty.readSerString() || getString(property.Name.value);
    const signature = new DataReader(getBlob(property.Type.value));
    if (signature.readUint8() !== 40 || signature.readPackedUint() !== 0) {
      throw new TypeError("Invalid instance property signature");
    }
    const prop = makeAutoPropertyValue(propertyIndex, signature);
    if (!prop) {
      const typeDef = typeDefTable[typeDefIndex];
      console.warn(`${getString(typeDef.Name.value)}.${name}: Unknown type`);
      props[name] = z.any().describe("unknown type");
      continue;
    }
    props[name] = prop.optional();
  }
  return props;
};
export const makeEventAutoProperties = (
  type: string,
  fixedY?: boolean,
): Record<string, ZodType> => {
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
  const hasBar = levelEventInfo.readUint8() !== 0;
  const hasBeat = levelEventInfo.readUint8() !== 0;
  const hasType = levelEventInfo.readUint8() !== 0;
  const hasTarget = levelEventInfo.readUint8() !== 0;
  const defaultRow = levelEventInfo.readInt32LE();
  const hasY = !fixedY && !hasTarget;
  const hasRow = defaultRow !== -10;
  const hasRooms = roomsUsage !== 0;
  return {
    ...hasBar ? { bar: z.int32().min(1).optional() } : null,
    ...hasBeat ? { beat: z.number().min(1).optional() } : null,
    ...hasY ? { y: z.int32().optional() } : null,
    ...hasType ? { type: z.literal(type) } : null,
    if: ConditionExpression.optional(),
    tag: z.string().optional(),
    runTag: z.boolean().optional(),
    active: z.boolean().optional(),
    ...hasRooms ? { rooms: z.int32().array().optional() } : null,
    ...hasRow ? { row: z.int32() } : null,
    ...hasTarget ? { target: z.string() } : null,
    ...makeAutoProperties(typeDefIndex),
  };
};
export const makeConditionalAutoProperties = (
  type: string,
): Record<string, ZodType> => {
  const typeDefIndex = getTypeDefIndexByFullName(
    `RDLevelEditor\0Conditional_${type}`,
  );
  return {
    type: z.literal(type),
    tag: z.string().optional(),
    name: z.string(),
    id: z.int32(),
    ...makeAutoProperties(typeDefIndex),
  };
};
