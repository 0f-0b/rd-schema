export type Settings = {
  version: number;
  artist?: string | undefined;
  song?: string | undefined;
  specialArtistType?: ("None" | "AuthorIsArtist" | "PublicLicense") | undefined;
  artistPermission?: string | undefined;
  artistLinks?: string | undefined;
  author?: string | undefined;
  difficulty?: ("Easy" | "Medium" | "Tough" | "VeryTough") | undefined;
  seizureWarning?: boolean | undefined;
  previewImage?: string | undefined;
  syringeIcon?: string | undefined;
  previewSong?: string | undefined;
  previewSongStartTime?: number | undefined;
  previewSongDuration?: number | undefined;
  songNameHue?: number | undefined;
  songLabelGrayscale?: boolean | undefined;
  description?: string | undefined;
  tags?: string | undefined;
  separate2PLevelFilename?: string | undefined;
  canBePlayedOn?: ("OnePlayerOnly" | "TwoPlayerOnly" | "BothModes") | undefined;
  firstBeatBehavior?: ("RunNormally" | "RunEventsOnPrebar") | undefined;
  customClass?: string | undefined;
  inkFile?: string | undefined;
  multiplayerAppearance?: ("HorizontalStrips" | "Nothing") | undefined;
  levelVolume?: number | undefined;
  rankMaxMistakes: number[];
  mods?: (string[] | string) | undefined;
  rankDescription: string[];
};
export type RowType = "Classic" | "Oneshot";
export type Player = "P1" | "P2" | "CPU";
export type Row = {
  if?: (string | number[]) | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  row: number;
  rowType?: RowType | undefined;
  player?: Player | undefined;
  character: string;
  cpuMarker?: string | undefined;
  hideAtStart?: boolean | undefined;
  rowToMimic?: number | undefined;
  muteBeats?: boolean | undefined;
  muteIn1P?: boolean | undefined;
  pulseSound: string;
  pulseSoundVolume?: number | undefined;
  pulseSoundPitch?: number | undefined;
  pulseSoundPan?: number | undefined;
  pulseSoundOffset?: number | undefined;
};
export type FilterMode = "NearestNeighbor" | "Bilinear";
export type Decoration = {
  if?: (string | number[]) | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  row: number;
  visible?: boolean | undefined;
  id?: string | undefined;
  filename?: string | undefined;
  depth?: number | undefined;
  filter?: FilterMode | undefined;
};
export type Sound = {
  filename: string;
  volume?: number | undefined;
  pitch?: number | undefined;
  pan?: number | undefined;
  offset?: number | undefined;
};
export type ConditionExpression = string | number[];
export type PlaySongEvent = {
  bar?: number | undefined;
  y?: number | undefined;
  type: "PlaySong";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  song?: Sound | undefined;
  bpm?: number | undefined;
  loop?: boolean | undefined;
  filename?: string | undefined;
  sound?: string | undefined;
  offset?: number | undefined;
  volume?: number | undefined;
  pitch?: number | undefined;
  pan?: number | undefined;
};
export type SetCrotchetsPerBarEvent = {
  bar?: number | undefined;
  y?: number | undefined;
  type: "SetCrotchetsPerBar";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  crotchetsPerBar?: number | undefined;
  visualBeatMultiplier?: number | undefined;
};
export type PlaySoundEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "PlaySound";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  sound?: (Sound | string) | undefined;
  customSoundType?:
    | ("CueSound" | "MusicSound" | "BeatSound" | "HitSound" | "OtherSound")
    | undefined;
  isCustom?: boolean | undefined;
  filename?: string | undefined;
  offset?: number | undefined;
  volume?: number | undefined;
  pitch?: number | undefined;
  pan?: number | undefined;
};
export type SetBeatsPerMinuteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetBeatsPerMinute";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  beatsPerMinute?: number | undefined;
};
export type SetClapSoundsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetClapSounds";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rowType?: RowType | undefined;
  p1Sound?: ((Sound | null) | string) | undefined;
  p2Sound?: ((Sound | null) | string) | undefined;
  cpuSound?: ((Sound | null) | string) | undefined;
  p1Filename?: string | undefined;
  p1Offset?: number | undefined;
  p1Volume?: number | undefined;
  p1Pitch?: number | undefined;
  p1Pan?: number | undefined;
  p2Filename?: string | undefined;
  p2Offset?: number | undefined;
  p2Volume?: number | undefined;
  p2Pitch?: number | undefined;
  p2Pan?: number | undefined;
  cpuFilename?: string | undefined;
  cpuOffset?: number | undefined;
  cpuVolume?: number | undefined;
  cpuPitch?: number | undefined;
  cpuPan?: number | undefined;
  p1Used?: boolean | undefined;
  p2Used?: boolean | undefined;
  cpuUsed?: boolean | undefined;
};
export type SetHeartExplodeVolumeEvent = {
  bar?: number | undefined;
  y?: number | undefined;
  type: "SetHeartExplodeVolume";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  volume?: number | undefined;
};
export type SetHeartExplosionIntervalEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetHeartExplodeInterval";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  intervalType?:
    | ("OneBeatAfter" | "Instant" | "GatherNoCeil" | "GatherAndCeil")
    | undefined;
  interval?: number | undefined;
};
export type SayReadyGetSetGoEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SayReadyGetSetGo";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  phraseToSay?:
    | (
      | "SayReaDyGetSetGoNew"
      | "SayGetSetGo"
      | "SayReaDyGetSetOne"
      | "SayGetSetOne"
      | "JustSayRea"
      | "JustSayDy"
      | "JustSayGet"
      | "JustSaySet"
      | "JustSayAnd"
      | "JustSayGo"
      | "JustSayStop"
      | "JustSayAndStop"
      | "SaySwitch"
      | "SayWatch"
      | "SayListen"
      | "Count1"
      | "Count2"
      | "Count3"
      | "Count4"
      | "Count5"
      | "Count6"
      | "Count7"
      | "Count8"
      | "Count9"
      | "Count10"
      | "SayReadyGetSetGo"
      | "JustSayReady"
    )
    | undefined;
  voiceSource?:
    | (
      | "Nurse"
      | "NurseTired"
      | "NurseSwing"
      | "NurseSwingCalm"
      | "IanExcited"
      | "IanCalm"
      | "IanSlow"
      | "NoneBottom"
      | "NoneTop"
    )
    | undefined;
  tick?: number | undefined;
  volume?: number | undefined;
};
export type GameSoundType =
  | "ClapSoundP1Classic"
  | "ClapSoundP2Classic"
  | "ClapSoundP1Oneshot"
  | "ClapSoundP2Oneshot"
  | "SmallMistake"
  | "BigMistake"
  | "Hand1PopSound"
  | "Hand2PopSound"
  | "HeartExplosion"
  | "HeartExplosion2"
  | "HeartExplosion3"
  | "ClapSoundHoldLongEnd"
  | "ClapSoundHoldLongStart"
  | "ClapSoundHoldShortEnd"
  | "ClapSoundHoldShortStart"
  | "PulseSoundHoldStart"
  | "PulseSoundHoldShortEnd"
  | "PulseSoundHoldEnd"
  | "PulseSoundHoldStartAlt"
  | "PulseSoundHoldShortEndAlt"
  | "PulseSoundHoldEndAlt"
  | "ClapSoundCPUClassic"
  | "ClapSoundCPUOneshot"
  | "ClapSoundHoldLongEndP2"
  | "ClapSoundHoldLongStartP2"
  | "ClapSoundHoldShortEndP2"
  | "ClapSoundHoldShortStartP2"
  | "PulseSoundHoldStartP2"
  | "PulseSoundHoldShortEndP2"
  | "PulseSoundHoldEndP2"
  | "PulseSoundHoldStartAltP2"
  | "PulseSoundHoldShortEndAltP2"
  | "PulseSoundHoldEndAltP2"
  | "FreezeshotSoundCueLow"
  | "FreezeshotSoundCueHigh"
  | "FreezeshotSoundRiser"
  | "FreezeshotSoundCymbal"
  | "BurnshotSoundCueLow"
  | "BurnshotSoundCueHigh"
  | "BurnshotSoundRiser"
  | "BurnshotSoundCymbal"
  | "ClapSoundHold"
  | "PulseSoundHold"
  | "ClapSoundHoldP2"
  | "PulseSoundHoldP2"
  | "FreezeshotSound"
  | "BurnshotSound"
  | "Skipshot";
