import * as Phaser from "phaser";
import { PlayerController, type SlopeGeometry } from "../systems/PlayerController";
import { BoulderSpawner } from "../systems/BoulderSpawner";
import { BowlerAnimator } from "../systems/BowlerAnimator";
import { WaveManager } from "../systems/WaveManager";
import { ScoreTimer } from "../systems/ScoreTimer";

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private elapsedMs = 0;
  private slope!: SlopeGeometry;
  private player!: PlayerController;
  private spawner!: BoulderSpawner;
  private bowler!: BowlerAnimator;
  private waves!: WaveManager;
  private timer = new ScoreTimer();

  constructor() {
    super({ key: "GameScene" });
  }

  init(data?: { resetWaves?: boolean }) {
    this.elapsedMs = 0;
    this.waves = new WaveManager(this);
    if (data?.resetWaves !== false) {
      this.waves.reset();
    }
    this.registry.set('waveIndex', this.waves.index);
    this.timer.reset();
  }

  restart() {
    if (this.player) {
      this.player.reset();
    }
    if (this.spawner) {
      this.spawner.reset();
    }
    if (this.bowler) {
      const params = this.waves.update(0).params;
      this.bowler.reset(params.spawnEveryMs);
    }
    this.elapsedMs = 0;
    this.timer.reset();
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Create a subtle downward curve that matches the purple rocky background terrain
    // The terrain has a gentle downward bevel/curve from left to right
    const bottom = new Phaser.Math.Vector2(0, h * 0.8); // Start at moderate height on the left
    const top = new Phaser.Math.Vector2(w, h * 0.46); // End lower on the right with subtle curve
    // Control points for a subtle downward-curving rocky terrain
    const control1 = new Phaser.Math.Vector2(w * 0.2, h * 0.81); // Gentle start, slightly higher
    const control2 = new Phaser.Math.Vector2(w * 0.5, h * 0.85);  // Subtle downward curve in middle
    const control3 = new Phaser.Math.Vector2(w * 0.8, h * 0.67); // Gentle downward curve to end
    
    const vec = top.clone().subtract(bottom);
    this.slope = {
      bottom,
      top,
      control: control1, // Keep for backward compatibility
      control1,
      control2,
      control3,
      unit: vec.clone().normalize(),
      normal: new Phaser.Math.Vector2(-vec.y, vec.x).normalize(),
      length: vec.length(),
      isCurved: true,
      curveType: 'cubic', // Use cubic Bezier for more complex curves
    };

    const bg = this.add.image(w / 2, h / 2, "gamebg");
    const scaleX = w / bg.width;
    const scaleY = h / bg.height;
    const scale = Math.max(scaleX, scaleY); 
    bg.setScale(scale);
    bg.setOrigin(0.5);

    this.player = new PlayerController(this, this.slope, {});
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.spawner = new BoulderSpawner(this, this.slope);
    this.bowler = new BowlerAnimator(this, this.slope, () => {
      const origin = this.bowler.getThrowOrigin();
      this.spawner.spawnFromWorldPosition(origin.x, origin.y);
    });
    const initialParams = this.waves.update(0).params;
    this.bowler.setCycleFromInterval(initialParams.spawnEveryMs);
    
    this.registry.set('waveIndex', this.waves.index);
    this.scene.launch("UIScene", { gameOver: false, timeSurvivedMs: 0, wave: this.waves.index });

    this.events.on("shutdown", () => {
      this.player.destroy();
      this.spawner.destroy();
      this.bowler.destroy();
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

    // Bowler
    this.bowler.update(delta);

    const baseSpeed = 110 + this.elapsedMs * 0.045;
    this.spawner.update(delta, Number.MAX_SAFE_INTEGER, baseSpeed * waveParams.speedMultiplier);
    if (waveUpdate.changed) {
      this.bowler.setCycleFromInterval(waveParams.spawnEveryMs);
    }

    // Collisions
    if (this.spawner.collides(this.player.getCenter(), this.player.getRadius())) {
      // Reset wave state for game over
      this.waves.reset();
      this.scene.start("UIScene", { gameOver: true, timeSurvivedMs: this.elapsedMs, wave: this.waves.index });
      this.scene.sleep();
      return;
    }

    // Win - progress to next wave
    if (this.player.getS() >= 0.98) {
      this.waves.nextWave();
      // Emit wave change event before starting UIScene
      this.scene.get("UIScene")?.events.emit("wave", this.waves.index);
      this.scene.start("UIScene", { gameOver: false, timeSurvivedMs: this.elapsedMs, win: true, wave: this.waves.index, nextWave: true });
      this.scene.sleep();
      return;
    }

    // UI tick only if UIScene is active
    const ui = this.scene.get("UIScene");
    if (ui && ui.scene.isActive()) {
      ui.events.emit("tick", this.elapsedMs);
    }
  }

  // Helper methods removed - handled by systems
}


