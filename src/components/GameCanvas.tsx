"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { BootScene } from "@/game/scenes/BootScene";
import { PreloadScene } from "@/game/scenes/PreloadScene";
import { GameScene } from "@/game/scenes/GameScene";
import { UIScene } from "@/game/scenes/UIScene";

type GameCanvasProps = {
  selectedCharacter?: string | null;
};

export default function GameCanvas({ selectedCharacter }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (gameRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#0a0a0a",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
      },
      render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
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

    const handleResize = () => {
      if (!gameRef.current || !containerRef.current) return;
      const newWidth = containerRef.current.clientWidth || 800;
      const newHeight = containerRef.current.clientHeight || 600;
      gameRef.current.scale.resize(newWidth, newHeight);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [selectedCharacter]);

  return (
    <div className="w-full h-[100dvh]" ref={containerRef} />
  );
}


