import { z, ZodOptional, type ZodType } from "zod";

import {
  Border,
  ColorOrPaletteIndex,
  ConditionExpression,
  ContentMode,
  Easing,
  Expression,
  FilterMode,
  GameSoundType,
  Hands,
  Language,
  makeConditionalAutoProperties,
  makeEventAutoProperties,
  NarrationCategory,
  Player,
  RowType,
  Sound,
  Strength,
  TilingType,
} from "./attribute_parser.ts";

export {
  Border,
  ColorOrPaletteIndex,
  ConditionExpression,
  ContentMode,
  Easing,
  Expression,
  FilterMode,
  GameSoundType,
  Hands,
  Language,
  NarrationCategory,
  Player,
  RowType,
  Sound,
  Strength,
  TilingType,
};
type Shape = Readonly<Record<string, ZodType | [override: ZodType] | []>>;
const mergeShapes = (...shapes: [Shape, Shape, ...Shape[]]) => {
  interface MergeContext {
    optional: boolean;
    subtypes: ZodType[];
  }

  // deno-lint-ignore ban-types
  const contexts: Record<string, MergeContext> = { __proto__: null } as {};
  const addToContext = (ctx: MergeContext, type: ZodType) => {
    while (type instanceof ZodOptional) {
      ctx.optional = true;
      type = type.unwrap() as ZodType;
    }
    ctx.subtypes.push(type);
  };
  for (const shape of shapes) {
    for (const key of Object.keys(shape)) {
      let value = shape[key];
      if (!value) {
        continue;
      }
      let override = !contexts[key];
      if (Array.isArray(value)) {
        if (value.length === 0) {
          delete contexts[key];
          continue;
        }
        value = value[0];
        override = true;
      }
      if (override) {
        contexts[key] = { optional: false, subtypes: [] };
      }
      addToContext(contexts[key], value);
    }
  }
  const union = (types: readonly ZodType[]) => {
    switch (types.length) {
      case 0:
        return z.never();
      case 1:
        return types[0];
      default:
        return z.union(types as readonly [ZodType, ZodType, ...ZodType[]]);
    }
  };
  return Object.fromEntries(
    Object.entries(contexts).map(([key, { optional, subtypes }]) => {
      const type = union(subtypes);
      return [key, optional ? type.optional() : type];
    }),
  );
};
const mergeShapesToObject = (...shapes: [Shape, Shape, ...Shape[]]) =>
  z.object(mergeShapes(...shapes));
