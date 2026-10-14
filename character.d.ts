export type Clip = {
  name: string;
  frames: number[];
  events?:
    | Record<
      number,
      (string | {
        changeExpressionPrefix?: string | undefined;
        changeCharacter?: string | undefined;
        playClip?: string | undefined;
        playExpression?: string | undefined;
      })
    >
    | undefined;
  endEvent?: string | undefined;
  loopStart?: number | undefined;
  loop: "yes" | "freeze" | "onBeat" | "no";
  fps?: number | undefined;
  pivotOffset?: [number, number] | undefined;
  reflectionOffset?: number | undefined;
  portraitOffset?: [number, number] | undefined;
  portraitSize?: [number, number] | undefined;
  portraitName?: string | undefined;
  portraitScale?: number | undefined;
};
export type Character = {
  $schema?: string | undefined;
  name?: string | undefined;
  voice?: string | undefined;
  size: [number, number];
  clips: Clip[];
  rowPreviewOffset?: [number, number] | undefined;
  rowPreviewFrame?: number | undefined;
  rowPreviewScale?: number | undefined;
  pivotOffset?: [number, number] | undefined;
  reflectionOffset?: number | undefined;
  portraitOffset?: [number, number] | undefined;
  portraitSize?: [number, number] | undefined;
  portraitScale?: number | undefined;
};
