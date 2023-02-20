import { z, ZodOptional, ZodString } from "./deps/zod.ts";

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
export const RowType = z.enum([
  "Classic",
  "Oneshot",
  "Hold",
  "Scratch",
  "Split",
]);
const makeRoomsProperty = () => ({
  rooms: z.number().int().array().optional(),
});
const makeRowProperty = () => ({
  row: z.number().int(),
});
export const Player = z.enum(["P1", "P2", "CPU"]);
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
export const ConditionExpression = z.string().or(z.number().int().array());
const makeEventProperties = (type: string) => ({
  bar: z.number().int().min(1),
  beat: z.number().min(1),
  y: z.number().int().optional(),
  type: z.literal(type),
  if: ConditionExpression.optional(),
  tag: z.string().optional(),
  active: z.boolean().optional(),
});
export const Sound = z.object({
  filename: z.string(),
  volume: z.number().int().optional(),
  pitch: z.number().int().optional(),
  pan: z.number().int().optional(),
  offset: z.number().int().optional(),
});
const makeSoundProperties = (newKey: string, prefix?: string) => {
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
    [newKey]: (soundKey === newKey ? Sound.or(z.string()) : Sound).optional(),
  };
};
export const PlaySongEvent = z.object({
  ...makeEventProperties("PlaySong"),
  ...makeSoundProperties("song"),
  bpm: z.number().min(1).optional(),
  loop: z.boolean().optional(),
});
export const SetCrotchetsPerBarEvent = z.object({
  ...makeEventProperties("SetCrotchetsPerBar"),
  crotchetsPerBar: z.number().int().min(1).optional(),
  visualBeatMultiplier: z.number().min(0).optional(),
});
export const PlaySoundEvent = z.object({
  ...makeEventProperties("PlaySound"),
  ...makeSoundProperties("sound"),
  isCustom: z.boolean().optional(),
  customSoundType: z.enum([
    "CueSound",
    "MusicSound",
    "BeatSound",
    "HitSound",
    "OtherSound",
  ]).optional(),
});
export const SetBeatsPerMinuteEvent = z.object({
  ...makeEventProperties("SetBeatsPerMinute"),
  beatsPerMinute: z.number().min(1).max(1000).optional(),
});
export const SetClapSoundsEvent = z.object({
  ...makeEventProperties("SetClapSounds"),
  rowType: RowType.optional(),
  ...makeSoundProperties("p1Sound", "p1"),
  ...makeSoundProperties("p2Sound", "p2"),
  ...makeSoundProperties("cpuSound", "cpu"),
  p1Used: z.boolean().optional(),
  p2Used: z.boolean().optional(),
  cpuUsed: z.boolean().optional(),
});
export const SetHeartExplodeVolumeEvent = z.object({
  ...makeEventProperties("SetHeartExplodeVolume"),
  volume: z.number().int().min(0).optional(),
});
export const SetHeartExplosionIntervalEvent = z.object({
  ...makeEventProperties("SetHeartExplodeInterval"),
  intervalType: z.enum([
    "OneBeatAfter",
    "Instant",
    "GatherNoCeil",
    "GatherAndCeil",
  ]).optional(),
  interval: z.number().optional(),
});
export const SayReadyGetSetGoEvent = z.object({
  ...makeEventProperties("SayReadyGetSetGo"),
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
  ...makeEventProperties("SetGameSound"),
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
export const SetBeatSoundEvent = z.object({
  ...makeEventProperties("SetBeatSound"),
  ...makeRowProperty(),
  ...makeSoundProperties("sound"),
});
export const SetCountingSoundEvent = z.object({
  ...makeEventProperties("SetCountingSound"),
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
export const NarrationCategory = z.enum([
  "Fallback",
  "Navigation",
  "Instruction",
  "Notification",
  "Dialogue",
  "Description",
  "Subtitles",
]);
export const ReadNarrationEvent = z.object({
  ...makeEventProperties("ReadNarration"),
  text: z.string(),
  category: NarrationCategory.optional(),
});
export const NarrateRowInfoEvent = z.object({
  ...makeEventProperties("NarrateRowInfo"),
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
  ...makeEventProperties("AddClassicBeat"),
  ...makeRowProperty(),
  tick: z.number().min(0),
  swing: z.number().min(0).optional(),
  legacy: z.boolean().optional(),
  setXs: z.enum(["ThreeBeat", "FourBeat"]).optional(),
  hold: z.number().optional(),
});
export const SetRowXsEvent = z.object({
  ...makeEventProperties("SetRowXs"),
  ...makeRowProperty(),
  pattern: z.string().regex(/^[-xudbr]{6}$/),
  syncoBeat: z.number().int().optional(),
  syncoSwing: z.number().optional(),
});
export const AddFreeTimeBeatEvent = z.object({
  ...makeEventProperties("AddFreeTimeBeat"),
  ...makeRowProperty(),
  hold: z.number().optional(),
  pulse: z.number().int().min(0).max(6),
});
export const PulseFreeTimeBeatEvent = z.object({
  ...makeEventProperties("PulseFreeTimeBeat"),
  ...makeRowProperty(),
  hold: z.number().optional(),
  action: z.enum(["Increment", "Decrement", "Custom", "Remove"]).optional(),
  customPulse: z.number().int().min(0).max(6),
});
export const AddOneshotBeatEvent = z.object({
  ...makeEventProperties("AddOneshotBeat"),
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
  ...makeEventProperties("SetOneshotWave"),
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
  ...makeEventProperties("SetTheme"),
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
  ...makeEventProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: OrdinaryVFXPreset.optional(),
});
export const BloomVFXPreset = z.enum(["Bloom"]);
export const ColorOrPaletteIndex = z.string()
  .regex(/^(?:(?:[0-9A-Fa-f]{2}){3,4}|pal\d+)$/);
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
export const EnableBloomVFXPresetEvent = z.object({
  ...makeEventProperties("SetVFXPreset"),
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
  ...makeEventProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: ScreenVFXPreset,
  floatX: z.number(),
  floatY: z.number(),
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
  ...makeEventProperties("SetVFXPreset"),
  ...makeRoomsProperty(),
  enable: z.literal(true),
  preset: EaseableVFXPreset,
  intensity: z.number().int().optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const DisableVFXPresetEvent = z.object({
  ...makeEventProperties("SetVFXPreset"),
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
export const ContentMode = z.enum([
  "ScaleToFill",
  "AspectFit",
  "AspectFill",
  "Center",
  "Tiled",
]);
export const SetBackgroundEvent = z.object({
  ...makeEventProperties("SetBackgroundColor"),
  ...makeRoomsProperty(),
  backgroundType: z.enum(["Color", "Image"]).optional(),
  color: ColorOrPaletteIndex.optional(),
  image: ImageSequence.optional(),
  contentMode: ContentMode.optional(),
  filter: z.enum(["NearestNeighbor", "Bilinear"]).optional(),
  scrollX: z.number().optional(),
  scrollY: z.number().optional(),
  duration: z.number().min(0).optional(),
  ease: Easing.optional(),
  fps: z.number().min(0).optional(),
});
export const SetForegroundEvent = z.object({
  ...makeEventProperties("SetForeground"),
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
export const SetSpeedEvent = z.object({
  ...makeEventProperties("SetSpeed"),
  speed: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  ease: Easing.optional(),
});
export const FlashEvent = z.object({
  ...makeEventProperties("Flash"),
  ...makeRoomsProperty(),
  duration: z.enum(["Short", "Medium", "Long"]).optional(),
});
export const CustomFlashEvent = z.object({
  ...makeEventProperties("CustomFlash"),
  ...makeRoomsProperty(),
  background: z.boolean().optional(),
  duration: z.number().optional(),
  startColor: ColorOrPaletteIndex.optional(),
  endColor: ColorOrPaletteIndex.optional(),
  ease: Easing.optional(),
  startOpacity: z.number().int().optional(),
  endOpacity: z.number().int().optional(),
});
export const MoveCameraEvent = z.object({
  ...makeEventProperties("MoveCamera"),
  ...makeRoomsProperty(),
  cameraPosition: z.number().min(-100).max(200).nullable()
    .array().min(2).max(2).optional(),
  zoom: z.number().int().min(1).max(9999).optional(),
  angle: z.number().min(-9999).max(9999).optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const HideRowEvent = z.object({
  ...makeEventProperties("HideRow"),
  ...makeRowProperty(),
  show: z.enum(["Visible", "Hidden", "OnlyCharacter", "OnlyRow"])
    .or(z.boolean()).optional(),
  transition: z.enum(["Smooth", "Instant", "Full"]).optional(),
});
export const Expression = z.union([z.number(), z.string(), z.null()]);
export const MoveRowEvent = z.object({
  ...makeEventProperties("MoveRow"),
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
export const PlayExpressionEvent = z.object({
  ...makeEventProperties("PlayExpression"),
  ...makeRowProperty(),
  expression: z.string().optional(),
  replace: z.boolean().optional(),
  target: z.enum(["Neutral", "Happy", "Barely", "Missed", "Beep"]).optional(),
});
export const Border = z.enum(["None", "Outline", "Glow"]);
export const PaintRowsEvent = z.object({
  ...makeEventProperties("TintRows"),
  ...makeRowProperty(),
  ...makeRoomsProperty(),
  border: Border.optional(),
  borderColor: ColorOrPaletteIndex.optional(),
  tint: z.boolean().optional(),
  tintColor: ColorOrPaletteIndex.optional(),
  opacity: z.number().int().min(0).max(100).optional(),
  duration: z.number().min(0).optional(),
  ease: Easing.optional(),
  effect: z.enum(["None", "Electric"]).optional(),
  borderOpacity: z.number().int().optional(),
  tintOpacity: z.number().int().optional(),
});
export const Strength = z.enum(["Low", "Medium", "High"]);
export const BassDropEvent = z.object({
  ...makeEventProperties("BassDrop"),
  ...makeRoomsProperty(),
  strength: Strength.optional(),
});
export const ShakeScreenEvent = z.object({
  ...makeEventProperties("ShakeScreen"),
  ...makeRoomsProperty(),
  shakeLevel: Strength.optional(),
});
export const FlipScreenEvent = z.object({
  ...makeEventProperties("FlipScreen"),
  ...makeRoomsProperty(),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  x: z.boolean().optional(),
  y: z.number().int().or(z.boolean()).optional(),
});
export const InvertColorsEvent = z.object({
  ...makeEventProperties("InvertColors"),
  ...makeRoomsProperty(),
  enable: z.boolean().optional(),
});
export const PulseCameraEvent = z.object({
  ...makeEventProperties("PulseCamera"),
  ...makeRoomsProperty(),
  strength: z.number().int().min(0).optional(),
  count: z.number().int().min(0).optional(),
  frequency: z.number().min(0).optional(),
});
export const TextExplosionEvent = z.object({
  ...makeEventProperties("TextExplosion"),
  ...makeRoomsProperty(),
  text: z.string().optional(),
  color: ColorOrPaletteIndex.optional(),
  mode: z.enum(["OneColor", "Random"]).optional(),
  direction: z.enum(["Left", "Right"]).optional(),
});
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
export const ShowDialogueEvent = z.object({
  ...makeEventProperties("ShowDialogue"),
  text: z.string(),
  localized: z.boolean().optional(),
  ...Object.fromEntries(
    Language.options
      .map((language) => [`text${language}`, z.string().optional()]),
  ) as Record<`text${z.infer<typeof Language>}`, ZodOptional<ZodString>>,
  panelSide: z.enum(["Bottom", "Top"]).optional(),
  portraitSide: z.enum(["Left", "Right"]).optional(),
  speed: z.number(),
  playTextSounds: z.boolean().optional(),
});
export const ShowStatusSignEvent = z.object({
  ...makeEventProperties("ShowStatusSign"),
  text: z.string().optional(),
  duration: z.number().optional(),
  useBeats: z.boolean().optional(),
  narrate: z.boolean().optional(),
});
export const FloatingTextEvent = z.object({
  ...makeEventProperties("FloatingText"),
  ...makeRoomsProperty(),
  id: z.number().int().optional(),
  text: z.string(),
  times: z.string(),
  color: ColorOrPaletteIndex.optional(),
  outlineColor: ColorOrPaletteIndex.optional(),
  textPosition: z.number().array().min(2).max(2).optional(),
  size: z.number().int().min(0).optional(),
  angle: z.number().optional(),
  showChildren: z.boolean().optional(),
  fadeOutRate: z.number().min(0).optional(),
  mode: z.enum(["FadeOut", "HideAbruptly"]).optional(),
  anchor: z.enum([
    "UpperLeft",
    "UpperCenter",
    "UpperRight",
    "MiddleLeft",
    "MiddleCenter",
    "MiddleRight",
    "LowerLeft",
    "LowerCenter",
    "LowerRight",
  ]).optional(),
  narrate: z.boolean().optional(),
  narrationCategory: NarrationCategory.optional(),
});
export const AdvanceFloatingTextEvent = z.object({
  ...makeEventProperties("AdvanceText"),
  fadeOutDuration: z.number().optional(),
  id: z.number().int(),
});
export const ChangePlayersRowsEvent = z.object({
  ...makeEventProperties("ChangePlayersRows"),
  playerMode: z.enum(["OnePlayer", "TwoPlayers"]).optional(),
  players: z.enum([...Player.options, "NoChange"]).array().optional(),
  cpuMarkers: z.string().array().optional(),
  flashingOnBeat: z.boolean().optional(),
});
export const FinishLevelEvent = z.object(makeEventProperties("FinishLevel"));
export const OrdinaryCommentEvent = z.object({
  ...makeEventProperties("Comment"),
  tab: z.enum(["Song", "Actions", "Rooms"]).optional(),
  target: z.string(),
  show: z.boolean().optional(),
  text: z.string(),
  color: ColorOrPaletteIndex.optional(),
});
export const SpriteCommentEvent = z.object({
  ...makeEventProperties("Comment"),
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
export const Hands = z.enum(["Left", "Right", "Both"]);
export const ShowHandsEvent = z.object({
  ...makeEventProperties("ShowHands"),
  ...makeRoomsProperty(),
  hand: Hands.optional(),
  action: z.enum(["Show", "Hide", "Raise", "Lower"]).optional(),
  align: z.boolean().optional(),
  instant: z.boolean().optional(),
  extent: z.enum(["Full", "Short"]).optional(),
});
const makeTintProperties = () => ({
  border: Border.optional(),
  borderColor: ColorOrPaletteIndex,
  tint: z.boolean(),
  tintColor: ColorOrPaletteIndex,
  borderOpacity: z.number().int().optional(),
  tintOpacity: z.number().int().optional(),
});
export const PaintHandsEvent = z.object({
  ...makeEventProperties("PaintHands"),
  ...makeRoomsProperty(),
  hands: Hands.optional(),
  ...makeTintProperties(),
  opacity: z.number().int().min(0).max(100).optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const AssignHandsEvent = z.object({
  ...makeEventProperties("SetHandOwner"),
  ...makeRoomsProperty(),
  hand: Hands.optional(),
  character: z.string().optional(),
});
export const TagActionEvent = z.object({
  ...makeEventProperties("TagAction"),
  Action: z.enum([
    "Run",
    "RunAll",
    "Enable",
    "Disable",
    "EnableAll",
    "DisableAll",
  ]).optional(),
  Tag: z.string(),
});
export const SetPlayStyleEvent = z.object({
  ...makeEventProperties("SetPlayStyle"),
  PlayStyle: z.enum([
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
  ]).optional(),
  NextBar: z.number().int().min(1).optional(),
  Relative: z.boolean().optional(),
});
export const StutterEvent = z.object({
  ...makeEventProperties("Stutter"),
  ...makeRoomsProperty(),
  sourceBeat: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  loops: z.number().int().min(1).optional(),
  action: z.enum(["Add", "Cancel"]).optional(),
});
export const CallCustomMethodEvent = z.object({
  ...makeEventProperties("CallCustomMethod"),
  methodName: z.string(),
  executionTime: z.enum(["OnPrebar", "OnBar"]).optional(),
  sortOffset: z.number().int(),
});
export const WindowDanceEvent = z.object({
  ...makeEventProperties("NewWindowDance"),
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
  ...makeEventProperties("Move"),
  target: z.string(),
  position: Expression.array().min(2).max(2).optional(),
  scale: Expression.array().min(2).max(2).optional(),
  angle: Expression.optional(),
  pivot: z.number().nullable().array().min(2).max(2).optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const PaintSpriteEvent = z.object({
  ...makeEventProperties("Tint"),
  target: z.string(),
  ...makeTintProperties(),
  opacity: z.number().int().min(0).max(100).optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const PlayAnimationEvent = z.object({
  ...makeEventProperties("PlayAnimation"),
  target: z.string(),
  expression: z.string(),
});
export const HideSpriteEvent = z.object({
  ...makeEventProperties("SetVisible"),
  target: z.string(),
  visible: z.boolean(),
});
export const DecorationEvent = z.union([
  MoveSpriteEvent,
  PaintSpriteEvent,
  PlayAnimationEvent,
  HideSpriteEvent,
]);
export const ShowRoomsHorizontallyEvent = z.object({
  ...makeEventProperties("ShowRooms"),
  ...makeRoomsProperty(),
  transitionTime: z.number().optional(),
  heights: z.number().int().array().optional(),
  ease: Easing.optional(),
});
export const MoveRoomEvent = z.object({
  ...makeEventProperties("MoveRoom"),
  roomPosition: z.number().min(-10000).max(10000).nullable()
    .array().min(2).max(2).optional(),
  scale: z.number().nullable().array().min(2).max(2).optional(),
  angle: z.number().min(-9999).max(9999).optional(),
  pivot: z.number().nullable().array().min(2).max(2).optional(),
  duration: z.number(),
  ease: Easing.optional(),
});
export const ReorderRoomsEvent = z.object({
  ...makeEventProperties("ReorderRooms"),
  order: z.number().int().array().optional(),
});
export const SetRoomContentModeEvent = z.object({
  ...makeEventProperties("SetRoomContentMode"),
  mode: ContentMode.optional(),
});
export const MaskRoomEvent = z.object({
  ...makeEventProperties("MaskRoom"),
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
export const FadeRoomEvent = z.object({
  ...makeEventProperties("FadeRoom"),
  opacity: z.number().int().min(0).max(100).optional(),
  duration: z.number().optional(),
  ease: Easing.optional(),
});
export const SetRoomPerspectiveEvent = z.object({
  ...makeEventProperties("SetRoomPerspective"),
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
const makeConditionalProperties = (type: string) => ({
  type: z.literal(type),
  tag: z.string().optional(),
  name: z.string(),
  id: z.number().int(),
});
export const LastHitConditional = z.object({
  ...makeConditionalProperties("LastHit"),
  row: z.number().int().optional(),
  result: z.enum([
    "Perfect",
    "SlightlyEarly",
    "SlightlyLate",
    "VeryEarly",
    "VeryLate",
    "AnyEarlyOrLate",
    "Missed",
  ]).optional(),
});
export const CustomConditional = z.object({
  ...makeConditionalProperties("Custom"),
  expression: z.string(),
});
export const TimesExecutedConditional = z.object({
  ...makeConditionalProperties("TimesExecuted"),
  maxTimes: z.number().int().optional(),
});
export const LanguageConditional = z.object({
  ...makeConditionalProperties("Language"),
  Language: Language,
});
export const PlayerModeConditional = z.object({
  ...makeConditionalProperties("PlayerMode"),
  twoPlayerMode: z.boolean().optional(),
});
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