export const Settings = z.object({
  version: z.int32(),
  artist: z.string().max(256).optional(),
  song: z.string().max(256).optional(),
  specialArtistType: z.enum(["None", "AuthorIsArtist", "PublicLicense"])
    .optional(),
  artistPermission: z.string().optional(),
  artistLinks: z.string().optional(),
  author: z.string().max(256).optional(),
  difficulty: z.enum(["Easy", "Medium", "Tough", "VeryTough"]).optional(),
  seizureWarning: z.boolean().optional(),
  previewImage: z.string().optional(),
  syringeIcon: z.string().optional(),
  previewSong: z.string().optional(),
  previewSongStartTime: z.number().optional(),
  previewSongDuration: z.number().optional(),
  songNameHue: z.number().optional(),
  songLabelGrayscale: z.boolean().optional(),
  description: z.string().max(1000).optional(),
  tags: z.string().optional(),
  separate2PLevelFilename: z.string().optional(),
  canBePlayedOn: z.enum(["OnePlayerOnly", "TwoPlayerOnly", "BothModes"])
    .optional(),
  firstBeatBehavior: z.enum(["RunNormally", "RunEventsOnPrebar"]).optional(),
  customClass: z.string().optional(),
  inkFile: z.string().optional(),
  multiplayerAppearance: z.enum(["HorizontalStrips", "Nothing"]).optional(),
  levelVolume: z.number().optional(),
  rankMaxMistakes: z.int32().array().length(4),
  mods: z.string().array().or(z.string()).optional(),
  rankDescription: z.string().array().length(6),
}).meta({ id: "Settings" });
export const Row = mergeShapesToObject(
  makeEventAutoProperties("MakeRow", true),
  {
    character: [z.string()],
    player: [Player.optional()],
    pulseSound: z.string(),
    pulseSoundVolume: z.int32().optional(),
    pulseSoundPitch: z.int32().optional(),
    pulseSoundPan: z.int32().optional(),
    pulseSoundOffset: z.int32().optional(),
  },
).meta({ id: "Row" });
export const Decoration = z.object(
  makeEventAutoProperties("MakeSprite", true),
).meta({ id: "Decoration" });
const makeLegacySoundProperties = (prefix?: string) => {
  const filenameKey = prefix === undefined ? "filename" : `${prefix}Filename`;
  const soundKey = prefix === undefined ? "sound" : `${prefix}Sound`;
  const offsetKey = prefix === undefined ? "offset" : `${prefix}Offset`;
  const volumeKey = prefix === undefined ? "volume" : `${prefix}Volume`;
  const pitchKey = prefix === undefined ? "pitch" : `${prefix}Pitch`;
  const panKey = prefix === undefined ? "pan" : `${prefix}Pan`;
  return {
    [filenameKey]: z.string().optional(),
    [soundKey]: z.string().optional(),
    [offsetKey]: z.int32().optional(),
    [volumeKey]: z.int32().optional(),
    [pitchKey]: z.int32().optional(),
    [panKey]: z.int32().optional(),
  };
};
export const PlaySongEvent = mergeShapesToObject(
  makeEventAutoProperties("PlaySong"),
  makeLegacySoundProperties(),
).meta({ id: "PlaySongEvent" });
export const SetCrotchetsPerBarEvent = z.object(
  makeEventAutoProperties("SetCrotchetsPerBar"),
).meta({ id: "SetCrotchetsPerBarEvent" });
export const PlaySoundEvent = mergeShapesToObject(
  makeEventAutoProperties("PlaySound"),
  makeLegacySoundProperties(),
).meta({ id: "PlaySoundEvent" });
export const SetBeatsPerMinuteEvent = z.object(
  makeEventAutoProperties("SetBeatsPerMinute"),
).meta({ id: "SetBeatsPerMinuteEvent" });
export const SetClapSoundsEvent = mergeShapesToObject(
  makeEventAutoProperties("SetClapSounds"),
  {
    p1Sound: [Sound.nullable().optional()],
    p2Sound: [Sound.nullable().optional()],
    cpuSound: [Sound.nullable().optional()],
  },
  makeLegacySoundProperties("p1"),
  makeLegacySoundProperties("p2"),
  makeLegacySoundProperties("cpu"),
  {
    p1Used: z.boolean().optional(),
    p2Used: z.boolean().optional(),
    cpuUsed: z.boolean().optional(),
  },
).meta({ id: "SetClapSoundsEvent" });
export const SetHeartExplodeVolumeEvent = z.object(
  makeEventAutoProperties("SetHeartExplodeVolume"),
).meta({ id: "SetHeartExplodeVolumeEvent" });
export const SetHeartExplosionIntervalEvent = z.object(
  makeEventAutoProperties("SetHeartExplodeInterval"),
).meta({ id: "SetHeartExplosionIntervalEvent" });
export const SayReadyGetSetGoEvent = z.object(
  makeEventAutoProperties("SayReadyGetSetGo"),
).meta({ id: "SayReadyGetSetGoEvent" });
export const SetSingleGameSoundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetGameSound"),
  {
    filename: z.string().optional(),
    volume: z.int32().optional(),
    pitch: z.int32().optional(),
    pan: z.int32().optional(),
    offset: z.int32().optional(),
  },
).meta({ id: "SetSingleGameSoundEvent" });
export const SetGameSoundGroupEvent = mergeShapesToObject(
  makeEventAutoProperties("SetGameSound"),
  {
    soundSubtypes: z.object({
      groupSubtype: GameSoundType.optional(),
      used: z.boolean().optional(),
      filename: z.string().optional(),
      volume: z.int32().optional(),
      pitch: z.int32().optional(),
      pan: z.int32().optional(),
      offset: z.int32().optional(),
    }).array(),
  },
).meta({ id: "SetGameSoundGroupEvent" });
export const SetGameSoundEvent = z.union([
  SetSingleGameSoundEvent,
  SetGameSoundGroupEvent,
]).meta({ id: "SetGameSoundEvent" });
export const SetBeatSoundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetBeatSound"),
  makeLegacySoundProperties(),
).meta({ id: "SetBeatSoundEvent" });
export const SetCountingSoundEvent = z.object(
  makeEventAutoProperties("SetCountingSound"),
).meta({ id: "SetCountingSoundEvent" });
export const ReadNarrationEvent = z.object(
  makeEventAutoProperties("ReadNarration"),
).meta({ id: "ReadNarrationEvent" });
export const NarrateRowInfoEvent = mergeShapesToObject(
  makeEventAutoProperties("NarrateRowInfo"),
  {
    customPattern: [z.string().regex(/^[-x]{6}$/).optional()],
    customPlayer: [z.enum(["AutoDetect", "P1", "P2"])],
  },
).meta({ id: "NarrateRowInfoEvent" });
export const SoundEvent = z.union([
  PlaySongEvent,
  SetCrotchetsPerBarEvent,
  PlaySoundEvent,
  SetBeatsPerMinuteEvent,
  SetClapSoundsEvent,
  SetHeartExplodeVolumeEvent,
  SetHeartExplosionIntervalEvent,
  SayReadyGetSetGoEvent,
  SetGameSoundEvent,
  SetBeatSoundEvent,
  SetCountingSoundEvent,
  ReadNarrationEvent,
  NarrateRowInfoEvent,
]).meta({ id: "SoundEvent" });
export const AddClassicBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("AddClassicBeat"),
  { swing: [z.number().min(0).optional()] },
).meta({ id: "AddClassicBeatEvent" });
export const SetBeatModifiersEvent = mergeShapesToObject(
  makeEventAutoProperties("SetRowXs"),
  { pattern: [z.string().regex(/^[-xudbr]{6}$/).optional()] },
).meta({ id: "SetBeatModifiersEvent" });
export const AddFreeTimeBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("AddFreeTimeBeat"),
  { pulse: [z.int32().min(0).max(6).optional()] },
).meta({ id: "AddFreeTimeBeatEvent" });
export const PulseFreeTimeBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("PulseFreeTimeBeat"),
  { customPulse: [z.int32().min(0).max(6).optional()] },
).meta({ id: "PulseFreeTimeBeatEvent" });
export const AddOneshotBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("AddOneshotBeat"),
  {
    interval: [z.number().min(0).optional()],
    tick: [z.number().min(0).optional()],
    delay: [z.number().min(0).optional()],
    loops: [z.int32().min(0).optional()],
    subdivisions: [z.int32().min(1).max(10).optional()],
    squareSound: z.boolean().optional(),
  },
).meta({ id: "AddOneshotBeatEvent" });
export const SetOneshotWaveEvent = z.object(
  makeEventAutoProperties("SetOneshotWave"),
).meta({ id: "SetOneshotWaveEvent" });
export const RowEvent = z.union([
  AddClassicBeatEvent,
  SetBeatModifiersEvent,
  AddFreeTimeBeatEvent,
  PulseFreeTimeBeatEvent,
  AddOneshotBeatEvent,
  SetOneshotWaveEvent,
]).meta({ id: "RowEvent" });
export const SetThemeEvent = mergeShapesToObject(
  makeEventAutoProperties("SetTheme"),
  { firstRowOnFloor: [] },
).meta({ id: "SetThemeEvent" });
export const OrdinaryVFXPreset = z.enum([
  "SilhouettesOnHBeat",
  "Vignette",
  "VignetteFlicker",
  "ColourfulShockwaves",
  "BassDropOnHit",
  "ShakeOnHeartBeat",
  "ShakeOnHit",
  "Tile2",
  "Tile3",
  "Tile4",
  "LightStripVert",
  "VHS",
  "ScreenScrollX",
  "ScreenScroll",
  "ScreenScrollXSansVHS",
  "ScreenScrollSansVHS",
  "RowGlowWhite",
  "RowOutline",
  "RowShadow",
  "RowAllWhite",
  "RowSilhouetteGlow",
  "RowPlain",
  "CutsceneMode",
  "Blackout",
  "Noise",
  "GlitchObstruction",
  "Matrix",
  "MiawMiaw",
  "Confetti",
  "FallingPetals",
  "FallingPetalsInstant",
  "FallingPetalsSnow",
  "Snow",
  "OrangeBloom",
  "BlueBloom",
  "HallOfMirrors",
  "BlackAndWhite",
  "Sepia",
  "NumbersAbovePulses",
  "Funk",
  "Balloons",
]);
export const EnableOrdinaryVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    enable: [z.literal(true).optional()],
    preset: [OrdinaryVFXPreset.optional()],
    threshold: [],
    intensity: [],
    color: [],
    speed: [],
    speedPerc: [],
    duration: [],
    ease: [],
  },
).meta({ id: "EnableOrdinaryVFXPresetEvent" });
export const EaseableVFXPreset = z.enum([
  "HueShift",
  "Brightness",
  "Contrast",
  "Saturation",
  "Rain",
  "JPEG",
  "Mosaic",
  "ScreenWaves",
  "Grain",
  "Blizzard",
  "Drawing",
  "Aberration",
  "Blur",
  "RadialBlur",
  "Fisheye",
  "Dots",
]);
export const EnableEaseableVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [EaseableVFXPreset],
    enable: [z.literal(true).optional()],
    threshold: [],
    color: [],
    speed: [],
    speedPerc: [],
  },
).meta({ id: "EnableEaseableVFXPresetEvent" });
export const ColoredVFXPreset = z.enum(["Diamonds", "Tutorial"]);
export const EnableColoredVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [ColoredVFXPreset],
    enable: [z.literal(true).optional()],
    threshold: [],
    speed: [],
    speedPerc: [],
  },
).meta({ id: "EnableColoredVFXPresetEvent" });
export const WavyRowsVFXPreset = z.enum(["WavyRows"]);
export const EnableWavyRowsVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [WavyRowsVFXPreset],
    enable: [z.literal(true).optional()],
    threshold: [],
    color: [],
    speed: [],
  },
).meta({ id: "EnableWavyRowsVFXPresetEvent" });
export const BloomVFXPreset = z.enum(["Bloom"]);
export const EnableBloomVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [BloomVFXPreset],
    enable: [z.literal(true).optional()],
    speed: [],
    speedPerc: [],
  },
).meta({ id: "EnableBloomVFXPresetEvent" });
export const ScreenVFXPreset = z.enum(["TileN", "CustomScreenScroll"]);
export const EnableScreenVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [ScreenVFXPreset],
    enable: [z.literal(true).optional()],
    threshold: [],
    intensity: [],
    color: [],
    floatX: z.number().optional(),
    floatY: z.number().optional(),
    speedPerc: [],
  },
).meta({ id: "EnableScreenVFXPresetEvent" });
export const DisableVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [
      z.enum([
        ...OrdinaryVFXPreset.options,
        ...EaseableVFXPreset.options,
        ...ColoredVFXPreset.options,
        ...WavyRowsVFXPreset.options,
        ...BloomVFXPreset.options,
        ...ScreenVFXPreset.options,
      ]).optional(),
    ],
    enable: [z.literal(false)],
    threshold: [],
    intensity: [],
    color: [],
    speed: [],
    speedPerc: [],
    duration: [],
    ease: [],
  },
).meta({ id: "DisableVFXPresetEvent" });
export const DisableAllVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [z.literal("DisableAll")],
    enable: [],
    threshold: [],
    intensity: [],
    color: [],
    speed: [],
    speedPerc: [],
    duration: [],
    ease: [],
  },
).meta({ id: "DisableAllVFXPresetEvent" });
export const SetVFXPresetEvent = z.union([
  EnableOrdinaryVFXPresetEvent,
  EnableEaseableVFXPresetEvent,
  EnableColoredVFXPresetEvent,
  EnableWavyRowsVFXPresetEvent,
  EnableBloomVFXPresetEvent,
  EnableScreenVFXPresetEvent,
  DisableVFXPresetEvent,
  DisableAllVFXPresetEvent,
]).meta({ id: "SetVFXPresetEvent" });
export const ImageSequence = z.string().array().or(z.string())
  .meta({ id: "ImageSequence" });
