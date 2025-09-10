import * as Phaser from "phaser";
import type { SlopeGeometry } from "./PlayerController";

type BowlerFrame = "bowler1" | "bowler2" | "bowler3" | "bowler4";

export class BowlerAnimator {
  private scene: Phaser.Scene;
  private slope: SlopeGeometry;
  private container: Phaser.GameObjects.Container;
  private sprite: Phaser.GameObjects.Image;
  private elapsedMs = 0;
  private frameIndex = 0;
  private readonly frameOrder: BowlerFrame[] = ["bowler1", "bowler2", "bowler3", "bowler4"];
  private frameDurationsMs = [300, 220, 220, 260];
  private readonly containerWidth = 358;
  private readonly containerHeight = 400;
  private readonly bowlerScale = 0.35; 
  private onThrow?: () => void;

  constructor(scene: Phaser.Scene, slope: SlopeGeometry, onThrow?: () => void) {
    this.scene = scene;
    this.slope = slope;
    this.onThrow = onThrow;

    const topPoint = slope.top.clone();
    this.container = scene.add.container(topPoint.x, topPoint.y);

    const layoutZone = scene.add.zone(0, 0, this.containerWidth, this.containerHeight).setOrigin(0.5);
    this.container.add(layoutZone);

    this.sprite = scene.add.image(0, 0, this.frameOrder[0]).setOrigin(0.5).setScale(this.bowlerScale);
    this.container.add(this.sprite);

    const normalOffset = this.slope.normal.clone().scale(-24);
    this.container.x += normalOffset.x;
    this.container.y += normalOffset.y;
    this.container.y -= 24;
    this.container.x -= 20;
  }

  setCycleFromInterval(totalCycleMs: number) {
    const proportions = [300, 220, 220, 260];
    const sum = proportions.reduce((a, b) => a + b, 0);
    this.frameDurationsMs = proportions.map(p => Math.max(120, Math.round((p / sum) * totalCycleMs)));
  }

  reset(totalCycleMs?: number) {
    this.elapsedMs = 0;
    this.frameIndex = 0;
    const hasScene = (this.sprite as Phaser.GameObjects.Image | undefined)?.scene;
    if (!hasScene) {
      this.sprite?.destroy();
      this.sprite = this.scene.add.image(0, 0, this.frameOrder[0]).setOrigin(0.5).setScale(this.bowlerScale);
      this.container.addAt(this.sprite, Math.min(1, this.container.length));
    } else {
      this.sprite.setTexture(this.frameOrder[0]);
    }
    if (totalCycleMs) {
      this.setCycleFromInterval(totalCycleMs);
    }
  }

  update(deltaMs: number) {
    this.elapsedMs += deltaMs;
    const currentFrameDuration = this.frameDurationsMs[this.frameIndex];
    if (this.elapsedMs >= currentFrameDuration) {
      this.elapsedMs -= currentFrameDuration;
      this.frameIndex = (this.frameIndex + 1) % this.frameOrder.length;
      const key = this.frameOrder[this.frameIndex];
      this.sprite.setTexture(key);

      if (key === "bowler4" && this.onThrow) {
        this.onThrow();
      }
    }
  }

  getThrowOrigin(): Phaser.Math.Vector2 {
    // Spawn point slightly in front of bowler along slope direction
    const ahead = this.slope.unit.clone().scale(24);
    return new Phaser.Math.Vector2(this.container.x + ahead.x, this.container.y + ahead.y);
  }

  destroy() {
    this.container.destroy();
  }
}


