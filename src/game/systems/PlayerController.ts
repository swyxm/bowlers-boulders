import * as Phaser from "phaser";

export type SlopeGeometry = {
  bottom: Phaser.Math.Vector2;
  top: Phaser.Math.Vector2;
  control: Phaser.Math.Vector2; // Control point for the curve (backward compatibility)
  control1?: Phaser.Math.Vector2; // First control point for cubic curve
  control2?: Phaser.Math.Vector2; // Second control point for cubic curve
  control3?: Phaser.Math.Vector2; // Third control point for cubic curve
  unit: Phaser.Math.Vector2; 
  normal: Phaser.Math.Vector2; 
  length: number;
  isCurved: boolean;
  curveType?: 'quadratic' | 'cubic'; // Type of curve
};

export type PlayerControllerOptions = {
  initialS?: number;
  radius?: number;
  climbPerSec?: number; 
  inputAccel?: number; 
  jumpVel?: number; 
  fallAccel?: number; 
  character?: string;
};

export class PlayerController {
  private scene: Phaser.Scene;
  private slope: SlopeGeometry;
  private sprite: Phaser.GameObjects.Image;
  private character: string;
  private currentKey: string;
  private walkTimerMs: number = 0;
  private isJumping: boolean = false;
  private readonly spriteScale = 0.25;
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
    this.character = opts.character ?? "archer";
    this.s = opts.initialS ?? 0.15;
    this.radius = opts.radius ?? 18;
    this.climbPerSec = opts.climbPerSec ?? 0.10;
    this.inputAccel = opts.inputAccel ?? 1;
    this.jumpVel = opts.jumpVel ?? 450;
    this.fallAccel = opts.fallAccel ?? 1100;

    this.currentKey = this.getSpriteKey("idle");
    this.sprite = this.scene.add.image(0, 0, this.currentKey).setOrigin(0.5).setScale(this.spriteScale);
    this.positionSprite();
  }

  public update(dtSec: number, cursors?: Phaser.Types.Input.Keyboard.CursorKeys, wasd?: Phaser.Types.Input.Keyboard.CursorKeys, jumpPressed?: boolean) {
    const forwardPressed = cursors?.up?.isDown || cursors?.right?.isDown || wasd?.up?.isDown || wasd?.right?.isDown;
    const backwardPressed = cursors?.down?.isDown || cursors?.left?.isDown || wasd?.down?.isDown || wasd?.left?.isDown;
    
    const target = this.grounded ? (forwardPressed ? 1 : backwardPressed ? -1 : 0) : 0;
    this.moveRate += (target - this.moveRate) * this.inputAccel * dtSec;

    this.s += this.moveRate * this.climbPerSec * dtSec;
    this.s = Phaser.Math.Clamp(this.s, 0, 1);

    if (jumpPressed && this.grounded) {
      this.setSpriteKey(this.getSpriteKey("squat"));
      this.timeOnce(80, () => {
        this.normalVel = this.jumpVel;
        this.grounded = false;
        this.isJumping = true;
        this.setSpriteKey(this.getSpriteKey("jump"));
      });
    }
    if (!this.grounded) {
      this.normalVel -= this.fallAccel * dtSec;
      this.normalOffset += this.normalVel * dtSec;
      if (this.normalOffset <= 0) {
        this.normalOffset = 0;
        this.normalVel = 0;
        this.grounded = true;
        this.isJumping = false;
      }
    }

    this.updateAnimation(dtSec);
    this.positionSprite();
  }

  private getSpriteKey(animation: string): string {
    const prefix = this.character === "witch" ? "witch" : "archer";
    switch (animation) {
      case "idle": return `${prefix}idle`;
      case "walk": return this.character === "witch" ? "witchwalk" : "archerstep";
      case "squat": return `${prefix}squat`;
      case "jump": return `${prefix}jump`;
      default: return `${prefix}idle`;
    }
  }

  private setSpriteKey(key: string) {
    if (this.currentKey === key) return;
    this.currentKey = key;
    this.sprite.setTexture(key);
  }

  private updateAnimation(dtSec: number) {
    if (this.isJumping) return;

    const moving = Math.abs(this.moveRate) > 0.05 && this.grounded;
    if (!moving) {
      this.setSpriteKey(this.getSpriteKey("idle"));
      this.walkTimerMs = 0;
      return;
    }

    this.walkTimerMs += dtSec * 1000;
    const periodMs = 220;
    const phase = Math.floor((this.walkTimerMs % (periodMs * 2)) / periodMs);
    this.setSpriteKey(phase === 0 ? this.getSpriteKey("idle") : this.getSpriteKey("walk"));
  }

  private timeOnce(delayMs: number, cb: () => void) {
    this.scene.time.delayedCall(delayMs, cb);
  }

  private positionSprite() {
    const pathPoint = this.pointAtS(this.s);
    const pos = pathPoint.add(this.slope.normal.clone().scale(-this.radius - this.normalOffset));
    this.sprite.setPosition(pos.x, pos.y - 10);
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
    
    if (this.slope.isCurved) {
      const t = clamped;
      
      if (this.slope.curveType === 'cubic' && this.slope.control1 && this.slope.control2 && this.slope.control3) {
        // Use cubic Bezier curve: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
        // where P₀ = bottom, P₁ = control1, P₂ = control2, P₃ = top
        const oneMinusT = 1 - t;
        const oneMinusTCubed = oneMinusT * oneMinusT * oneMinusT;
        const threeOneMinusTSquaredT = 3 * oneMinusT * oneMinusT * t;
        const threeOneMinusTTsquared = 3 * oneMinusT * t * t;
        const tCubed = t * t * t;
        
        const x = oneMinusTCubed * this.slope.bottom.x + 
                  threeOneMinusTSquaredT * this.slope.control1.x + 
                  threeOneMinusTTsquared * this.slope.control2.x + 
                  tCubed * this.slope.top.x;
        const y = oneMinusTCubed * this.slope.bottom.y + 
                  threeOneMinusTSquaredT * this.slope.control1.y + 
                  threeOneMinusTTsquared * this.slope.control2.y + 
                  tCubed * this.slope.top.y;
        
        return new Phaser.Math.Vector2(x, y);
      } else {
        // Fallback to quadratic Bezier curve
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const twoOneMinusTT = 2 * oneMinusT * t;
        const tSquared = t * t;
        
        const x = oneMinusTSquared * this.slope.bottom.x + 
                  twoOneMinusTT * this.slope.control.x + 
                  tSquared * this.slope.top.x;
        const y = oneMinusTSquared * this.slope.bottom.y + 
                  twoOneMinusTT * this.slope.control.y + 
                  tSquared * this.slope.top.y;
        
        return new Phaser.Math.Vector2(x, y);
      }
    } else {
      // Straight line (original behavior)
      return this.slope.bottom.clone().add(this.slope.unit.clone().scale(this.slope.length * clamped));
    }
  }
}