export type SetSingleGameSoundEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetGameSound";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  soundType?: GameSoundType | undefined;
  filename?: string | undefined;
  volume?: number | undefined;
  pitch?: number | undefined;
  pan?: number | undefined;
  offset?: number | undefined;
};
export type SetGameSoundGroupEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetGameSound";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  soundType?: GameSoundType | undefined;
  soundSubtypes: {
    groupSubtype?: GameSoundType | undefined;
    used?: boolean | undefined;
    filename?: string | undefined;
    volume?: number | undefined;
    pitch?: number | undefined;
    pan?: number | undefined;
    offset?: number | undefined;
  }[];
};
export type SetGameSoundEvent =
  | SetSingleGameSoundEvent
  | SetGameSoundGroupEvent;
export type SetBeatSoundEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetBeatSound";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  sound?: (Sound | string) | undefined;
  filename?: string | undefined;
  offset?: number | undefined;
  volume?: number | undefined;
  pitch?: number | undefined;
  pan?: number | undefined;
};
export type SetCountingSoundEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetCountingSound";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  voiceSource?:
    | (
      | "JyiCount"
      | "JyiCountFast"
      | "JyiCountCalm"
      | "JyiCountTired"
      | "JyiCountVeryTired"
      | "JyiCountEnglish"
      | "JyiCountJapanese"
      | "IanCount"
      | "IanCountFast"
      | "IanCountCalm"
      | "IanCountSlow"
      | "IanCountSlower"
      | "IanCountEnglish"
      | "IanCountEnglishFast"
      | "IanCountEnglishCalm"
      | "IanCountEnglishSlow"
      | "BirdCount"
      | "OwlCount"
      | "WhistleCount"
      | "JyiCountLegacy"
      | "ParrotCount"
      | "OrioleCount"
      | "WrenCount"
      | "CanaryCount"
      | "Custom"
    )
    | undefined;
  sounds?: Sound[] | undefined;
  enabled?: boolean | undefined;
  volume?: number | undefined;
  subdivOffset?: number | undefined;
};
export type NarrationCategory =
  | "Fallback"
  | "Navigation"
  | "Instruction"
  | "Notification"
  | "Dialogue"
  | "Description"
  | "Subtitles";
