import Phaser from "phaser";

type Boulder = {
  sprite: Phaser.GameObjects.Image;
  s: number; // 0 bottom, 1 top
  radius: number;
  rollAngleDeg: number;
  speed: number; // px/s along slope
};

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private elapsedMs: number = 0;
  private slopeBottom!: Phaser.Math.Vector2;
  private slopeTop!: Phaser.Math.Vector2;
  private slopeUnit!: Phaser.Math.Vector2;
  private slopeNormal!: Phaser.Math.Vector2;
  private slopeLength!: number;
  private playerSprite!: Phaser.GameObjects.Image;
  private playerS: number = 0.15;
  private playerRadius: number = 18;
  private playerNormalOffset: number = 0; // distance away from slope along normal
  private playerNormalVel: number = 0; // velocity along normal (px/s)
  private grounded: boolean = true;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private boulders: Boulder[] = [];
  private spawnAccumulatorMs: number = 0;
  private waveIndex: number = 1;
  private waveElapsedMs: number = 0;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Slope geometry
    this.slopeBottom = new Phaser.Math.Vector2(0, h);
    this.slopeTop = new Phaser.Math.Vector2(w, 0.4 * h);
    const slopeVec = this.slopeTop.clone().subtract(this.slopeBottom);
    this.slopeLength = slopeVec.length();
    this.slopeUnit = slopeVec.clone().normalize();
    this.slopeNormal = new Phaser.Math.Vector2(-this.slopeUnit.y, this.slopeUnit.x); // left-hand normal

    // Background
    const g = this.add.graphics();
    g.fillStyle(0x0b0a10, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x2b2146, 1);
    g.beginPath();
    g.moveTo(this.slopeBottom.x, this.slopeBottom.y);
    g.lineTo(this.slopeTop.x, this.slopeTop.y);
    g.lineTo(w, h);
    g.closePath();
    g.fillPath();

    // Player attached to slope path
    this.playerSprite = this.add.image(0, 0, "player");
    this.playerSprite.setOrigin(0.5);
    this.playerS = 0.15;
    this.positionPlayer();

    // Controls
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Launch UI scene on top
    this.scene.launch("UIScene", { gameOver: false, timeSurvivedMs: 0, wave: this.waveIndex });
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.elapsedMs += delta;
    this.waveElapsedMs += delta;

    // Wave system
    const { spawnEveryMs, speedMultiplier, waveDurationMs } = this.getWaveParams();
    if (this.waveElapsedMs >= waveDurationMs) {
      this.waveIndex += 1;
      this.waveElapsedMs = 0;
      const ui = this.scene.get("UIScene");
      ui?.events.emit("wave", this.waveIndex);
    }

    // Spawning
    this.spawnAccumulatorMs += delta;
    if (this.spawnAccumulatorMs >= spawnEveryMs) {
      this.spawnAccumulatorMs = 0;
      this.spawnBoulder(speedMultiplier);
    }

    // Player traverse along slope
    if (this.cursors?.up?.isDown) this.playerS += 0.45 * dt;
    if (this.cursors?.down?.isDown) this.playerS -= 0.55 * dt;
    this.playerS = Phaser.Math.Clamp(this.playerS, 0, 1);
    // Jump with Space along normal
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.grounded) {
      this.playerNormalVel = 520;
      this.grounded = false;
    }
    if (!this.grounded) {
      this.playerNormalVel -= 1350 * dt; // gravity back to slope (tuned)
      this.playerNormalOffset += this.playerNormalVel * dt;
      if (this.playerNormalOffset <= 0) {
        this.playerNormalOffset = 0;
        this.playerNormalVel = 0;
        this.grounded = true;
      }
    }
    this.positionPlayer();

    // Move boulders along slope
    for (let i = this.boulders.length - 1; i >= 0; i--) {
      const b = this.boulders[i];
      const baseSpeed = 140 + this.elapsedMs * 0.08; // ramp with time
      const speed = baseSpeed * speedMultiplier;
      const ds = (speed * dt) / this.slopeLength;
      b.s -= ds;
      b.rollAngleDeg -= (speed * dt) / Math.max(10, b.radius) * 30;
      const pos = this.pointAtS(b.s).add(this.slopeNormal.clone().scale(-b.radius));
      b.sprite.setPosition(pos.x, pos.y);
      const baseRot = Math.atan2(this.slopeUnit.y, this.slopeUnit.x);
      b.sprite.setRotation(baseRot + Phaser.Math.DegToRad(b.rollAngleDeg));

      // Cull at bottom
      if (b.s <= -0.05) {
        b.sprite.destroy();
        this.boulders.splice(i, 1);
        continue;
      }

      // Collision: simple circle vs circle (upright logic)
      const p = this.playerSprite.getCenter();
      const dist = Phaser.Math.Distance.Between(p.x, p.y, b.sprite.x, b.sprite.y);
      if (dist <= this.playerRadius + b.radius) {
        this.scene.start("UIScene", { gameOver: true, timeSurvivedMs: this.elapsedMs, wave: this.waveIndex });
        this.scene.pause();
        return;
      }
    }

    // Win when reaching top
    if (this.playerS >= 0.98) {
      this.scene.start("UIScene", { gameOver: false, timeSurvivedMs: this.elapsedMs, win: true, wave: this.waveIndex });
      this.scene.pause();
      return;
    }

    // Update UI
    const ui = this.scene.get("UIScene");
    ui?.events.emit("tick", this.elapsedMs);
  }

  private positionPlayer() {
    const base = this.pointAtS(this.playerS).add(this.slopeNormal.clone().scale(-this.playerRadius));
    const pos = base.add(this.slopeNormal.clone().scale(-this.playerNormalOffset));
    this.playerSprite.setPosition(pos.x, pos.y);
    this.playerSprite.setRotation(Math.atan2(this.slopeUnit.y, this.slopeUnit.x));
  }

  private pointAtS(s: number): Phaser.Math.Vector2 {
    const clamped = Phaser.Math.Clamp(s, 0, 1);
    const vec = this.slopeBottom.clone().add(this.slopeUnit.clone().scale(this.slopeLength * clamped));
    return vec;
  }

  private spawnBoulder(speedMultiplier: number) {
    // Spawn near top
    const s = Phaser.Math.FloatBetween(0.88, 0.98);
    const radius = Phaser.Math.Between(18, 28);
    const sprite = this.add.image(0, 0, "boulder");
    sprite.setOrigin(0.5);
    const pos = this.pointAtS(s).add(this.slopeNormal.clone().scale(-radius));
    sprite.setPosition(pos.x, pos.y);
    sprite.setRotation(Math.atan2(this.slopeUnit.y, this.slopeUnit.x));

    const b: Boulder = {
      sprite,
      s,
      radius,
      rollAngleDeg: 0,
      speed: 160 * speedMultiplier,
    };
    this.boulders.push(b);
  }

  private getWaveParams(): { spawnEveryMs: number; speedMultiplier: number; waveDurationMs: number } {
    // Gentle spawn; focus on speed ramping per wave
    const waveDurationMs = 18000; // 18s per wave
    const baseInterval = 1300; // ms
    const interval = Math.max(900, baseInterval - (this.waveIndex - 1) * 80);
    const speedMultiplier = 1 + (this.waveIndex - 1) * 0.15;
    return { spawnEveryMs: interval, speedMultiplier, waveDurationMs };
  }
}


