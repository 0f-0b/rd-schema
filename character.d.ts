export type Clip = {
  name: string;
  frames: number[];
  loopStart?: number | undefined;
  loop: "yes" | "onBeat" | "no";
  fps: number;
  portraitOffset?: number[] | undefined;
  portraitSize?: number[] | undefined;
  portraitScale?: number | undefined;
};
export type Character = {
  $schema?: string | undefined;
  name?: string | undefined;
  voice?: string | undefined;
  size: number[];
  clips: Clip[];
  rowPreviewOffset?: number[] | undefined;
  rowPreviewFrame?: number | undefined;
};
