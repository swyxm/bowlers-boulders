export class ScoreTimer {
  private elapsedMs = 0;
  update(deltaMs: number) {
    this.elapsedMs += deltaMs;
    return this.elapsedMs;
  }
  get ms() {
    return this.elapsedMs;
  }
  reset() {
    this.elapsedMs = 0;
  }
}


