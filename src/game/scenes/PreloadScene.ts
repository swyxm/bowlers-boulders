import * as Phaser from "phaser";

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

    // Load bitmap font if provided by user
    this.load.bitmapFont("uiFont", "/assets/fonts/uiFont.png", "/assets/fonts/uiFont.fnt");
  }

  create() {
    this.scene.start("GameScene");
  }

  private createRuntimeBitmapFont() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789: .,!?'/-\\\n";
    const cellWidth = 32;
    const cellHeight = 48;
    const cols = 16;
    const rows = Math.ceil(chars.length / cols);

    const texKey = "uiFontSheet";
    const canvasTex = this.textures.createCanvas(texKey, cols * cellWidth, rows * cellHeight);
    if (!canvasTex) return;
    const ctx = (canvasTex as Phaser.Textures.CanvasTexture).getContext();
    ctx.save();
    ctx.scale(1, 1);
    ctx.clearRect(0, 0, (canvasTex as Phaser.Textures.CanvasTexture).width, (canvasTex as Phaser.Textures.CanvasTexture).height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.floor(cellHeight * 0.7)}px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`;

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      ctx.fillText(ch, x, y + 1);
    }
    ctx.restore();
    (canvasTex as Phaser.Textures.CanvasTexture).refresh();

    const retroCfg = {
      image: texKey,
      width: cellWidth,
      height: cellHeight,
      chars,
      charsPerRow: cols,
    };

    // @ts-expect-error RetroFont types may not be included in this Phaser types version
    const fontData = Phaser.GameObjects.RetroFont.Parse(this, retroCfg);
    this.cache.bitmapFont.add("uiFont", fontData);
  }
}


