import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Generate placeholder textures so the scene works without external assets
    const g1 = this.add.graphics();
    g1.fillStyle(0x6ee7b7, 1);
    g1.fillRoundedRect(0, 0, 32, 48, 6);
    g1.generateTexture("player", 32, 48);
    g1.destroy();

    const g2 = this.add.graphics();
    g2.fillStyle(0x9ca3af, 1);
    g2.fillCircle(24, 24, 24);
    g2.generateTexture("boulder", 48, 48);
    g2.destroy();
  }

  create() {
    this.scene.start("GameScene");
  }
}


