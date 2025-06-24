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
      type = type.unwrap();
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
  version: z.number().int(),
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
  rankMaxMistakes: z.number().int().array().length(4),
  mods: z.string().array().or(z.string()).optional(),
  rankDescription: z.string().array().length(6),
});
export const Row = mergeShapesToObject(
  makeEventAutoProperties("MakeRow", true),
  {
    character: [z.string()],
    player: [Player.optional()],
    pulseSound: z.string(),
    pulseSoundVolume: z.number().int().optional(),
    pulseSoundPitch: z.number().int().optional(),
    pulseSoundPan: z.number().int().optional(),
    pulseSoundOffset: z.number().int().optional(),
  },
);
export const Decoration = z.object(
  makeEventAutoProperties("MakeSprite", true),
);
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
    [offsetKey]: z.number().int().optional(),
    [volumeKey]: z.number().int().optional(),
    [pitchKey]: z.number().int().optional(),
    [panKey]: z.number().int().optional(),
  };
};
export const PlaySongEvent = mergeShapesToObject(
  makeEventAutoProperties("PlaySong"),
  makeLegacySoundProperties(),
);
export const SetCrotchetsPerBarEvent = z.object(
  makeEventAutoProperties("SetCrotchetsPerBar"),
);
export const PlaySoundEvent = mergeShapesToObject(
  makeEventAutoProperties("PlaySound"),
  makeLegacySoundProperties(),
);
export const SetBeatsPerMinuteEvent = z.object(
  makeEventAutoProperties("SetBeatsPerMinute"),
);
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
);
export const SetHeartExplodeVolumeEvent = z.object(
  makeEventAutoProperties("SetHeartExplodeVolume"),
);
export const SetHeartExplosionIntervalEvent = z.object(
  makeEventAutoProperties("SetHeartExplodeInterval"),
);
export const SayReadyGetSetGoEvent = z.object(
  makeEventAutoProperties("SayReadyGetSetGo"),
);
export const SetSingleGameSoundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetGameSound"),
  {
    filename: z.string().optional(),
    volume: z.number().int().optional(),
    pitch: z.number().int().optional(),
    pan: z.number().int().optional(),
    offset: z.number().int().optional(),
  },
);
export const SetGameSoundGroupEvent = mergeShapesToObject(
  makeEventAutoProperties("SetGameSound"),
  {
    soundSubtypes: z.object({
      groupSubtype: GameSoundType.optional(),
      used: z.boolean().optional(),
      filename: z.string().optional(),
      volume: z.number().int().optional(),
      pitch: z.number().int().optional(),
      pan: z.number().int().optional(),
      offset: z.number().int().optional(),
    }).array(),
  },
);
export const SetGameSoundEvent = z.union([
  SetSingleGameSoundEvent,
  SetGameSoundGroupEvent,
]);
export const SetBeatSoundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetBeatSound"),
  makeLegacySoundProperties(),
);
export const SetCountingSoundEvent = z.object(
  makeEventAutoProperties("SetCountingSound"),
);
export const ReadNarrationEvent = z.object(
  makeEventAutoProperties("ReadNarration"),
);
export const NarrateRowInfoEvent = mergeShapesToObject(
  makeEventAutoProperties("NarrateRowInfo"),
  {
    customPattern: [z.string().regex(/^[-x]{6}$/).optional()],
    customPlayer: [z.enum(["AutoDetect", "P1", "P2"])],
  },
);
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
]);
export const AddClassicBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("AddClassicBeat"),
  { swing: [z.number().min(0).optional()] },
);
export const SetBeatModifiersEvent = mergeShapesToObject(
  makeEventAutoProperties("SetRowXs"),
  { pattern: [z.string().regex(/^[-xudbr]{6}$/).optional()] },
);
export const AddFreeTimeBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("AddFreeTimeBeat"),
  { pulse: [z.number().int().min(0).max(6).optional()] },
);
export const PulseFreeTimeBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("PulseFreeTimeBeat"),
  { customPulse: [z.number().int().min(0).max(6).optional()] },
);
export const AddOneshotBeatEvent = mergeShapesToObject(
  makeEventAutoProperties("AddOneshotBeat"),
  {
    interval: [z.number().min(0).optional()],
    tick: [z.number().min(0).optional()],
    delay: [z.number().min(0).optional()],
    loops: [z.number().int().min(0).optional()],
    subdivisions: [z.number().int().min(1).max(10).optional()],
    squareSound: z.boolean().optional(),
  },
);
export const SetOneshotWaveEvent = z.object(
  makeEventAutoProperties("SetOneshotWave"),
);
export const RowEvent = z.union([
  AddClassicBeatEvent,
  SetBeatModifiersEvent,
  AddFreeTimeBeatEvent,
  PulseFreeTimeBeatEvent,
  AddOneshotBeatEvent,
  SetOneshotWaveEvent,
]);
export const SetThemeEvent = mergeShapesToObject(
  makeEventAutoProperties("SetTheme"),
  { firstRowOnFloor: [] },
);
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
);
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
  "Dots",
  "Fisheye",
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
);
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
);
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
);
export const BloomVFXPreset = z.enum(["Bloom"]);
export const EnableBloomVFXPresetEvent = mergeShapesToObject(
  makeEventAutoProperties("SetVFXPreset"),
  {
    preset: [BloomVFXPreset],
    enable: [z.literal(true).optional()],
    speed: [],
    speedPerc: [],
  },
);
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
);
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
);
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
);
export const SetVFXPresetEvent = z.union([
  EnableOrdinaryVFXPresetEvent,
  EnableEaseableVFXPresetEvent,
  EnableColoredVFXPresetEvent,
  EnableWavyRowsVFXPresetEvent,
  EnableBloomVFXPresetEvent,
  EnableScreenVFXPresetEvent,
  DisableVFXPresetEvent,
  DisableAllVFXPresetEvent,
]);
export const ImageSequence = z.string().array().or(z.string());
export const SetBackgroundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetBackgroundColor"),
  {
    image: [ImageSequence.optional()],
    scrollX: z.number().optional(),
    scrollY: z.number().optional(),
  },
);
export const SetForegroundEvent = mergeShapesToObject(
  makeEventAutoProperties("SetForeground"),
  {
    image: [ImageSequence.optional()],
    scrollX: z.number().optional(),
    scrollY: z.number().optional(),
  },
);
export const SetSpeedEvent = z.object(
  makeEventAutoProperties("SetSpeed"),
);
export const FlashEvent = z.object(
  makeEventAutoProperties("Flash"),
);
export const CustomFlashEvent = z.object(
  makeEventAutoProperties("CustomFlash"),
);
export const MoveCameraEvent = mergeShapesToObject(
  makeEventAutoProperties("MoveCamera"),
  { zoom: [z.number().int().min(1).max(9999).optional()] },
);
export const HideRowEvent = mergeShapesToObject(
  makeEventAutoProperties("HideRow"),
  { show: z.boolean() },
);
export const MoveRowEvent = z.object(
  makeEventAutoProperties("MoveRow"),
);
export const ReorderRowEvent = mergeShapesToObject(
  makeEventAutoProperties("ReorderRow"),
  { newRoom: [z.number().int().min(0).max(3).nullable().optional()] },
);
export const PlayExpressionEvent = z.object(
  makeEventAutoProperties("PlayExpression"),
);
export const ChangeCharacterEvent = z.object(
  makeEventAutoProperties("ChangeCharacter"),
);
export const PaintRowsEvent = z.object(
  makeEventAutoProperties("TintRows"),
);
export const BassDropEvent = z.object(
  makeEventAutoProperties("BassDrop"),
);
export const CustomShakeEvent = z.object(
  makeEventAutoProperties("ShakeScreenCustom"),
);
export const ShakeScreenEvent = z.object(
  makeEventAutoProperties("ShakeScreen"),
);
export const FlipScreenEvent = mergeShapesToObject(
  makeEventAutoProperties("FlipScreen"),
  {
    x: z.boolean().optional(),
    y: z.boolean().optional(),
    flipX: z.boolean().optional(),
    flipY: z.boolean().optional(),
    flip: [z.boolean().array().length(2).optional()],
  },
);
export const InvertColorsEvent = z.object(
  makeEventAutoProperties("InvertColors"),
);
export const PulseCameraEvent = z.object(
  makeEventAutoProperties("PulseCamera"),
);
export const TextExplosionEvent = z.object(
  makeEventAutoProperties("TextExplosion"),
);
export const ShowDialogueEvent = mergeShapesToObject(
  makeEventAutoProperties("ShowDialogue"),
  {
    ...Object.fromEntries(Language.options.map((language) => [
      `text${language}`,
      z.string().optional(),
    ])),
  },
);
export const ShowStatusSignEvent = z.object(
  makeEventAutoProperties("ShowStatusSign"),
);
export const FloatingTextEvent = mergeShapesToObject(
  makeEventAutoProperties("FloatingText"),
  { times: [z.string().nullable().optional()] },
);
export const AdvanceFloatingTextEvent = z.object(
  makeEventAutoProperties("AdvanceText"),
);
export const ChangePlayersRowsEvent = z.object(
  makeEventAutoProperties("ChangePlayersRows"),
);
export const FinishLevelEvent = z.object(
  makeEventAutoProperties("FinishLevel"),
);
export const OrdinaryCommentEvent = mergeShapesToObject(
  makeEventAutoProperties("Comment"),
  { text: [z.string()], tab: z.enum(["Song", "Actions", "Rooms"]).optional() },
);
export const SpriteCommentEvent = mergeShapesToObject(
  makeEventAutoProperties("Comment"),
  { text: [z.string()], tab: z.literal("Sprites"), target: z.string() },
);
export const CommentEvent = z.union([
  OrdinaryCommentEvent,
  SpriteCommentEvent,
]);
export const ShowHandsEvent = z.object(
  makeEventAutoProperties("ShowHands"),
);
export const PaintHandsEvent = z.object(
  makeEventAutoProperties("PaintHands"),
);
export const AssignHandsEvent = z.object(
  makeEventAutoProperties("SetHandOwner"),
);
export const TagActionEvent = mergeShapesToObject(
  makeEventAutoProperties("TagAction"),
  { Tag: [z.string()] },
);
export const SetPlayStyleEvent = z.object(
  makeEventAutoProperties("SetPlayStyle"),
);
export const StutterEvent = z.object(
  makeEventAutoProperties("Stutter"),
);
export const CallCustomMethodEvent = mergeShapesToObject(
  makeEventAutoProperties("CallCustomMethod"),
  { methodName: [z.string()] },
);
export const WindowDanceEvent = mergeShapesToObject(
  makeEventAutoProperties("NewWindowDance"),
  { usePosition: z.enum(["New", "Current"]).optional() },
);
export const ResizeWindowEvent = z.object(
  makeEventAutoProperties("WindowResize"),
);
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
]);
export const MoveSpriteEvent = z.object(
  makeEventAutoProperties("Move"),
);
export const PaintSpriteEvent = mergeShapesToObject(
  makeEventAutoProperties("Tint"),
  {
    borderOpacity: z.number().int().optional(),
    tintOpacity: z.number().int().optional(),
  },
);
export const PlayAnimationEvent = z.object(
  makeEventAutoProperties("PlayAnimation"),
);
export const HideSpriteEvent = z.object(
  makeEventAutoProperties("SetVisible"),
);
export const ReorderSpriteEvent = z.object(
  makeEventAutoProperties("ReorderSprite"),
);
export const TileSpriteEvent = z.object(
  makeEventAutoProperties("Tile"),
);
export const BlendSpriteEvent = z.object(
  makeEventAutoProperties("Blend"),
);
export const DecorationEvent = z.union([
  MoveSpriteEvent,
  PaintSpriteEvent,
  PlayAnimationEvent,
  HideSpriteEvent,
  ReorderSpriteEvent,
  TileSpriteEvent,
  BlendSpriteEvent,
]);
export const ShowRoomsHorizontallyEvent = z.object(
  makeEventAutoProperties("ShowRooms"),
);
export const MoveRoomEvent = z.object(
  makeEventAutoProperties("MoveRoom"),
);
export const ReorderRoomsEvent = z.object(
  makeEventAutoProperties("ReorderRooms"),
);
export const SetRoomContentModeEvent = z.object(
  makeEventAutoProperties("SetRoomContentMode"),
);
export const MaskRoomEvent = mergeShapesToObject(
  makeEventAutoProperties("MaskRoom"),
  { image: [ImageSequence.optional()] },
);
export const FadeRoomEvent = z.object(
  makeEventAutoProperties("FadeRoom"),
);
export const SetRoomPerspectiveEvent = mergeShapesToObject(
  makeEventAutoProperties("SetRoomPerspective"),
  {
    cornerPositions: [
      z.number().min(-10000).max(10000).nullable()
        .array().length(2).array().length(4),
    ],
  },
);
export const RoomEvent = z.union([
  ShowRoomsHorizontallyEvent,
  MoveRoomEvent,
  ReorderRoomsEvent,
  SetRoomContentModeEvent,
  MaskRoomEvent,
  FadeRoomEvent,
  SetRoomPerspectiveEvent,
]);
export const Event = z.union([
  SoundEvent,
  RowEvent,
  ActionEvent,
  DecorationEvent,
  RoomEvent,
]);
export const LastHitConditional = z.object(
  makeConditionalAutoProperties("LastHit"),
);
export const CustomConditional = mergeShapesToObject(
  makeConditionalAutoProperties("Custom"),
  { expression: [z.string()] },
);
export const TimesExecutedConditional = z.object(
  makeConditionalAutoProperties("TimesExecuted"),
);
export const LanguageConditional = mergeShapesToObject(
  makeConditionalAutoProperties("Language"),
  { Language: [Language] },
);
export const PlayerModeConditional = z.object(
  makeConditionalAutoProperties("PlayerMode"),
);
export const Conditional = z.union([
  LastHitConditional,
  CustomConditional,
  TimesExecutedConditional,
  LanguageConditional,
  PlayerModeConditional,
]);
export const Bookmark = z.object({
  bar: z.number().int().min(1),
  beat: z.number().min(1),
  color: z.number().int(),
});
export const Color = z.string().regex(/^(?:[0-9A-Fa-f]{2}){3,4}$/);
export const Level = z.object({
  $schema: z.string().url().optional(),
  settings: Settings.optional(),
  rows: Row.array(),
  decorations: Decoration.array().optional(),
  events: Event.array(),
  conditionals: Conditional.array().optional(),
  bookmarks: Bookmark.array().optional(),
  colorPalette: Color.array().max(21).optional(),
});
export const levelTypedefs = {
  Settings,
  RowType,
  Player,
  Row,
  FilterMode,
  Decoration,
  Sound,
  ConditionExpression,
  PlaySongEvent,
  SetCrotchetsPerBarEvent,
  PlaySoundEvent,
  SetBeatsPerMinuteEvent,
  SetClapSoundsEvent,
  SetHeartExplodeVolumeEvent,
  SetHeartExplosionIntervalEvent,
  SayReadyGetSetGoEvent,
  GameSoundType,
  SetSingleGameSoundEvent,
  SetGameSoundGroupEvent,
  SetGameSoundEvent,
  SetBeatSoundEvent,
  SetCountingSoundEvent,
  NarrationCategory,
  ReadNarrationEvent,
  NarrateRowInfoEvent,
  SoundEvent,
  AddClassicBeatEvent,
  SetBeatModifiersEvent,
  AddFreeTimeBeatEvent,
  PulseFreeTimeBeatEvent,
  AddOneshotBeatEvent,
  SetOneshotWaveEvent,
  RowEvent,
  SetThemeEvent,
  EnableOrdinaryVFXPresetEvent,
  ColorOrPaletteIndex,
  Easing,
  EnableEaseableVFXPresetEvent,
  EnableColoredVFXPresetEvent,
  EnableWavyRowsVFXPresetEvent,
  EnableBloomVFXPresetEvent,
  EnableScreenVFXPresetEvent,
  DisableVFXPresetEvent,
  DisableAllVFXPresetEvent,
  SetVFXPresetEvent,
  ImageSequence,
  ContentMode,
  TilingType,
  SetBackgroundEvent,
  SetForegroundEvent,
  SetSpeedEvent,
  FlashEvent,
  CustomFlashEvent,
  MoveCameraEvent,
  HideRowEvent,
  Expression,
  MoveRowEvent,
  ReorderRowEvent,
  PlayExpressionEvent,
  ChangeCharacterEvent,
  Border,
  PaintRowsEvent,
  Strength,
  BassDropEvent,
  CustomShakeEvent,
  ShakeScreenEvent,
  FlipScreenEvent,
  InvertColorsEvent,
  PulseCameraEvent,
  TextExplosionEvent,
  Language,
  ShowDialogueEvent,
  ShowStatusSignEvent,
  FloatingTextEvent,
  AdvanceFloatingTextEvent,
  ChangePlayersRowsEvent,
  FinishLevelEvent,
  OrdinaryCommentEvent,
  SpriteCommentEvent,
  CommentEvent,
  Hands,
  ShowHandsEvent,
  PaintHandsEvent,
  AssignHandsEvent,
  TagActionEvent,
  SetPlayStyleEvent,
  StutterEvent,
  CallCustomMethodEvent,
  WindowDanceEvent,
  ResizeWindowEvent,
  ActionEvent,
  MoveSpriteEvent,
  PaintSpriteEvent,
  PlayAnimationEvent,
  HideSpriteEvent,
  ReorderSpriteEvent,
  TileSpriteEvent,
  BlendSpriteEvent,
  DecorationEvent,
  ShowRoomsHorizontallyEvent,
  MoveRoomEvent,
  ReorderRoomsEvent,
  SetRoomContentModeEvent,
  MaskRoomEvent,
  FadeRoomEvent,
  SetRoomPerspectiveEvent,
  RoomEvent,
  Event,
  LastHitConditional,
  CustomConditional,
  TimesExecutedConditional,
  LanguageConditional,
  PlayerModeConditional,
  Conditional,
  Bookmark,
  Color,
  Level,
};
