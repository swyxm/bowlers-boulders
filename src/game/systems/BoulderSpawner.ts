import * as Phaser from "phaser";
import type { SlopeGeometry } from "./PlayerController";

export type Boulder = {
  sprite: Phaser.GameObjects.Image;
  s: number;
  radius: number;
  rollDeg: number;
  speedMultiplier: number;
};

export class BoulderSpawner {
  private scene: Phaser.Scene;
  private slope: SlopeGeometry;
  private boulders: Boulder[] = [];
  private spawnAccumulatorMs = 0;
  private boulderCountThisWave = 0;

  constructor(scene: Phaser.Scene, slope: SlopeGeometry) {
    this.scene = scene;
    this.slope = slope;
  }

  update(deltaMs: number, spawnEveryMs: number, speed: number) {
    const dt = deltaMs / 1000;
    this.spawnAccumulatorMs += deltaMs;
    if (this.spawnAccumulatorMs >= spawnEveryMs) {
      this.spawnAccumulatorMs = 0;
      this.spawn();
    }

    for (let i = this.boulders.length - 1; i >= 0; i--) {
      const b = this.boulders[i];
      const effectiveSpeed = speed * b.speedMultiplier;
      const ds = (effectiveSpeed * dt) / this.slope.length;
      b.s -= ds;
      b.rollDeg -= (effectiveSpeed * dt) / Math.max(10, b.radius) * 30;
      const pos = this.pointAtS(b.s).add(this.slope.normal.clone().scale(-b.radius));
      b.sprite.setPosition(pos.x, pos.y);
      b.sprite.setRotation(Math.atan2(this.slope.unit.y, this.slope.unit.x) + Phaser.Math.DegToRad(b.rollDeg));
      if (b.s <= -0.05) {
        b.sprite.destroy();
        this.boulders.splice(i, 1);
      }
    }
  }

  collides(center: Phaser.Math.Vector2, radius: number): boolean {
    for (const b of this.boulders) {
      const d = Phaser.Math.Distance.Between(center.x, center.y, b.sprite.x, b.sprite.y);
      if (d <= radius + b.radius) return true;
    }
    return false;
  }

  reset() {
    for (const b of this.boulders) b.sprite.destroy();
    this.boulders = [];
    this.spawnAccumulatorMs = 0;
    this.boulderCountThisWave = 0;
  }

  destroy() {
    this.reset();
  }

  private spawn() {
    const s = Phaser.Math.FloatBetween(0.88, 0.98);
    const radius = Phaser.Math.Between(18, 28);
    const sprite = this.scene.add.image(0, 0, "boulder").setOrigin(0.5);
    sprite.setDisplaySize(radius * 2, radius * 2);
    const pos = this.pointAtS(s).add(this.slope.normal.clone().scale(-radius));
    sprite.setPosition(pos.x, pos.y);
    sprite.setRotation(Math.atan2(this.slope.unit.y, this.slope.unit.x));
    

    this.boulderCountThisWave++;
    const speedMultiplier = this.boulderCountThisWave <= 2 ? 3.0 : 1.0;
    
    this.boulders.push({ sprite, s, radius, rollDeg: 0, speedMultiplier });
  }

  spawnFromWorldPosition(worldX: number, worldY: number) {
    const radius = Phaser.Math.Between(18, 28);
    const sprite = this.scene.add.image(worldX, worldY, "boulder").setOrigin(0.5);
    sprite.setDisplaySize(radius * 2, radius * 2);
    sprite.setRotation(Math.atan2(this.slope.unit.y, this.slope.unit.x));
    const fromBottom = new Phaser.Math.Vector2(worldX, worldY).subtract(this.slope.bottom);
    const s = Phaser.Math.Clamp(fromBottom.dot(this.slope.unit) / this.slope.length, 0, 1);
    this.boulderCountThisWave++;
    const speedMultiplier = this.boulderCountThisWave <= 2 ? 1.5 : 1.0;
    
    this.boulders.push({ sprite, s, radius, rollDeg: 0, speedMultiplier });
  }

  private pointAtS(s: number): Phaser.Math.Vector2 {
    const clamped = Phaser.Math.Clamp(s, 0, 1);
    
    if (this.slope.isCurved) {
      const t = clamped;
      
      if (this.slope.curveType === 'cubic' && this.slope.control1 && this.slope.control2 && this.slope.control3) {
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
      return this.slope.bottom.clone().add(this.slope.unit.clone().scale(this.slope.length * clamped));
    }
  }
}


