"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { BootScene } from "../game/scenes/BootScene";
import { PreloadScene } from "../game/scenes/PreloadScene";
import { GameScene } from "../game/scenes/GameScene";
import { UIScene } from "../game/scenes/UIScene";

type GameCanvasProps = {
  selectedCharacter?: string | null;
};

export default function GameCanvas({ selectedCharacter }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (gameRef.current) return;

    // Responsive: match container size via RESIZE
    const baseWidth = containerRef.current.clientWidth || 1920;
    const baseHeight = containerRef.current.clientHeight || 1080;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    // Use resolution at the top-level (per Phaser docs) to get crisp rendering on HiDPI
    const config: Phaser.Types.Core.GameConfig & { resolution?: number } = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#1b1329",
      resolution: dpr,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: baseWidth,
        height: baseHeight,
      },
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        powerPreference: "high-performance",
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 600 },
          debug: false,
        },
      },
      scene: [],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Add scenes and start flow
    game.scene.add("BootScene", BootScene, true, { selectedCharacter: selectedCharacter ?? undefined });
    game.scene.add("PreloadScene", PreloadScene, false);
    game.scene.add("GameScene", GameScene, false);
    game.scene.add("UIScene", UIScene, false);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [selectedCharacter]);

  return (
    <div className="w-full h-[100dvh]" ref={containerRef} />
  );
}