export type ReadNarrationEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ReadNarration";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  text?: string | undefined;
  category?: NarrationCategory | undefined;
};
export type NarrateRowInfoEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "NarrateRowInfo";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  infoType?:
    | ("Connect" | "Update" | "Disconnect" | "Online" | "Offline")
    | undefined;
  soundOnly?: boolean | undefined;
  narrateSkipBeats?: ("On" | "Custom" | "Off") | undefined;
  skipsUnstable?: boolean | undefined;
  customPattern?: string | undefined;
  customPlayer: "AutoDetect" | "P1" | "P2";
};
export type SoundEvent =
  | PlaySongEvent
  | SetCrotchetsPerBarEvent
  | PlaySoundEvent
  | SetBeatsPerMinuteEvent
  | SetClapSoundsEvent
  | SetHeartExplodeVolumeEvent
  | SetHeartExplosionIntervalEvent
  | SayReadyGetSetGoEvent
  | SetGameSoundEvent
  | SetBeatSoundEvent
  | SetCountingSoundEvent
  | ReadNarrationEvent
  | NarrateRowInfoEvent;
export type AddClassicBeatEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "AddClassicBeat";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  tick?: number | undefined;
  swing?: number | undefined;
  hold?: number | undefined;
  setXs?: ("ThreeBeat" | "FourBeat") | undefined;
  legacy?: boolean | undefined;
};
export type SetBeatModifiersEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetRowXs";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  pattern?: string | undefined;
  syncoBeat?: number | undefined;
  syncoSwing?: number | undefined;
  syncoVolume?: number | undefined;
  syncoStyle?: ("Chirp" | "Beep") | undefined;
  syncoPlayModifierSound?: boolean | undefined;
};
export type AddFreeTimeBeatEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "AddFreeTimeBeat";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  pulse?: number | undefined;
  hold?: number | undefined;
};
export type PulseFreeTimeBeatEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "PulseFreeTimeBeat";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  action?: ("Increment" | "Decrement" | "Custom" | "Remove") | undefined;
  hold?: number | undefined;
  customPulse?: number | undefined;
};
export type AddOneshotBeatEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "AddOneshotBeat";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  pulseType?: ("Wave" | "Square" | "Heart" | "Triangle") | undefined;
  freezeBurnMode?: ("Freezeshot" | "Burnshot") | undefined;
  interval?: number | undefined;
  tick?: number | undefined;
  delay?: number | undefined;
  loops?: number | undefined;
  subdivisions?: number | undefined;
  subdivSound?: boolean | undefined;
  skipshot?: boolean | undefined;
  subdivTickOverride?: number | undefined;
  squareSound?: boolean | undefined;
};
export type SetOneshotWaveEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetOneshotWave";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  waveType?:
    | ("BoomAndRush" | "Ball" | "Spring" | "Spike" | "SpikeHuge" | "Single")
    | undefined;
  height?: number | undefined;
  width?: number | undefined;
};
export type RowEvent =
  | AddClassicBeatEvent
  | SetBeatModifiersEvent
  | AddFreeTimeBeatEvent
  | PulseFreeTimeBeatEvent
  | AddOneshotBeatEvent
  | SetOneshotWaveEvent;
