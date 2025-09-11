import * as Phaser from "phaser";

type BootData = {
  selectedCharacter?: string;
};

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  init(data: BootData) {
    this.registry.set("selectedCharacter", data?.selectedCharacter ?? null);
  }

  create() {
    this.scene.start("PreloadScene");
  }
}