export const SetBackgroundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetBackgroundColor"),
  {
    image: [ImageSequence.optional()],
    scrollX: z.number().optional(),
    scrollY: z.number().optional(),
  },
).meta({ id: "SetBackgroundEvent" });
export const SetForegroundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetForeground"),
  {
    image: [ImageSequence.optional()],
    scrollX: z.number().optional(),
    scrollY: z.number().optional(),
  },
).meta({ id: "SetForegroundEvent" });
export const SetSpeedEvent = z.object(
  makeEventAutoProperties("SetSpeed"),
).meta({ id: "SetSpeedEvent" });
export const FlashEvent = z.object(
  makeEventAutoProperties("Flash"),
).meta({ id: "FlashEvent" });
export const CustomFlashEvent = z.object(
  makeEventAutoProperties("CustomFlash"),
).meta({ id: "CustomFlashEvent" });
export const MoveCameraEvent = mergeShapesToObject(
  makeEventAutoProperties("MoveCamera"),
  { zoom: [z.int32().min(1).max(9999).optional()] },
).meta({ id: "MoveCameraEvent" });
export const HideRowEvent = mergeShapesToObject(
  makeEventAutoProperties("HideRow"),
  { show: z.boolean() },
).meta({ id: "HideRowEvent" });
export const MoveRowEvent = z.object(
  makeEventAutoProperties("MoveRow"),
).meta({ id: "MoveRowEvent" });
export const ReorderRowEvent = z.object(
  makeEventAutoProperties("ReorderRow"),
).meta({ id: "ReorderRowEvent" });
export const PlayExpressionEvent = z.object(
  makeEventAutoProperties("PlayExpression"),
).meta({ id: "PlayExpressionEvent" });
export const ChangeCharacterEvent = z.object(
  makeEventAutoProperties("ChangeCharacter"),
).meta({ id: "ChangeCharacterEvent" });
export const PaintRowsEvent = z.object(
  makeEventAutoProperties("TintRows"),
).meta({ id: "PaintRowsEvent" });
export const BassDropEvent = z.object(
  makeEventAutoProperties("BassDrop"),
).meta({ id: "BassDropEvent" });
export const CustomShakeEvent = z.object(
  makeEventAutoProperties("ShakeScreenCustom"),
).meta({ id: "CustomShakeEvent" });
export const ShakeScreenEvent = z.object(
  makeEventAutoProperties("ShakeScreen"),
).meta({ id: "ShakeScreenEvent" });
export const FlipScreenEvent = mergeShapesToObject(
  makeEventAutoProperties("FlipScreen"),
  {
    x: z.boolean().optional(),
    y: z.boolean().optional(),
    flipX: z.boolean().optional(),
    flipY: z.boolean().optional(),
    flip: [z.boolean().array().length(2).optional()],
  },
).meta({ id: "FlipScreenEvent" });
export const InvertColorsEvent = z.object(
  makeEventAutoProperties("InvertColors"),
).meta({ id: "InvertColorsEvent" });
export const PulseCameraEvent = z.object(
  makeEventAutoProperties("PulseCamera"),
).meta({ id: "PulseCameraEvent" });
export const TextExplosionEvent = z.object(
  makeEventAutoProperties("TextExplosion"),
).meta({ id: "TextExplosionEvent" });
export const ShowDialogueEvent = mergeShapesToObject(
  makeEventAutoProperties("ShowDialogue"),
  {
    ...Object.fromEntries(Language.options.map((language) => [
      `text${language}`,
      z.string().optional(),
    ])),
  },
).meta({ id: "ShowDialogueEvent" });
export const ShowStatusSignEvent = z.object(
  makeEventAutoProperties("ShowStatusSign"),
).meta({ id: "ShowStatusSignEvent" });
export const FloatingTextEvent = mergeShapesToObject(
  makeEventAutoProperties("FloatingText"),
  { times: [z.string().nullable().optional()] },
).meta({ id: "FloatingTextEvent" });
export const AdvanceFloatingTextEvent = z.object(
  makeEventAutoProperties("AdvanceText"),
).meta({ id: "AdvanceFloatingTextEvent" });
export const ChangePlayersRowsEvent = z.object(
  makeEventAutoProperties("ChangePlayersRows"),
).meta({ id: "ChangePlayersRowsEvent" });
export const FinishLevelEvent = z.object(
  makeEventAutoProperties("FinishLevel"),
).meta({ id: "FinishLevelEvent" });
export const OrdinaryCommentEvent = mergeShapesToObject(
  makeEventAutoProperties("Comment"),
  { text: [z.string()], tab: z.enum(["Song", "Actions", "Rooms"]).optional() },
).meta({ id: "OrdinaryCommentEvent" });
export const SpriteCommentEvent = mergeShapesToObject(
  makeEventAutoProperties("Comment"),
  { text: [z.string()], tab: z.literal("Sprites"), target: z.string() },
).meta({ id: "SpriteCommentEvent" });
export const CommentEvent = z.union([
  OrdinaryCommentEvent,
  SpriteCommentEvent,
]).meta({ id: "CommentEvent" });
export const ShowHandsEvent = z.object(
  makeEventAutoProperties("ShowHands"),
).meta({ id: "ShowHandsEvent" });
export const PaintHandsEvent = z.object(
  makeEventAutoProperties("PaintHands"),
).meta({ id: "PaintHandsEvent" });
export const AssignHandsEvent = z.object(
  makeEventAutoProperties("SetHandOwner"),
).meta({ id: "AssignHandsEvent" });
export const TagActionEvent = mergeShapesToObject(
  makeEventAutoProperties("TagAction"),
  { Tag: [z.string()] },
).meta({ id: "TagActionEvent" });
export const SetPlayStyleEvent = z.object(
  makeEventAutoProperties("SetPlayStyle"),
).meta({ id: "SetPlayStyleEvent" });
export const StutterEvent = z.object(
  makeEventAutoProperties("Stutter"),
).meta({ id: "StutterEvent" });
export const CallCustomMethodEvent = mergeShapesToObject(
  makeEventAutoProperties("CallCustomMethod"),
  { methodName: [z.string()] },
).meta({ id: "CallCustomMethodEvent" });
export const WindowDanceEvent = mergeShapesToObject(
  makeEventAutoProperties("NewWindowDance"),
  { usePosition: z.enum(["New", "Current"]).optional() },
).meta({ id: "WindowDanceEvent" });
export const ResizeWindowEvent = z.object(
  makeEventAutoProperties("WindowResize"),
).meta({ id: "ResizeWindowEvent" });
export const ActionEvent = z.union([
  SetThemeEvent,
  SetVFXPresetEvent,
  SetBackgroundEvent,
  SetForegroundEvent,
  SetSpeedEvent,
  FlashEvent,
  CustomFlashEvent,
  MoveCameraEvent,
  HideRowEvent,
  MoveRowEvent,
  ReorderRowEvent,
  PlayExpressionEvent,
  ChangeCharacterEvent,
  PaintRowsEvent,
  BassDropEvent,
  CustomShakeEvent,
  ShakeScreenEvent,
  FlipScreenEvent,
  InvertColorsEvent,
  PulseCameraEvent,
  TextExplosionEvent,
  ShowDialogueEvent,
  ShowStatusSignEvent,
  FloatingTextEvent,
  AdvanceFloatingTextEvent,
  ChangePlayersRowsEvent,
  FinishLevelEvent,
  CommentEvent,
  ShowHandsEvent,
  PaintHandsEvent,
  AssignHandsEvent,
  TagActionEvent,
  SetPlayStyleEvent,
  StutterEvent,
  CallCustomMethodEvent,
  WindowDanceEvent,
  ResizeWindowEvent,
]).meta({ id: "ActionEvent" });
export const MoveSpriteEvent = z.object(
  makeEventAutoProperties("Move"),
).meta({ id: "MoveSpriteEvent" });
export const PaintSpriteEvent = mergeShapesToObject(
  makeEventAutoProperties("Tint"),
  { borderOpacity: z.int32().optional(), tintOpacity: z.int32().optional() },
).meta({ id: "PaintSpriteEvent" });
export const PlayAnimationEvent = z.object(
  makeEventAutoProperties("PlayAnimation"),
).meta({ id: "PlayAnimationEvent" });
export const HideSpriteEvent = z.object(
  makeEventAutoProperties("SetVisible"),
).meta({ id: "HideSpriteEvent" });
export const ReorderSpriteEvent = z.object(
  makeEventAutoProperties("ReorderSprite"),
).meta({ id: "ReorderSpriteEvent" });
export const TileSpriteEvent = z.object(
  makeEventAutoProperties("Tile"),
).meta({ id: "TileSpriteEvent" });
export const BlendSpriteEvent = z.object(
  makeEventAutoProperties("Blend"),
).meta({ id: "BlendSpriteEvent" });
export const DecorationEvent = z.union([
  MoveSpriteEvent,
  PaintSpriteEvent,
  PlayAnimationEvent,
  HideSpriteEvent,
  ReorderSpriteEvent,
  TileSpriteEvent,
  BlendSpriteEvent,
]).meta({ id: "DecorationEvent" });
export const ShowRoomsHorizontallyEvent = z.object(
  makeEventAutoProperties("ShowRooms"),
).meta({ id: "ShowRoomsHorizontallyEvent" });
export const MoveRoomEvent = z.object(
  makeEventAutoProperties("MoveRoom"),
).meta({ id: "MoveRoomEvent" });
export const ReorderRoomsEvent = z.object(
  makeEventAutoProperties("ReorderRooms"),
).meta({ id: "ReorderRoomsEvent" });
export const SetRoomContentModeEvent = z.object(
  makeEventAutoProperties("SetRoomContentMode"),
).meta({ id: "SetRoomContentModeEvent" });
export const MaskRoomEvent = mergeShapesToObject(
  makeEventAutoProperties("MaskRoom"),
  { image: [ImageSequence.optional()] },
).meta({ id: "MaskRoomEvent" });
export const FadeRoomEvent = z.object(
  makeEventAutoProperties("FadeRoom"),
).meta({ id: "FadeRoomEvent" });
export const SetRoomPerspectiveEvent = mergeShapesToObject(
  makeEventAutoProperties("SetRoomPerspective"),
  {
    cornerPositions: [
      z.number().min(-10000).max(10000).nullable()
        .array().length(2).array().length(4),
    ],
  },
).meta({ id: "SetRoomPerspectiveEvent" });
export const RoomEvent = z.union([
  ShowRoomsHorizontallyEvent,
  MoveRoomEvent,
  ReorderRoomsEvent,
  SetRoomContentModeEvent,
  MaskRoomEvent,
  FadeRoomEvent,
  SetRoomPerspectiveEvent,
]).meta({ id: "RoomEvent" });
export const Event = z.union([
  SoundEvent,
  RowEvent,
  ActionEvent,
  DecorationEvent,
  RoomEvent,
]).meta({ id: "Event" });
export const LastHitConditional = z.object(
  makeConditionalAutoProperties("LastHit"),
).meta({ id: "LastHitConditional" });
export const CustomConditional = mergeShapesToObject(
  makeConditionalAutoProperties("Custom"),
  { expression: [z.string()] },
).meta({ id: "CustomConditional" });
export const TimesExecutedConditional = z.object(
  makeConditionalAutoProperties("TimesExecuted"),
).meta({ id: "TimesExecutedConditional" });
export const LanguageConditional = mergeShapesToObject(
  makeConditionalAutoProperties("Language"),
  { Language: [Language] },
).meta({ id: "LanguageConditional" });
export const PlayerModeConditional = z.object(
  makeConditionalAutoProperties("PlayerMode"),
).meta({ id: "PlayerModeConditional" });
export const Conditional = z.union([
  LastHitConditional,
  CustomConditional,
  TimesExecutedConditional,
  LanguageConditional,
  PlayerModeConditional,
]).meta({ id: "Conditional" });
export const Bookmark = z.object({
  bar: z.int32().min(1),
  beat: z.number().min(1),
  color: z.int32(),
}).meta({ id: "Bookmark" });
export const Color = z.string().regex(/^(?:[0-9A-Fa-f]{2}){3,4}$/)
  .meta({ id: "Color" });
export const Level = z.object({
  $schema: z.url().optional(),
  settings: Settings.optional(),
  rows: Row.array(),
  decorations: Decoration.array().optional(),
  events: Event.array(),
  conditionals: Conditional.array().optional(),
  bookmarks: Bookmark.array().optional(),
  colorPalette: Color.array().max(21).optional(),
}).meta({ id: "Level" });