export type SetThemeEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetTheme";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset?:
    | (
      | "None"
      | "Intimate"
      | "IntimateSimple"
      | "InsomniacDay"
      | "InsomniacNight"
      | "Matrix"
      | "NeonMuseum"
      | "CrossesStraight"
      | "CrossesFalling"
      | "CubesFalling"
      | "CubesFallingNiceBlue"
      | "CubesFallingWithBlueBloomAndCrossesAndMatrix"
      | "OrientalTechno"
      | "Kaleidoscope"
      | "PoliticiansRally"
      | "Rooftop"
      | "RooftopSummer"
      | "RooftopAutumn"
      | "BackAlley"
      | "Sky"
      | "NightSky"
      | "HallOfMirrors"
      | "CoffeeShop"
      | "CoffeeShopNight"
      | "Garden"
      | "GardenNight"
      | "TrainDay"
      | "TrainNight"
      | "DesertDay"
      | "DesertNight"
      | "HospitalWard"
      | "HospitalWardNight"
      | "PaigeOffice"
      | "Basement"
      | "ColeWardNight"
      | "ColeWardSunrise"
      | "BoyWard"
      | "GirlWard"
      | "Skyline"
      | "SkylineBlue"
      | "FloatingHeart"
      | "FloatingHeartWithCubes"
      | "FloatingHeartBroken"
      | "FloatingHeartBrokenWithCubes"
      | "ZenGarden"
      | "Space"
      | "Tutorial"
      | "Vaporwave"
      | "RollerDisco"
      | "Stadium"
      | "StadiumStormy"
      | "AthleteWard"
      | "AthleteWardNight"
      | "ProceduralTree"
    )
    | undefined;
  variant?: number | undefined;
  skipPaintEffects?: boolean | undefined;
};
export type EnableOrdinaryVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset?:
    | (
      | "SilhouettesOnHBeat"
      | "Vignette"
      | "VignetteFlicker"
      | "ColourfulShockwaves"
      | "BassDropOnHit"
      | "ShakeOnHeartBeat"
      | "ShakeOnHit"
      | "Tile2"
      | "Tile3"
      | "Tile4"
      | "LightStripVert"
      | "VHS"
      | "ScreenScrollX"
      | "ScreenScroll"
      | "ScreenScrollXSansVHS"
      | "ScreenScrollSansVHS"
      | "RowGlowWhite"
      | "RowOutline"
      | "RowShadow"
      | "RowAllWhite"
      | "RowSilhouetteGlow"
      | "RowPlain"
      | "CutsceneMode"
      | "Blackout"
      | "Noise"
      | "GlitchObstruction"
      | "Matrix"
      | "MiawMiaw"
      | "Confetti"
      | "FallingPetals"
      | "FallingPetalsInstant"
      | "FallingPetalsSnow"
      | "Snow"
      | "OrangeBloom"
      | "BlueBloom"
      | "HallOfMirrors"
      | "BlackAndWhite"
      | "Sepia"
      | "NumbersAbovePulses"
      | "Funk"
      | "Balloons"
    )
    | undefined;
  enable?: true | undefined;
};
export type ColorOrPaletteIndex = string;
export type Easing =
  | "Unset"
  | "Linear"
  | "InSine"
  | "OutSine"
  | "InOutSine"
  | "InQuad"
  | "OutQuad"
  | "InOutQuad"
  | "InCubic"
  | "OutCubic"
  | "InOutCubic"
  | "InQuart"
  | "OutQuart"
  | "InOutQuart"
  | "InQuint"
  | "OutQuint"
  | "InOutQuint"
  | "InExpo"
  | "OutExpo"
  | "InOutExpo"
  | "InCirc"
  | "OutCirc"
  | "InOutCirc"
  | "InElastic"
  | "OutElastic"
  | "InOutElastic"
  | "InBack"
  | "OutBack"
  | "InOutBack"
  | "InBounce"
  | "OutBounce"
  | "InOutBounce";
