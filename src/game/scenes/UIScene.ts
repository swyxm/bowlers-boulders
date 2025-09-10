import * as Phaser from "phaser";
import { GameScene } from "./GameScene";

type UIData = {
	gameOver: boolean;
	timeSurvivedMs: number;
	win?: boolean;
	wave?: number;
	nextWave?: boolean;
};

export class UIScene extends Phaser.Scene {
	private timeText?: Phaser.GameObjects.Text;
	private gameOverText?: Phaser.GameObjects.Text;

	constructor() {
		super({ key: "UIScene" });
	}

	create(data: UIData) {
		// Note: HUD now uses BitmapText; kept dpr for potential future sizing logic

		// Prefer bitmap font if loaded; fall back to Daydream text
		const hasBitmap = this.cache.bitmapFont.exists("uiFont");
		if (hasBitmap) {
			const time = this.add.bitmapText(16, 16, "uiFont", "Time: 0.0s", 28).setScrollFactor(0).setTint(0xe8e1f3);
			const wave = this.add.bitmapText(16, 44, "uiFont", `Wave: ${data.wave ?? 1}`, 28).setScrollFactor(0).setTint(0xe8e1f3);
			this.add.bitmapText(16, 72, "uiFont", "Space: Jump  •  Up/Down: Climb", 20).setScrollFactor(0).setTint(0xc8b9ea);
			this.events.on("tick", (elapsedMs: number) => time.setText(`Time: ${(elapsedMs / 1000).toFixed(1)}s`));
			this.events.on("wave", (waveIndex: number) => wave.setText(`Wave: ${waveIndex}`));
			// Store a dummy text to satisfy type
			this.timeText = this.add.text(-9999, -9999, "");
		} else {
			const style: Phaser.Types.GameObjects.Text.TextStyle = {
				fontFamily: "Daydream, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
				fontSize: "18px",
				color: "#e8e1f3",
				shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 6, fill: true },
			};
			this.timeText = this.add.text(16, 16, "Time: 0.0s", style).setScrollFactor(0);
			const waveText = this.add.text(16, 44, `Wave: ${data.wave ?? 1}`, style).setScrollFactor(0);
			this.add.text(16, 72, "Space: Jump  •  Up/Down: Climb", { ...style, fontSize: "14px", color: "#c8b9ea" }).setScrollFactor(0);
			this.events.on("tick", (elapsedMs: number) => this.timeText?.setText(`Time: ${(elapsedMs / 1000).toFixed(1)}s`));
			this.events.on("wave", (waveIndex: number) => waveText?.setText(`Wave: ${waveIndex}`));
		}

		// If using bitmap HUD, tick/wave handled above. For fallback text HUD, events set there.

		if (data.gameOver && !data.win) {
			this.showGameOver(data.timeSurvivedMs);
		} else if (data.win) {
			this.showWin(data.timeSurvivedMs, data.nextWave);
		}
	}

	private showGameOver(timeMs: number) {
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;
		const goStyle: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "Daydream, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "36px",
			color: "#ff4d4f",
			align: "center",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 10, fill: true },
		};
		const text = this.add.text(centerX, centerY, `Game Over\nTime: ${(timeMs / 1000).toFixed(1)}s\nPress R to Retry`, goStyle).setOrigin(0.5);
		this.gameOverText = text;

		this.input.keyboard?.once("keydown-R", () => {
			this.scene.stop("UIScene");
			this.scene.stop("GameScene");
			this.scene.start("GameScene");
		});
	}

	private showWin(timeMs: number, nextWave?: boolean) {
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;
		const winStyle: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "Daydream, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "36px",
			color: "#22c55e",
			align: "center",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 10, fill: true },
		};
		
		const message = nextWave 
			? `Wave Complete!\nTime: ${(timeMs / 1000).toFixed(1)}s\nPress C to Continue to Next Wave`
			: `You Reached The Top!\nTime: ${(timeMs / 1000).toFixed(1)}s\nPress R to Retry`;
		const text = this.add.text(centerX, centerY, message, winStyle).setOrigin(0.5);
		this.gameOverText = text;

		if (nextWave) {
			this.input.keyboard?.once("keydown-C", () => {
				this.scene.stop("UIScene");
				const gameScene = this.scene.get("GameScene") as GameScene;
				gameScene.restart();
				this.scene.resume("GameScene");
			});
		} else {
			this.input.keyboard?.once("keydown-R", () => {
				this.scene.stop("UIScene");
				this.scene.stop("GameScene");
				this.scene.start("GameScene");
			});
		}
	}
}


