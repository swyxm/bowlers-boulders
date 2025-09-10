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
		// Use CSS-loaded fonts for HUD text
		const style: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "BowlerSubtext, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "18px",
			color: "#e8e1f3",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 6, fill: true },
		};
		this.timeText = this.add.text(16, 16, "Time: 0.0s", style).setScrollFactor(0);
		const currentWave = this.registry.get('waveIndex') || 1;
		const waveText = this.add.text(16, 44, `Wave: ${currentWave}`, style).setScrollFactor(0);
		this.add.text(16, 72, "Space: Jump  •  Up/Down: Climb", { ...style, fontSize: "14px", color: "#c8b9ea" }).setScrollFactor(0);
		this.events.on("tick", (elapsedMs: number) => this.timeText?.setText(`Time: ${(elapsedMs / 1000).toFixed(1)}s`));
		this.events.on("wave", (waveIndex: number) => waveText?.setText(`Wave: ${waveIndex}`));


		if (data.gameOver && !data.win) {
			this.showGameOver(data.timeSurvivedMs);
		} else if (data.win) {
			this.showWin(data.timeSurvivedMs, data.nextWave);
		}
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.events.removeAllListeners("tick");
			this.events.removeAllListeners("wave");
		});
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
		const subtextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "BowlerSubtext, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "18px",
			color: "#e8e1f3",
			align: "center",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 6, fill: true },
		};
		const text = this.add.text(centerX, centerY, `Game Over`, goStyle).setOrigin(0.5);
		this.add.text(centerX, centerY + 50, `Time: ${(timeMs / 1000).toFixed(1)}s`, subtextStyle).setOrigin(0.5);
		this.add.text(centerX, centerY + 80, `Press R to Retry`, subtextStyle).setOrigin(0.5);
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
		const subtextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "BowlerSubtext, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "18px",
			color: "#e8e1f3",
			align: "center",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 6, fill: true },
		};
		
		const mainMessage = nextWave ? `Wave Complete!` : `You Reached The Top!`;
		const text = this.add.text(centerX, centerY, mainMessage, winStyle).setOrigin(0.5);
		this.add.text(centerX, centerY + 50, `Time: ${(timeMs / 1000).toFixed(1)}s`, subtextStyle).setOrigin(0.5);
		const instructionText = nextWave ? `Press C to Continue to Next Wave` : `Press R to Retry`;
		this.add.text(centerX, centerY + 80, instructionText, subtextStyle).setOrigin(0.5);
		this.gameOverText = text;

		if (nextWave) {
			this.input.keyboard?.once("keydown-C", () => {
				this.scene.stop("UIScene");
				this.scene.stop("GameScene");
				this.scene.start("GameScene", { resetWaves: false });
			});
		} else {
			this.input.keyboard?.once("keydown-R", () => {
				this.scene.stop("UIScene");
				this.scene.stop("GameScene");
				this.scene.start("GameScene", { resetWaves: true });
			});
		}
	}
}


