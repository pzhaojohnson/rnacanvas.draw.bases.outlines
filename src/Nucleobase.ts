/**
 * The nucleobase interface used by base outlines.
 */
export interface Nucleobase {
  readonly centerPoint: {
    readonly x: number;
    readonly y: number;

    /**
     * Allows one to listen for when the center point of th nucleobase moves
     * (i.e., when its X or Y coordinates change).
     */
    addEventListener(name: 'move', listener: () => void): void;

    removeEventListener(name: 'move', listener: () => void): void;
  }
}
