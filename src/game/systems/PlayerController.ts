import * as Phaser from "phaser";

export type SlopeGeometry = {
  bottom: Phaser.Math.Vector2;
  top: Phaser.Math.Vector2;
  unit: Phaser.Math.Vector2; 
  normal: Phaser.Math.Vector2; 
  length: number;
};

export type PlayerControllerOptions = {
  initialS?: number;
  radius?: number;
  climbPerSec?: number; 
  inputAccel?: number; 
  jumpVel?: number; 
  fallAccel?: number; 
};

export class PlayerController {
  private scene: Phaser.Scene;
  private slope: SlopeGeometry;
  private sprite: Phaser.GameObjects.Image;
  private s: number;
  private radius: number;
  private normalOffset: number = 0;
  private normalVel: number = 0;
  private grounded: boolean = true;
  private moveRate: number = 0; 
  private readonly climbPerSec: number;
  private readonly inputAccel: number;
  private readonly jumpVel: number;
  private readonly fallAccel: number;

  constructor(scene: Phaser.Scene, slope: SlopeGeometry, opts: PlayerControllerOptions = {}) {
    this.scene = scene;
    this.slope = slope;
    this.s = opts.initialS ?? 0.15;
    this.radius = opts.radius ?? 18;
    this.climbPerSec = opts.climbPerSec ?? 0.22;
    this.inputAccel = opts.inputAccel ?? 7;
    this.jumpVel = opts.jumpVel ?? 560;
    this.fallAccel = opts.fallAccel ?? 1400;

    this.sprite = this.scene.add.image(0, 0, "player").setOrigin(0.5);
    this.positionSprite();
  }

  public update(dtSec: number, cursors?: Phaser.Types.Input.Keyboard.CursorKeys, jumpPressed?: boolean) {
    const target = this.grounded ? (cursors?.up?.isDown ? 1 : cursors?.down?.isDown ? -1 : 0) : 0;
    this.moveRate += (target - this.moveRate) * this.inputAccel * dtSec;

    this.s += this.moveRate * this.climbPerSec * dtSec;
    this.s = Phaser.Math.Clamp(this.s, 0, 1);

    if (jumpPressed && this.grounded) {
      this.normalVel = this.jumpVel;
      this.grounded = false;
    }
    if (!this.grounded) {
      this.normalVel -= this.fallAccel * dtSec;
      this.normalOffset += this.normalVel * dtSec;
      if (this.normalOffset <= 0) {
        this.normalOffset = 0;
        this.normalVel = 0;
        this.grounded = true;
      }
    }

    this.positionSprite();
  }

  private positionSprite() {
    const pathPoint = this.pointAtS(this.s);
    const pos = pathPoint.add(this.slope.normal.clone().scale(-this.radius - this.normalOffset));
    this.sprite.setPosition(pos.x, pos.y);
    this.sprite.setRotation(Math.atan2(this.slope.unit.y, this.slope.unit.x));
  }

  public getCenter(): Phaser.Math.Vector2 {
    const c = this.sprite.getCenter();
    return new Phaser.Math.Vector2(c.x, c.y);
  }

  public getRadius(): number {
    return this.radius;
  }

  public getS(): number {
    return this.s;
  }

  public reset() {
    this.s = 0.15;
    this.normalOffset = 0;
    this.normalVel = 0;
    this.grounded = true;
    this.moveRate = 0;
    this.positionSprite();
  }

  public destroy() {
    this.sprite.destroy();
  }

  private pointAtS(s: number): Phaser.Math.Vector2 {
    const clamped = Phaser.Math.Clamp(s, 0, 1);
    return this.slope.bottom.clone().add(this.slope.unit.clone().scale(this.slope.length * clamped));
  }
}