export type EnableEaseableVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset:
    | "HueShift"
    | "Brightness"
    | "Contrast"
    | "Saturation"
    | "Rain"
    | "JPEG"
    | "Mosaic"
    | "ScreenWaves"
    | "Grain"
    | "Blizzard"
    | "Drawing"
    | "Aberration"
    | "Blur"
    | "RadialBlur"
    | "Fisheye"
    | "Dots";
  enable?: true | undefined;
  intensity?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type EnableColoredVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset: "Diamonds" | "Tutorial";
  enable?: true | undefined;
  intensity?: number | undefined;
  color?: ColorOrPaletteIndex | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type EnableWavyRowsVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset: "WavyRows";
  enable?: true | undefined;
  intensity?: number | undefined;
  speedPerc?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type EnableBloomVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset: "Bloom";
  enable?: true | undefined;
  threshold?: number | undefined;
  intensity?: number | undefined;
  color?: ColorOrPaletteIndex | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type EnableScreenVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset: "TileN" | "CustomScreenScroll";
  enable?: true | undefined;
  speed?: [
    number | null,
    number | null,
  ] | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
  floatX?: number | undefined;
  floatY?: number | undefined;
};
export type DisableVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset?:
    | (
      | "SilhouettesOnHBeat"
      | "Vignette"
      | "VignetteFlicker"
      | "ColourfulShockwaves"
      | "BassDropOnHit"
      | "ShakeOnHeartBeat"
      | "ShakeOnHit"
      | "Tile2"
      | "Tile3"
      | "Tile4"
      | "LightStripVert"
      | "VHS"
      | "ScreenScrollX"
      | "ScreenScroll"
      | "ScreenScrollXSansVHS"
      | "ScreenScrollSansVHS"
      | "RowGlowWhite"
      | "RowOutline"
      | "RowShadow"
      | "RowAllWhite"
      | "RowSilhouetteGlow"
      | "RowPlain"
      | "CutsceneMode"
      | "Blackout"
      | "Noise"
      | "GlitchObstruction"
      | "Matrix"
      | "MiawMiaw"
      | "Confetti"
      | "FallingPetals"
      | "FallingPetalsInstant"
      | "FallingPetalsSnow"
      | "Snow"
      | "OrangeBloom"
      | "BlueBloom"
      | "HallOfMirrors"
      | "BlackAndWhite"
      | "Sepia"
      | "NumbersAbovePulses"
      | "Funk"
      | "Balloons"
      | "HueShift"
      | "Brightness"
      | "Contrast"
      | "Saturation"
      | "Rain"
      | "JPEG"
      | "Mosaic"
      | "ScreenWaves"
      | "Grain"
      | "Blizzard"
      | "Drawing"
      | "Aberration"
      | "Blur"
      | "RadialBlur"
      | "Fisheye"
      | "Dots"
      | "Diamonds"
      | "Tutorial"
      | "WavyRows"
      | "Bloom"
      | "TileN"
      | "CustomScreenScroll"
    )
    | undefined;
  enable: false;
};
export type DisableAllVFXPresetEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetVFXPreset";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset: "DisableAll";
};
export type SetVFXPresetEvent =
  | EnableOrdinaryVFXPresetEvent
  | EnableEaseableVFXPresetEvent
  | EnableColoredVFXPresetEvent
  | EnableWavyRowsVFXPresetEvent
  | EnableBloomVFXPresetEvent
  | EnableScreenVFXPresetEvent
  | DisableVFXPresetEvent
  | DisableAllVFXPresetEvent;
export type ImageSequence = string[] | string;
export type ContentMode =
  | "ScaleToFill"
  | "AspectFit"
  | "AspectFill"
  | "Center"
  | "Tiled"
  | "Real";
export type TilingType = "Scroll" | "Pulse";
export type SetBackgroundEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetBackgroundColor";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  backgroundType?: ("Color" | "Image") | undefined;
  image?: ImageSequence | undefined;
  color?: ColorOrPaletteIndex | undefined;
  fps?: number | undefined;
  contentMode?: ContentMode | undefined;
  filter?: FilterMode | undefined;
  tilingType?: TilingType | undefined;
  speed?: [
    number | null,
    number | null,
  ] | undefined;
  duration?: number | undefined;
  interval?: number | undefined;
  ease?: Easing | undefined;
  scrollX?: number | undefined;
  scrollY?: number | undefined;
};
export type SetForegroundEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetForeground";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  image?: ImageSequence | undefined;
  color?: ColorOrPaletteIndex | undefined;
  fps?: number | undefined;
  contentMode?: ContentMode | undefined;
  tilingType?: TilingType | undefined;
  speed?: [
    number | null,
    number | null,
  ] | undefined;
  duration?: number | undefined;
  interval?: number | undefined;
  ease?: Easing | undefined;
  scrollX?: number | undefined;
  scrollY?: number | undefined;
};
export type SetSpeedEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetSpeed";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  speed?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type FlashEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "Flash";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  duration?: ("Short" | "Medium" | "Long") | undefined;
};
export type CustomFlashEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "CustomFlash";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  startColor?: (ColorOrPaletteIndex | null) | undefined;
  startOpacity?: (number | null) | undefined;
  endColor?: (ColorOrPaletteIndex | null) | undefined;
  endOpacity?: (number | null) | undefined;
  background?: boolean | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type MoveCameraEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "MoveCamera";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  cameraPosition?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  zoom?: number | undefined;
  angle?: (number | null) | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
  real?: boolean | undefined;
};
export type HideRowEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "HideRow";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  show?:
    | (("Visible" | "Hidden" | "OnlyCharacter" | "OnlyRow") | boolean)
    | undefined;
  transition?: ("Smooth" | "Instant" | "Full") | undefined;
};
export type Expression = number | string | null;
export type MoveRowEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "MoveRow";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  target?: ("WholeRow" | "Character" | "Heart") | undefined;
  customPosition?: boolean | undefined;
  rowPosition?:
    | ([
      Expression,
      Expression,
    ] | null)
    | undefined;
  scale?:
    | ([
      Expression,
      Expression,
    ] | null)
    | undefined;
  angle?: (Expression | null) | undefined;
  pivot?: (number | null) | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type ReorderRowEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ReorderRow";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  newRoom?: (number | null) | undefined;
  order?: (number | null) | undefined;
  transition?: ("Smooth" | "Instant" | "None") | undefined;
};
export type PlayExpressionEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "PlayExpression";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  expression?: string | undefined;
  replace?: boolean | undefined;
  target?:
    | ("Neutral" | "Happy" | "Barely" | "Missed" | "Prehit" | "Beep")
    | undefined;
};
export type ChangeCharacterEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ChangeCharacter";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  row: number;
  character?: string | undefined;
  transition?: ("Smooth" | "Instant" | "Full") | undefined;
};
export type Border = "None" | "Outline" | "Glow";
export type PaintRowsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "TintRows";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  row: number;
  border?: Border | undefined;
  borderColor?: ColorOrPaletteIndex | undefined;
  borderOpacity?: number | undefined;
  tint?: boolean | undefined;
  tintColor?: ColorOrPaletteIndex | undefined;
  tintOpacity?: number | undefined;
  opacity?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
  effect?: ("None" | "Electric") | undefined;
};
export type Strength = "Low" | "Medium" | "High";
export type BassDropEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "BassDrop";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  strength?: Strength | undefined;
};
export type CustomShakeEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ShakeScreenCustom";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  shakeType?: ("Normal" | "Smooth" | "Rotate" | "BassDrop") | undefined;
  duration?: number | undefined;
  amplitude?: number | undefined;
  frequency?: number | undefined;
  fadeOut?: boolean | undefined;
  useBeats?: boolean | undefined;
};
export type ShakeScreenEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ShakeScreen";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  shakeLevel?: Strength | undefined;
  shakeType?: ("Normal" | "Smooth" | "Rotate" | "BassDrop") | undefined;
};
export type FlipScreenEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: (number | boolean) | undefined;
  type: "FlipScreen";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  flip?: boolean[] | undefined;
  x?: boolean | undefined;
  flipX?: boolean | undefined;
  flipY?: boolean | undefined;
};
export type InvertColorsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "InvertColors";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  enable?: boolean | undefined;
};
export type PulseCameraEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "PulseCamera";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  strength?: number | undefined;
  count?: number | undefined;
  frequency?: number | undefined;
};
export type TextExplosionEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "TextExplosion";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  text?: string | undefined;
  color?: ColorOrPaletteIndex | undefined;
  mode?: ("OneColor" | "Random") | undefined;
  direction?: ("Left" | "Right") | undefined;
  speed?: number | undefined;
  ease?: Easing | undefined;
};
export type Language =
  | "English"
  | "Spanish"
  | "Portuguese"
  | "ChineseSimplified"
  | "ChineseTraditional"
  | "Korean"
  | "Polish"
  | "Japanese"
  | "German";
