import * as Phaser from "phaser";
import { PlayerController, type SlopeGeometry } from "../systems/PlayerController";
import { BoulderSpawner } from "../systems/BoulderSpawner";
import { WaveManager } from "../systems/WaveManager";
import { ScoreTimer } from "../systems/ScoreTimer";

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private elapsedMs = 0;
  private slope!: SlopeGeometry;
  private player!: PlayerController;
  private spawner!: BoulderSpawner;
  private waves = new WaveManager();
  private timer = new ScoreTimer();

  constructor() {
    super({ key: "GameScene" });
  }

  init() {
    this.elapsedMs = 0;
    this.waves.reset();
    this.timer.reset();
  }

  restart() {
    // Reset player position for next wave
    if (this.player) {
      this.player.reset();
    }
    if (this.spawner) {
      this.spawner.reset();
    }
    this.elapsedMs = 0;
    this.timer.reset();
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    const bottom = new Phaser.Math.Vector2(0, h);
    const top = new Phaser.Math.Vector2(w, 0.4 * h);
    const vec = top.clone().subtract(bottom);
    this.slope = {
      bottom,
      top,
      unit: vec.clone().normalize(),
      normal: new Phaser.Math.Vector2(-vec.y, vec.x).normalize(),
      length: vec.length(),
    };

    const g = this.add.graphics();
    g.fillStyle(0x0b0a10, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x2b2146, 1);
    g.beginPath();
    g.moveTo(this.slope.bottom.x, this.slope.bottom.y);
    g.lineTo(this.slope.top.x, this.slope.top.y);
    g.lineTo(w, h);
    g.closePath();
    g.fillPath();

    this.player = new PlayerController(this, this.slope, {});
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.spawner = new BoulderSpawner(this, this.slope);
    this.scene.launch("UIScene", { gameOver: false, timeSurvivedMs: 0, wave: 1 });

    this.events.on("shutdown", () => {
      this.player.destroy();
      this.spawner.destroy();
      this.time.removeAllEvents();
    });
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.elapsedMs = this.timer.update(delta);

    // Waves
    const waveUpdate = this.waves.update(delta);
    const waveParams = waveUpdate.params;
    if (waveUpdate.changed) this.scene.get("UIScene")?.events.emit("wave", this.waves.index);

    // Player
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    this.player.update(dt, this.cursors, jumpPressed);

    // Spawner
    const baseSpeed = 110 + this.elapsedMs * 0.045;
    this.spawner.update(delta, waveParams.spawnEveryMs, baseSpeed * waveParams.speedMultiplier);

    // Collisions
    if (this.spawner.collides(this.player.getCenter(), this.player.getRadius())) {
      this.scene.start("UIScene", { gameOver: true, timeSurvivedMs: this.elapsedMs, wave: this.waves.index });
      this.scene.pause();
      return;
    }

    // Win - progress to next wave
    if (this.player.getS() >= 0.98) {
      this.waves.nextWave();
      this.scene.start("UIScene", { gameOver: false, timeSurvivedMs: this.elapsedMs, win: true, wave: this.waves.index, nextWave: true });
      this.scene.pause();
      return;
    }

    // UI tick
    this.scene.get("UIScene")?.events.emit("tick", this.elapsedMs);
  }

  // Helper methods removed - handled by systems
}


