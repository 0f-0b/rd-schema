import {
  z,
  type ZodOptional,
  type ZodString,
  type ZodTypeAny,
} from "./deps/zod.ts";

import {
  Border,
  ColorOrPaletteIndex,
  ConditionExpression,
  ContentMode,
  Easing,
  Hands,
  Language,
  makeConditionalAutoProperties,
  makeEventAutoProperties,
  makeEventBaseProperties,
  makeRoomsProperty,
  makeRowProperty,
  NarrationCategory,
  Player,
  RowType,
  Sound,
  Strength,
} from "./attribute_parser.ts";

export {
  Border,
  ColorOrPaletteIndex,
  ConditionExpression,
  ContentMode,
  Easing,
  Hands,
  Language,
  NarrationCategory,
  Player,
  RowType,
  Sound,
  Strength,
};
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
  rankMaxMistakes: z.number().int().array().min(4).max(4),
  mods: z.string().array().or(z.string()).optional(),
  rankDescription: z.string().array().min(6).max(6),
});
export const Row = z.object({
  character: z.string(),
  rowType: RowType.optional(),
  ...makeRowProperty(),
  ...makeRoomsProperty(),
  player: Player.optional(),
  cpuMarker: z.string().optional(),
  hideAtStart: z.boolean().optional(),
  rowToMimic: z.number().int().optional(),
  muteBeats: z.boolean().optional(),
  pulseSound: z.string(),
  pulseSoundVolume: z.number().int().optional(),
  pulseSoundPitch: z.number().int().optional(),
  pulseSoundPan: z.number().int().optional(),
  pulseSoundOffset: z.number().int().optional(),
});
export const Decoration = z.object({
  id: z.string(),
  ...makeRowProperty(),
  ...makeRoomsProperty(),
  filename: z.string(),
  depth: z.number().int(),
  visible: z.boolean(),
});
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
export const PlaySongEvent = z.object(
  makeEventAutoProperties("PlaySong", (props) => {
    Object.assign(props, makeLegacySoundProperties());
  }),
);
export const SetCrotchetsPerBarEvent = z.object(
  makeEventAutoProperties("SetCrotchetsPerBar"),
);
export const PlaySoundEvent = z.object(
  makeEventAutoProperties("PlaySound", (props) => {
    const sound = props.sound as ZodOptional<ZodTypeAny>;
    Object.assign(props, makeLegacySoundProperties());
    props.sound = sound.unwrap().or(z.string()).optional();
  }),
);
export const SetBeatsPerMinuteEvent = z.object(
  makeEventAutoProperties("SetBeatsPerMinute"),
);
export const SetClapSoundsEvent = z.object(
  makeEventAutoProperties("SetClapSounds", (props) => {
    const p1Sound = props.p1Sound as ZodOptional<ZodTypeAny>;
    const p2Sound = props.p2Sound as ZodOptional<ZodTypeAny>;
    const cpuSound = props.cpuSound as ZodOptional<ZodTypeAny>;
    Object.assign(
      props,
      makeLegacySoundProperties("p1"),
      makeLegacySoundProperties("p2"),
      makeLegacySoundProperties("cpu"),
    );
    props.p1Sound = p1Sound.unwrap().or(z.string()).optional();
    props.p2Sound = p2Sound.unwrap().or(z.string()).optional();
    props.cpuSound = cpuSound.unwrap().or(z.string()).optional();
    props.p1Used = z.boolean().optional();
    props.p2Used = z.boolean().optional();
    props.cpuUsed = z.boolean().optional();
  }),
);
export const SetHeartExplodeVolumeEvent = z.object(
  makeEventAutoProperties("SetHeartExplodeVolume"),
);
export const SetHeartExplosionIntervalEvent = z.object(
  makeEventAutoProperties("SetHeartExplodeInterval"),
);
export const SayReadyGetSetGoEvent = z.object({
  ...makeEventBaseProperties("SayReadyGetSetGo"),
  phraseToSay: z.enum([
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
    "Count1",
    "Count2",
    "SayReadyGetSetGo",
    "JustSayReady",
  ]).optional(),
  voiceSource: z.enum([
    "Nurse",
    "NurseTired",
    "IanExcited",
    "IanCalm",
    "IanSlow",
    "NoneBottom",
    "NoneTop",
  ]).optional(),
  tick: z.number(),
  volume: z.number().int().optional(),
});
export const SetGameSoundEvent = z.object({
  ...makeEventBaseProperties("SetGameSound"),
  soundType: z.enum([
    "ClapSoundP1Classic",
    "ClapSoundP2Classic",
    "ClapSoundP1Oneshot",
    "ClapSoundP2Oneshot",
    "PulseSoundRow0",
    "PulseSoundRow1",
    "PulseSoundRow2",
    "PulseSoundRow3",
    "PulseSoundRow4",
    "PulseSoundRow5",
    "PulseSoundRow6",
    "PulseSoundRow7",
    "PulseSoundRow8",
    "PulseSoundRow9",
    "PulseSoundRow10",
    "PulseSoundRow11",
    "PulseSoundRow12",
    "PulseSoundRow13",
    "PulseSoundRow14",
    "PulseSoundRow15",
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
  ]).optional(),
  filename: z.string(),
  volume: z.number().int().optional(),
  pitch: z.number().int().optional(),
  pan: z.number().int().optional(),
  offset: z.number().int().optional(),
});
export const SetBeatSoundEvent = z.object(
  makeEventAutoProperties("SetBeatSound", (props) => {
    const sound = props.sound as ZodOptional<ZodTypeAny>;
    Object.assign(props, makeLegacySoundProperties());
    props.sound = sound.unwrap().or(z.string()).optional();
  }),
);
export const SetCountingSoundEvent = z.object({
  ...makeEventBaseProperties("SetCountingSound"),
  ...makeRowProperty(),
  voiceSource: z.enum([
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
    "BirdCount",
    "OwlCount",
    "WhistleCount",
    "JyiCountLegacy",
    "ParrotCount",
    "OrioleCount",
    "WrenCount",
    "CanaryCount",
  ]).optional(),
  enabled: z.boolean(),
  volume: z.number().int().optional(),
});
export const ReadNarrationEvent = z.object({
  ...makeEventBaseProperties("ReadNarration"),
  text: z.string(),
  category: NarrationCategory.optional(),
});
export const NarrateRowInfoEvent = z.object({
  ...makeEventBaseProperties("NarrateRowInfo"),
  ...makeRowProperty(),
  infoType: z.enum(["Connect", "Update", "Disconnect", "Online", "Offline"])
    .optional(),
  soundOnly: z.boolean().optional(),
  narrateSkipBeats: z.enum(["on", "custom", "off"]).optional(),
  customPattern: z.string().regex(/^[-x]{6}$/).optional(),
  skipsUnstable: z.boolean().optional(),
});
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
export const AddClassicBeatEvent = z.object({
  ...makeEventBaseProperties("AddClassicBeat"),
  ...makeRowProperty(),
  tick: z.number().min(0),
  swing: z.number().min(0).optional(),
  legacy: z.boolean().optional(),
  setXs: z.enum(["ThreeBeat", "FourBeat"]).optional(),
  hold: z.number().optional(),
});
export const SetRowXsEvent = z.object({
  ...makeEventBaseProperties("SetRowXs"),
  ...makeRowProperty(),
  pattern: z.string().regex(/^[-xudbr]{6}$/),
  syncoBeat: z.number().int().optional(),
  syncoSwing: z.number().optional(),
});
export const AddFreeTimeBeatEvent = z.object({
  ...makeEventBaseProperties("AddFreeTimeBeat"),
  ...makeRowProperty(),
  hold: z.number().optional(),
  pulse: z.number().int().min(0).max(6),
});
export const PulseFreeTimeBeatEvent = z.object({
  ...makeEventBaseProperties("PulseFreeTimeBeat"),
  ...makeRowProperty(),
  hold: z.number().optional(),
  action: z.enum(["Increment", "Decrement", "Custom", "Remove"]).optional(),
  customPulse: z.number().int().min(0).max(6),
});
export const AddOneshotBeatEvent = z.object({
  ...makeEventBaseProperties("AddOneshotBeat"),
  ...makeRowProperty(),
  pulseType: z.enum(["Wave", "Square", "Heart", "Triangle"]).optional(),
  loops: z.number().int().optional(),
  interval: z.number().min(0).optional(),
  delay: z.number().min(0).optional(),
  squareSound: z.boolean().optional(),
  skipshot: z.boolean().optional(),
  tick: z.number().min(0),
});
export const SetOneshotWaveEvent = z.object({
  ...makeEventBaseProperties("SetOneshotWave"),
  ...makeRowProperty(),
  waveType: z.enum([
    "BoomAndRush",
    "Ball",
    "Spring",
    "Spike",
    "SpikeHuge",
    "Single",
  ]).optional(),
  height: z.number().int(),
  width: z.number().int(),
});
export const RowEvent = z.union([
  AddClassicBeatEvent,
  SetRowXsEvent,
  AddFreeTimeBeatEvent,
  PulseFreeTimeBeatEvent,
  AddOneshotBeatEvent,
  SetOneshotWaveEvent,
]);
export const SetThemeEvent = z.object({
  ...makeEventBaseProperties("SetTheme"),
  ...makeRoomsProperty(),
  preset: z.enum([
    "None",
    "Intimate",
    "IntimateSimple",
    "InsomniacDay",
    "InsomniacNight",
    "Matrix",
    "NeonMuseum",
    "CrossesStraight",
    "CrossesFalling",
    "CubesFalling",
    "CubesFallingNiceBlue",
    "CubesFallingWithBlueBloomAndCrossesAndMatrix",
    "OrientalTechno",
    "Kaleidoscope",
    "PoliticiansRally",
    "Rooftop",
    "BackAlley",
    "Sky",
    "NightSky",
    "HallOfMirrors",
    "CoffeeShop",
    "CoffeeShopNight",
    "Garden",
    "GardenNight",
    "TrainDay",
    "TrainNight",
    "DesertDay",
    "DesertNight",
    "HospitalWard",
    "HospitalWardNight",
    "PaigeOffice",
    "Basement",
    "ColeWardNight",
    "ColeWardSunrise",
    "BoyWard",
    "GirlWard",
    "Skyline",
    "SkylineBlue",
    "FloatingHeart",
    "FloatingHeartWithCubes",
    "FloatingHeartBroken",
    "FloatingHeartBrokenWithCubes",
    "ZenGarden",
    "Space",
    "Tutorial",
    "RollerDisco",
    "Vaporwave",
  ]).optional(),
});
export const OrdinaryVFXPreset = z.enum([
  "SilhouettesOnHBeat",
  "Vignette",
  "VignetteFlicker",
  "ColourfulShockwaves",
  "BassDropOnHit",
  "ShakeOnHeartBeat",
  "ShakeOnHit",
  "WavyRows",
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
]);
export const EnableOrdinaryVFXPresetEvent = z.object({
  ...makeEventBaseProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: OrdinaryVFXPreset.optional(),
});
export const BloomVFXPreset = z.enum(["Bloom"]);
export const EnableBloomVFXPresetEvent = z.object({
  ...makeEventBaseProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: BloomVFXPreset,
  threshold: z.number(),
  intensity: z.number(),
  color: ColorOrPaletteIndex,
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const ScreenVFXPreset = z.enum(["TileN", "CustomScreenScroll"]);
export const EnableScreenVFXPresetEvent = z.object({
  ...makeEventBaseProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: ScreenVFXPreset,
  floatX: z.number(),
  floatY: z.number(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const EaseableVFXPreset = z.enum([
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
  "HueShift",
]);
export const EnableEaseableVFXPresetEvent = z.object({
  ...makeEventBaseProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: EaseableVFXPreset,
  intensity: z.number().int().optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const DisableVFXPresetEvent = z.object({
  ...makeEventBaseProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(false),
  preset: z.enum([
    ...OrdinaryVFXPreset.options,
    ...BloomVFXPreset.options,
    ...ScreenVFXPreset.options,
    ...EaseableVFXPreset.options,
  ]).optional(),
});
export const SetVFXPresetEvent = z.union([
  EnableOrdinaryVFXPresetEvent,
  EnableBloomVFXPresetEvent,
  EnableScreenVFXPresetEvent,
  EnableEaseableVFXPresetEvent,
  DisableVFXPresetEvent,
]);
export const ImageSequence = z.string().array().or(z.string());
export const SetBackgroundEvent = z.object(
  makeEventAutoProperties("SetBackgroundColor", (props) => {
    props.image = ImageSequence.optional();
  }),
);
export const SetForegroundEvent = z.object({
  ...makeEventBaseProperties("SetForeground"),
  ...makeRoomsProperty(),
  contentMode: ContentMode.optional(),
  color: ColorOrPaletteIndex,
  image: ImageSequence,
  fps: z.number().optional(),
  scrollX: z.number(),
  scrollY: z.number(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const SetSpeedEvent = z.object(
  makeEventAutoProperties("SetSpeed"),
);
export const FlashEvent = z.object(
  makeEventAutoProperties("Flash"),
);
export const CustomFlashEvent = z.object(
  makeEventAutoProperties("CustomFlash"),
);
export const MoveCameraEvent = z.object({
  ...makeEventBaseProperties("MoveCamera"),
  ...makeRoomsProperty(),
  cameraPosition: z.number().min(-100).max(200).nullable()
    .array().min(2).max(2).optional(),
  zoom: z.number().int().min(1).max(9999).optional(),
  angle: z.number().min(-9999).max(9999).optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const HideRowEvent = z.object(
  makeEventAutoProperties("HideRow", (props) => {
    const show = props.show as ZodOptional<ZodTypeAny>;
    props.show = show.unwrap().or(z.boolean()).optional();
  }),
);
export const Expression = z.union([z.number(), z.string(), z.null()]);
export const MoveRowEvent = z.object({
  ...makeEventBaseProperties("MoveRow"),
  ...makeRowProperty(),
  target: z.enum(["WholeRow", "Character", "Heart"]).optional(),
  customPosition: z.boolean().optional(),
  rowPosition: Expression.array().min(2).max(2).optional(),
  scale: Expression.array().min(2).max(2).optional(),
  angle: Expression.optional(),
  pivot: z.number().optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const PlayExpressionEvent = z.object(
  makeEventAutoProperties("PlayExpression"),
);
export const PaintRowsEvent = z.object(
  makeEventAutoProperties("TintRows", (props) => {
    props.borderOpacity = z.number().int().optional();
    props.tintOpacity = z.number().int().optional();
  }),
);
export const BassDropEvent = z.object(
  makeEventAutoProperties("BassDrop"),
);
export const ShakeScreenEvent = z.object(
  makeEventAutoProperties("ShakeScreen"),
);
export const FlipScreenEvent = z.object(
  makeEventAutoProperties("FlipScreen", (props) => {
    const y = props.y as ZodOptional<ZodTypeAny>;
    props.x = z.boolean().optional();
    props.y = y.unwrap().or(z.boolean()).optional();
  }),
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
export const ShowDialogueEvent = z.object({
  ...makeEventBaseProperties("ShowDialogue"),
  text: z.string(),
  localized: z.boolean().optional(),
  ...Object.fromEntries(Language.options.map((language) => [
    `text${language}`,
    z.string().optional(),
  ])) as Record<`text${z.infer<typeof Language>}`, ZodOptional<ZodString>>,
  panelSide: z.enum(["Bottom", "Top"]).optional(),
  portraitSide: z.enum(["Left", "Right"]).optional(),
  speed: z.number(),
  playTextSounds: z.boolean().optional(),
});
export const ShowStatusSignEvent = z.object(
  makeEventAutoProperties("ShowStatusSign"),
);
export const FloatingTextEvent = z.object(
  makeEventAutoProperties("FloatingText", (props) => {
    const text = props.text as ZodOptional<ZodTypeAny>;
    const times = props.times as ZodOptional<ZodTypeAny>;
    props.text = text.unwrap();
    props.times = times.unwrap();
  }),
);
export const AdvanceFloatingTextEvent = z.object({
  ...makeEventBaseProperties("AdvanceText"),
  fadeOutDuration: z.number().optional(),
  id: z.number().int(),
});
export const ChangePlayersRowsEvent = z.object(
  makeEventAutoProperties("ChangePlayersRows"),
);
export const FinishLevelEvent = z.object(
  makeEventAutoProperties("FinishLevel"),
);
export const OrdinaryCommentEvent = z.object({
  ...makeEventBaseProperties("Comment"),
  tab: z.enum(["Song", "Actions", "Rooms"]).optional(),
  show: z.boolean().optional(),
  text: z.string(),
  color: ColorOrPaletteIndex.optional(),
});
export const SpriteCommentEvent = z.object({
  ...makeEventBaseProperties("Comment"),
  tab: z.literal("Sprites"),
  target: z.string(),
  show: z.boolean().optional(),
  text: z.string(),
  color: ColorOrPaletteIndex.optional(),
});
export const CommentEvent = z.union([
  OrdinaryCommentEvent,
  SpriteCommentEvent,
]);
export const ShowHandsEvent = z.object(
  makeEventAutoProperties("ShowHands"),
);
const makeTintProperties = () => ({
  border: Border.optional(),
  borderColor: ColorOrPaletteIndex,
  tint: z.boolean(),
  tintColor: ColorOrPaletteIndex,
  borderOpacity: z.number().int().optional(),
  tintOpacity: z.number().int().optional(),
});
export const PaintHandsEvent = z.object({
  ...makeEventBaseProperties("PaintHands"),
  ...makeRoomsProperty(),
  hands: Hands.optional(),
  ...makeTintProperties(),
  opacity: z.number().int().min(0).max(100).optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const AssignHandsEvent = z.object({
  ...makeEventBaseProperties("SetHandOwner"),
  ...makeRoomsProperty(),
  hand: Hands.optional(),
  character: z.string().optional(),
});
export const TagActionEvent = z.object(
  makeEventAutoProperties("TagAction", (props) => {
    const tag = props.Tag as ZodOptional<ZodTypeAny>;
    props.Tag = tag.unwrap();
  }),
);
export const SetPlayStyleEvent = z.object(
  makeEventAutoProperties("SetPlayStyle"),
);
export const StutterEvent = z.object(
  makeEventAutoProperties("Stutter"),
);
export const CallCustomMethodEvent = z.object({
  ...makeEventBaseProperties("CallCustomMethod"),
  methodName: z.string(),
  executionTime: z.enum(["OnPrebar", "OnBar"]).optional(),
  sortOffset: z.number().int(),
});
export const WindowDanceEvent = z.object({
  ...makeEventBaseProperties("NewWindowDance"),
  ...makeRoomsProperty(),
  preset: z.enum(["Move", "Sway", "Wrap", "Ellipse", "ShakePer"]).optional(),
  usePosition: z.enum(["New", "Current"]).optional(),
  position: z.number().array().min(2).max(2),
  reference: z.enum(["Center", "Edge"]).optional(),
  useCircle: z.boolean().optional(),
  speed: z.number(),
  amplitude: z.number(),
  amplitudeVector: z.number().array().min(2).max(2),
  angle: z.number(),
  frequency: z.number(),
  period: z.number(),
  easeType: z.enum(["Repeat", "Mirror"]).optional(),
  easingDuration: z.number(),
  ease: Easing.optional(),
});
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
  PlayExpressionEvent,
  PaintRowsEvent,
  BassDropEvent,
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
]);
export const MoveSpriteEvent = z.object({
  ...makeEventBaseProperties("Move"),
  target: z.string(),
  position: Expression.array().min(2).max(2).optional(),
  scale: Expression.array().min(2).max(2).optional(),
  angle: Expression.optional(),
  pivot: z.number().nullable().array().min(2).max(2).optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const PaintSpriteEvent = z.object({
  ...makeEventBaseProperties("Tint"),
  target: z.string(),
  ...makeTintProperties(),
  opacity: z.number().int().min(0).max(100).optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const PlayAnimationEvent = z.object({
  ...makeEventBaseProperties("PlayAnimation"),
  target: z.string(),
  expression: z.string(),
});
export const HideSpriteEvent = z.object({
  ...makeEventBaseProperties("SetVisible"),
  target: z.string(),
  visible: z.boolean(),
});
export const DecorationEvent = z.union([
  MoveSpriteEvent,
  PaintSpriteEvent,
  PlayAnimationEvent,
  HideSpriteEvent,
]);
export const ShowRoomsHorizontallyEvent = z.object(
  makeEventAutoProperties("ShowRooms"),
);
export const MoveRoomEvent = z.object({
  ...makeEventBaseProperties("MoveRoom"),
  roomPosition: z.number().min(-10000).max(10000).nullable()
    .array().min(2).max(2).optional(),
  scale: z.number().nullable().array().min(2).max(2).optional(),
  angle: z.number().min(-9999).max(9999).optional(),
  pivot: z.number().nullable().array().min(2).max(2).optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const ReorderRoomsEvent = z.object(
  makeEventAutoProperties("ReorderRooms"),
);
export const SetRoomContentModeEvent = z.object(
  makeEventAutoProperties("SetRoomContentMode"),
);
export const MaskRoomEvent = z.object({
  ...makeEventBaseProperties("MaskRoom"),
  maskType: z.enum(["Image", "Room", "Color", "None"]).optional(),
  alphaMode: z.enum(["Normal", "Inverted"]).optional(),
  sourceRoom: z.number().int().optional(),
  image: ImageSequence,
  fps: z.number().optional(),
  keyColor: ColorOrPaletteIndex.optional(),
  colorCutoff: z.number().int().optional(),
  colorFeathering: z.number().int().optional(),
  contentMode: ContentMode.optional(),
});
export const FadeRoomEvent = z.object(
  makeEventAutoProperties("FadeRoom"),
);
export const SetRoomPerspectiveEvent = z.object({
  ...makeEventBaseProperties("SetRoomPerspective"),
  cornerPositions: z.number().min(-10000).max(10000).nullable()
    .array().min(2).max(2).array().min(4).max(4),
  duration: z.number(),
  ease: Easing.optional(),
});
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
export const CustomConditional = z.object(
  makeConditionalAutoProperties("Custom", (props) => {
    const expression = props.expression as ZodOptional<ZodTypeAny>;
    props.expression = expression.unwrap();
  }),
);
export const TimesExecutedConditional = z.object(
  makeConditionalAutoProperties("TimesExecuted"),
);
export const LanguageConditional = z.object(
  makeConditionalAutoProperties("Language", (props) => {
    const language = props.Language as ZodOptional<ZodTypeAny>;
    props.Language = language.unwrap();
  }),
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
  ConditionExpression,
  Decoration,
  Sound,
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
  NarrationCategory,
  ReadNarrationEvent,
  NarrateRowInfoEvent,
  SoundEvent,
  AddClassicBeatEvent,
  SetRowXsEvent,
  AddFreeTimeBeatEvent,
  PulseFreeTimeBeatEvent,
  AddOneshotBeatEvent,
  SetOneshotWaveEvent,
  RowEvent,
  SetThemeEvent,
  EnableOrdinaryVFXPresetEvent,
  ColorOrPaletteIndex,
  Easing,
  EnableBloomVFXPresetEvent,
  EnableScreenVFXPresetEvent,
  EnableEaseableVFXPresetEvent,
  DisableVFXPresetEvent,
  SetVFXPresetEvent,
  ImageSequence,
  ContentMode,
  SetBackgroundEvent,
  SetForegroundEvent,
  SetSpeedEvent,
  FlashEvent,
  CustomFlashEvent,
  MoveCameraEvent,
  HideRowEvent,
  Expression,
  MoveRowEvent,
  PlayExpressionEvent,
  Border,
  PaintRowsEvent,
  Strength,
  BassDropEvent,
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
  ActionEvent,
  MoveSpriteEvent,
  PaintSpriteEvent,
  PlayAnimationEvent,
  HideSpriteEvent,
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
