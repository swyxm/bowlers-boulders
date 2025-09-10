import * as Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    const g1 = this.add.graphics();
    g1.fillStyle(0x6ee7b7, 1);
    g1.fillRoundedRect(0, 0, 32, 48, 6);
    g1.generateTexture("player", 32, 48);
    g1.destroy();

    this.load.image("boulder", "/assets/boulder.png");
    this.load.image("gamebg", "/assets/gamebg.png");

    this.load.image("bowler1", "/assets/bowler/bowler1.png");
    this.load.image("bowler2", "/assets/bowler/bowler2.png");
    this.load.image("bowler3", "/assets/bowler/bowler3.png");
    this.load.image("bowler4", "/assets/bowler/bowler4.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}


