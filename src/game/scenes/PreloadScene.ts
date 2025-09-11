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

    this.load.image("archeridle", "/assets/archer/archeridle.png");
    this.load.image("archerstep", "/assets/archer/archerstep.png");
    this.load.image("archersquat", "/assets/archer/archersquat.png");
    this.load.image("archerjump", "/assets/archer/archerjump.png");
    
    this.load.image("witchidle", "/assets/witch/witchidle.png");
    this.load.image("witchwalk", "/assets/witch/witchwalk.png");
    this.load.image("witchsquat", "/assets/witch/witchsquat.png");
    this.load.image("witchjump", "/assets/witch/witchjump.png");
    
    this.load.image("bowlersad", "/assets/bowlersad.png");
    
    this.load.audio("bowlinggameover1", "/assets/bowlinggameover1.mp3");
    this.load.audio("bowlinggameover2", "/assets/bowlinggameover2.mp3");
    this.load.audio("bowlingwin1", "/assets/bowlingwin1.mp3");
    this.load.audio("bowlingwin2", "/assets/bowlingwin2.mp3");

    this.load.once('complete', async () => {
      try {
        const fontsApi = (document as Document & { fonts?: FontFaceSet }).fonts;
        if (fontsApi && 'load' in fontsApi) {
          await Promise.race([
            Promise.all([
              fontsApi.load('18px "BowlerSubtext"'),
              fontsApi.ready,
            ]),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
        }
      } catch {
      }
      this.scene.start("GameScene");
    });
  }

  create() {}
}


