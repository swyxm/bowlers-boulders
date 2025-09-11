export type WaveParams = {
  spawnEveryMs: number;
  speedMultiplier: number;
  waveDurationMs: number;
};

export class WaveManager {
  private scene: Phaser.Scene;
  private registryKey = 'waveIndex';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private get waveIndex(): number {
    return this.scene.registry.get(this.registryKey) || 1;
  }

  private set waveIndex(value: number) {
    this.scene.registry.set(this.registryKey, value);
  }

  update(_deltaMs: number): { changed: boolean; params: WaveParams } {
    return { changed: false, params: this.currentParams() };
  }

  nextWave() {
    this.waveIndex += 1;
  }

  get index() {
    return this.waveIndex;
  }

  private currentParams(): WaveParams {
    const baseInterval = 2200;
    const interval = Math.max(900, baseInterval - (this.waveIndex - 1) * 140);
    const speedMultiplier = 1 + (this.waveIndex - 1) * 0.07; 
    return { spawnEveryMs: interval, speedMultiplier, waveDurationMs: 0 };
  }

  reset() {
    this.waveIndex = 1;
  }
}


