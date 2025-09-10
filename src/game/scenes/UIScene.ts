import Phaser from "phaser";

type UIData = {
	gameOver: boolean;
	timeSurvivedMs: number;
	win?: boolean;
	wave?: number;
};

export class UIScene extends Phaser.Scene {
	private timeText?: Phaser.GameObjects.Text;
	private gameOverText?: Phaser.GameObjects.Text;

	constructor() {
		super({ key: "UIScene" });
	}

	create(data: UIData) {
		const style: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "18px",
			color: "#e8e1f3",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 6, fill: true },
		};

		this.timeText = this.add.text(16, 16, "Time: 0.0s", style).setScrollFactor(0);
		const waveText = this.add.text(16, 44, `Wave: ${data.wave ?? 1}`, style).setScrollFactor(0);
		this.add
			.text(16, 72, "Space: Jump  •  Up/Down: Climb", { ...style, fontSize: "14px", color: "#c8b9ea" })
			.setScrollFactor(0);

		this.events.on("tick", (elapsedMs: number) => {
			this.timeText?.setText(`Time: ${(elapsedMs / 1000).toFixed(1)}s`);
		});
		this.events.on("wave", (waveIndex: number) => {
			waveText?.setText(`Wave: ${waveIndex}`);
		});

		if (data.gameOver && !data.win) {
			this.showGameOver(data.timeSurvivedMs);
		} else if (data.win) {
			this.showWin(data.timeSurvivedMs);
		}
	}

	private showGameOver(timeMs: number) {
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;
		const style: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "36px",
			color: "#ff4d4f",
			align: "center",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 10, fill: true },
		};
		this.gameOverText = this.add
			.text(centerX, centerY, `Game Over\nTime: ${(timeMs / 1000).toFixed(1)}s\nPress R to Retry`, style)
			.setOrigin(0.5);

		this.input.keyboard?.once("keydown-R", () => {
			this.scene.stop();
			this.scene.stop("GameScene");
			this.scene.start("GameScene");
			this.scene.launch("UIScene", { gameOver: false, timeSurvivedMs: 0 });
		});
	}

	private showWin(timeMs: number) {
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;
		const style: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "36px",
			color: "#22c55e",
			align: "center",
			shadow: { offsetX: 0, offsetY: 0, color: "#000000", blur: 10, fill: true },
		};
		this.gameOverText = this.add
			.text(centerX, centerY, `You Reached The Top!\nTime: ${(timeMs / 1000).toFixed(1)}s\nPress R to Retry`, style)
			.setOrigin(0.5);

		this.input.keyboard?.once("keydown-R", () => {
			this.scene.stop();
			this.scene.stop("GameScene");
			this.scene.start("GameScene");
			this.scene.launch("UIScene", { gameOver: false, timeSurvivedMs: 0 });
		});
	}
}