export type ShowDialogueEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ShowDialogue";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  text?: string | undefined;
  speed?: number | undefined;
  localized?: boolean | undefined;
  panelSide?: ("Bottom" | "Top") | undefined;
  portraitSide?: ("Left" | "Right") | undefined;
  playTextSounds?: boolean | undefined;
  textEnglish?: string | undefined;
  textSpanish?: string | undefined;
  textPortuguese?: string | undefined;
  textChineseSimplified?: string | undefined;
  textChineseTraditional?: string | undefined;
  textKorean?: string | undefined;
  textPolish?: string | undefined;
  textJapanese?: string | undefined;
  textGerman?: string | undefined;
};
export type ShowStatusSignEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ShowStatusSign";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  text?: string | undefined;
  duration?: number | undefined;
  useBeats?: boolean | undefined;
  narrate?: boolean | undefined;
};
export type FloatingTextEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "FloatingText";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  id?: number | undefined;
  text?: string | undefined;
  times?: (string | null) | undefined;
  color?: ColorOrPaletteIndex | undefined;
  outlineColor?: ColorOrPaletteIndex | undefined;
  textPosition?: [
    number,
    number,
  ] | undefined;
  size?: number | undefined;
  angle?: number | undefined;
  showChildren?: boolean | undefined;
  fadeOutRate?: number | undefined;
  mode?: ("FadeOut" | "HideAbruptly") | undefined;
  anchor?:
    | (
      | "UpperLeft"
      | "UpperCenter"
      | "UpperRight"
      | "MiddleLeft"
      | "MiddleCenter"
      | "MiddleRight"
      | "LowerLeft"
      | "LowerCenter"
      | "LowerRight"
    )
    | undefined;
  narrate?: boolean | undefined;
  narrationCategory?: NarrationCategory | undefined;
};
export type AdvanceFloatingTextEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "AdvanceText";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  id?: number | undefined;
  fadeOutDuration?: (number | null) | undefined;
};
export type ChangePlayersRowsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ChangePlayersRows";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  playerMode?: ("OnePlayer" | "TwoPlayers" | "OneOrTwoPlayers") | undefined;
  players?: ("P1" | "P2" | "CPU" | "NoChange")[] | undefined;
  cpuMarkers?: string[] | undefined;
  flashingOnBeat?: boolean | undefined;
};
export type FinishLevelEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "FinishLevel";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
};
export type OrdinaryCommentEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "Comment";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  text: string;
  color?: ColorOrPaletteIndex | undefined;
  show?: boolean | undefined;
  tab?: ("Song" | "Actions" | "Rooms") | undefined;
};
export type SpriteCommentEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "Comment";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  text: string;
  color?: ColorOrPaletteIndex | undefined;
  show?: boolean | undefined;
  tab: "Sprites";
  target: string;
};
export type CommentEvent = OrdinaryCommentEvent | SpriteCommentEvent;
export type Hands = "Left" | "Right" | "p1" | "p2" | "Both";
export type ShowHandsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ShowHands";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  hand?: Hands | undefined;
  action?: ("Show" | "Hide" | "Raise" | "Lower") | undefined;
  extent?: ("Full" | "Short") | undefined;
  forceRaise?: boolean | undefined;
  align?: boolean | undefined;
  instant?: boolean | undefined;
};
export type PaintHandsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "PaintHands";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  hands?: Hands | undefined;
  border?: Border | undefined;
  borderColor?: ColorOrPaletteIndex | undefined;
  tint?: boolean | undefined;
  tintColor?: ColorOrPaletteIndex | undefined;
  opacity?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type AssignHandsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetHandOwner";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  hand?: Hands | undefined;
  character?: string | undefined;
};
export type TagActionEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "TagAction";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  Action?:
    | ("Run" | "RunAll" | "Enable" | "Disable" | "EnableAll" | "DisableAll")
    | undefined;
  Tag: string;
};
export type SetPlayStyleEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetPlayStyle";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  PlayStyle?:
    | (
      | "Normal"
      | "Loop"
      | "Prolong"
      | "Immediately"
      | "ExtraImmediately"
      | "ProlongOneBar"
      | "Default"
      | "OnNextBar"
      | "BeatLoopOnly"
      | "ScrubToNext"
      | "None"
    )
    | undefined;
  NextBar?: number | undefined;
  Relative?: boolean | undefined;
};
export type StutterEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "Stutter";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  action?: ("Add" | "Cancel") | undefined;
  sourceBeat?: number | undefined;
  length?: number | undefined;
  loops?: number | undefined;
};
export type CallCustomMethodEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "CallCustomMethod";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  methodName: string;
  executionTime?: ("OnPrebar" | "OnBar") | undefined;
  sortOffset?: number | undefined;
};
export type WindowDanceEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "NewWindowDance";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  preset?: ("Move" | "Sway" | "Wrap" | "Ellipse" | "ShakePer") | undefined;
  samePresetBehavior?: ("Keep" | "Reset") | undefined;
  position?: [
    number | null,
    number | null,
  ] | undefined;
  reference?: ("Center" | "Edge") | undefined;
  speed?: number | undefined;
  useCircle?: boolean | undefined;
  amplitude?: number | undefined;
  amplitudeVector?: [
    number | null,
    number | null,
  ] | undefined;
  angle?: number | undefined;
  frequency?: number | undefined;
  period?: number | undefined;
  subEase?: Easing | undefined;
  easeType?: ("Repeat" | "Mirror") | undefined;
  easingDuration?: number | undefined;
  ease?: Easing | undefined;
  usePosition?: ("New" | "Current") | undefined;
};
export type ResizeWindowEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "WindowResize";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  scale?:
    | ([
      Expression,
      Expression,
    ] | null)
    | undefined;
  pivot?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type ActionEvent =
  | SetThemeEvent
  | SetVFXPresetEvent
  | SetBackgroundEvent
  | SetForegroundEvent
  | SetSpeedEvent
  | FlashEvent
  | CustomFlashEvent
  | MoveCameraEvent
  | HideRowEvent
  | MoveRowEvent
  | ReorderRowEvent
  | PlayExpressionEvent
  | ChangeCharacterEvent
  | PaintRowsEvent
  | BassDropEvent
  | CustomShakeEvent
  | ShakeScreenEvent
  | FlipScreenEvent
  | InvertColorsEvent
  | PulseCameraEvent
  | TextExplosionEvent
  | ShowDialogueEvent
  | ShowStatusSignEvent
  | FloatingTextEvent
  | AdvanceFloatingTextEvent
  | ChangePlayersRowsEvent
  | FinishLevelEvent
  | CommentEvent
  | ShowHandsEvent
  | PaintHandsEvent
  | AssignHandsEvent
  | TagActionEvent
  | SetPlayStyleEvent
  | StutterEvent
  | CallCustomMethodEvent
  | WindowDanceEvent
  | ResizeWindowEvent;
