export type WaveParams = {
  spawnEveryMs: number;
  speedMultiplier: number;
  waveDurationMs: number;
};

export class WaveManager {
  private waveIndex = 1;

  update(_deltaMs: number): { changed: boolean; params: WaveParams } {
    // No time-based wave progression - waves advance when reaching top
    return { changed: false, params: this.currentParams() };
  }

  nextWave() {
    this.waveIndex += 1;
  }

  get index() {
    return this.waveIndex;
  }

  private currentParams(): WaveParams {
    const baseInterval = 1600;
    const interval = Math.max(1100, baseInterval - (this.waveIndex - 1) * 60);
    const speedMultiplier = 1 + (this.waveIndex - 1) * 0.1;
    return { spawnEveryMs: interval, speedMultiplier, waveDurationMs: 0 }; // No duration needed
  }

  reset() {
    this.waveIndex = 1;
  }
}


