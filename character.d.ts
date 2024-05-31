export type Clip = {
  name: string;
  frames: number[];
  loopStart?: number | undefined;
  loop: "yes" | "onBeat" | "no";
  fps: number;
  pivotOffset?: [
    number,
    number,
  ] | undefined;
  portraitOffset?: [
    number,
    number,
  ] | undefined;
  portraitSize?: [
    number,
    number,
  ] | undefined;
  portraitScale?: number | undefined;
};
export type Character = {
  $schema?: string | undefined;
  name?: string | undefined;
  voice?: string | undefined;
  size: [
    number,
    number,
  ];
  clips: Clip[];
  rowPreviewOffset?: [
    number,
    number,
  ] | undefined;
  rowPreviewFrame?: number | undefined;
  pivotOffset?: [
    number,
    number,
  ] | undefined;
  portraitOffset?: [
    number,
    number,
  ] | undefined;
  portraitSize?: [
    number,
    number,
  ] | undefined;
  portraitScale?: number | undefined;
};