export type MoveSpriteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "Move";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  position?:
    | ([
      Expression,
      Expression,
    ] | null)
    | undefined;
  scale?:
    | ([
      Expression,
      Expression,
    ] | null)
    | undefined;
  angle?: (Expression | null) | undefined;
  pivot?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type PaintSpriteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "Tint";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  border?: Border | undefined;
  borderColor?: ColorOrPaletteIndex | undefined;
  tint?: boolean | undefined;
  tintColor?: ColorOrPaletteIndex | undefined;
  opacity?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
  borderOpacity?: number | undefined;
  tintOpacity?: number | undefined;
};
export type PlayAnimationEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "PlayAnimation";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  expression?: string | undefined;
};
export type HideSpriteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "SetVisible";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  visible?: boolean | undefined;
};
export type ReorderSpriteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "ReorderSprite";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  newRoom?: (number | null) | undefined;
  depth?: (number | null) | undefined;
};
export type TileSpriteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "Tile";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  tiling?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  position?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  speed?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  tilingType?: TilingType | undefined;
  interval?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type BlendSpriteEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  type: "Blend";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  target: string;
  blendType?: ("None" | "Additive" | "Multiply" | "Invert") | undefined;
};
export type DecorationEvent =
  | MoveSpriteEvent
  | PaintSpriteEvent
  | PlayAnimationEvent
  | HideSpriteEvent
  | ReorderSpriteEvent
  | TileSpriteEvent
  | BlendSpriteEvent;
export type ShowRoomsHorizontallyEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ShowRooms";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  rooms?: number[] | undefined;
  heights?: number[] | undefined;
  transitionTime?: number | undefined;
  ease?: Easing | undefined;
};
export type MoveRoomEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "MoveRoom";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  roomPosition?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  scale?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  angle?: (number | null) | undefined;
  pivot?:
    | ([
      number | null,
      number | null,
    ] | null)
    | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type ReorderRoomsEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "ReorderRooms";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  order?: number[] | undefined;
};
export type SetRoomContentModeEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetRoomContentMode";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  mode?: ContentMode | undefined;
};
export type MaskRoomEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "MaskRoom";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  maskType?: ("Image" | "Room" | "Color" | "None") | undefined;
  image?: ImageSequence | undefined;
  fps?: number | undefined;
  sourceRoom?: number | undefined;
  keyColor?: ColorOrPaletteIndex | undefined;
  colorCutoff?: number | undefined;
  colorFeathering?: number | undefined;
  alphaMode?: ("Normal" | "Inverted") | undefined;
};
export type FadeRoomEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "FadeRoom";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  opacity?: number | undefined;
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type SetRoomPerspectiveEvent = {
  bar?: number | undefined;
  beat?: number | undefined;
  y?: number | undefined;
  type: "SetRoomPerspective";
  if?: ConditionExpression | undefined;
  tag?: string | undefined;
  runTag?: boolean | undefined;
  active?: boolean | undefined;
  cornerPositions: (number | null)[][];
  duration?: number | undefined;
  ease?: Easing | undefined;
};
export type RoomEvent =
  | ShowRoomsHorizontallyEvent
  | MoveRoomEvent
  | ReorderRoomsEvent
  | SetRoomContentModeEvent
  | MaskRoomEvent
  | FadeRoomEvent
  | SetRoomPerspectiveEvent;
export type Event =
  | SoundEvent
  | RowEvent
  | ActionEvent
  | DecorationEvent
  | RoomEvent;
export type LastHitConditional = {
  type: "LastHit";
  tag?: string | undefined;
  name: string;
  id: number;
  row?: number | undefined;
  result?:
    | (
      | "Perfect"
      | "SlightlyEarly"
      | "SlightlyLate"
      | "VeryEarly"
      | "VeryLate"
      | "AnyEarlyOrLate"
      | "Missed"
    )
    | undefined;
};
export type CustomConditional = {
  type: "Custom";
  tag?: string | undefined;
  name: string;
  id: number;
  expression: string;
};
export type TimesExecutedConditional = {
  type: "TimesExecuted";
  tag?: string | undefined;
  name: string;
  id: number;
  maxTimes?: number | undefined;
};
export type LanguageConditional = {
  type: "Language";
  tag?: string | undefined;
  name: string;
  id: number;
  Language: Language;
};
export type PlayerModeConditional = {
  type: "PlayerMode";
  tag?: string | undefined;
  name: string;
  id: number;
  twoPlayerMode?: boolean | undefined;
};
export type Conditional =
  | LastHitConditional
  | CustomConditional
  | TimesExecutedConditional
  | LanguageConditional
  | PlayerModeConditional;
export type Bookmark = {
  bar: number;
  beat: number;
  color: number;
};
export type Color = string;
export type Level = {
  $schema?: string | undefined;
  settings?: Settings | undefined;
  rows: Row[];
  decorations?: Decoration[] | undefined;
  events: Event[];
  conditionals?: Conditional[] | undefined;
  bookmarks?: Bookmark[] | undefined;
  colorPalette?: Color[] | undefined;
};
