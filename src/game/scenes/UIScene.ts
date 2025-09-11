import * as Phaser from "phaser";

const getMountainHeight = (x: number, width: number): number => {
  const normalizedX = x / width;
  
  const mainPeak = Math.sin(normalizedX * Math.PI * 1.5); 
  const subPeak = Math.sin(normalizedX * Math.PI * 3 + 0.5) * 0.4; 
  
  const jitterSize = 20;
  const jitterX = Math.floor(normalizedX * width / jitterSize) * jitterSize / width;
  const jitter = Math.sin(jitterX * Math.PI * 12) * 0.1; 
  
  const combinedHeight = mainPeak + subPeak + jitter;
  
  const valleyHeight = 0.85; 
  const peakHeight = 0.4;   
  const heightRange = valleyHeight - peakHeight;
  
  const normalizedHeight = (combinedHeight + 1) / 2;
  return peakHeight + (1 - normalizedHeight) * heightRange;
};

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
	private mountainGraphics?: Phaser.GameObjects.Graphics;

	constructor() {
		super({ key: "UIScene" });
	}

	create(data: UIData) {
		if (data.gameOver || data.win) {
			this.createMountainBackground();
		}
		this.time.delayedCall(0, async () => {
			try {
				const fontsApi = (document as Document & { fonts?: FontFaceSet }).fonts;
				if (fontsApi && 'load' in fontsApi) {
					await Promise.race([
						Promise.all([
							fontsApi.load('18px "BowlerSubtext"'),
							fontsApi.load('36px "Daydream"'),
							fontsApi.load('48px "Daydream"'),
							fontsApi.ready,
						]),
						new Promise((resolve) => setTimeout(resolve, 500)), 
					]);
				}
			} catch {}
			this.createHUDText(data);
			if (data.gameOver && !data.win) {
				this.showGameOver(data.timeSurvivedMs);
			} else if (data.win) {
				this.showWin(data.timeSurvivedMs, data.nextWave);
			}
		});

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.events.removeAllListeners("tick");
			this.events.removeAllListeners("wave");
		});
	}

	private createHUDText(data: UIData) {
		const style: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "BowlerSubtext, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "18px",
			color: "#4f4b57",
			resolution: typeof window !== "undefined" ? Math.max(1, window.devicePixelRatio || 1) : 2, // Max DPI rendering
		};
		
		const x = 22; 
		const y1 = 20;
		const y2 = 48;
		const y3 = 76;
		
		this.timeText = this.add.text(x, y1, "Time: 0.0s", style).setScrollFactor(0);
		
		const currentWave = data.wave || this.registry.get('waveIndex') || 1;
		const waveText = this.add.text(x, y2, `Wave: ${currentWave}`, style).setScrollFactor(0);
		this.add.text(x, y3, "Space: Jump  •  Arrow Keys or WASD: Move", { ...style, fontSize: "14px", color: "#c8b9ea" }).setScrollFactor(0);
		
		this.events.on("tick", (elapsedMs: number) => this.timeText?.setText(`Time: ${(elapsedMs / 1000).toFixed(1)}s`));
		this.events.on("wave", (waveIndex: number) => waveText?.setText(`Wave: ${waveIndex}`));
	}

	private createMountainBackground() {
		const w = this.scale.width;
		const h = this.scale.height;
		
		this.mountainGraphics = this.add.graphics();
		this.mountainGraphics.setScrollFactor(0);
		
		const dotSize = 2;
		const spacing = 6;
		
		for (let x = 0; x < w; x += spacing) {
			for (let y = 0; y < h; y += spacing) {
				const mountainHeight = getMountainHeight(x, w);
				const normalizedY = y / h;
				
				let color = 0x613df2; 
				
				if (normalizedY > mountainHeight) {
					color = 0x39219c; 
				}
				
				this.mountainGraphics.fillStyle(color, 0.5); 
				this.mountainGraphics.fillRect(x, y, dotSize, dotSize);
			}
		}
	}

	private createButton(x: number, y: number, text: string, callback: () => void) {
		const buttonWidth = Math.max(120, text.length * 12 + 20);
		
		const button = this.add.rectangle(x, y, buttonWidth, 40, 0x6b7280, 1);
		button.setScrollFactor(0);
		button.setStrokeStyle(2, 0x000000);
		button.setInteractive();
		button.setDepth(1000);
		
		const buttonText = this.add.text(x, y, text, {
			fontFamily: "BowlerSubtext, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "16px",
			color: "#ffffff",
			align: "center"
		}).setOrigin(0.5).setScrollFactor(0).setDepth(1001); 
		
		button.on('pointerover', () => {
			button.setFillStyle(0x8d7cc2);
			button.setScale(1.05);
			buttonText.setScale(1.05);
		});
		
		button.on('pointerout', () => {
			button.setFillStyle(0x6b7280);
			button.setScale(1);
			buttonText.setScale(1);
		});
		
		button.on('pointerdown', callback);
	}

	private createHomeButton(x: number = 80, y: number = 40) {
		this.createButton(x, y, "HOME", () => {
			window.location.href = '/';
		});
	}

	private showGameOver(timeMs: number) {
		const gameOverSounds = ['/assets/bowlinggameover1.mp3', '/assets/bowlinggameover2.mp3'];
		const randomSound = gameOverSounds[Math.floor(Math.random() * gameOverSounds.length)];
		const audio = new Audio(randomSound);
		audio.volume = 0.5;
		audio.play().catch(console.error);
		
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;
		const goStyle: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: "Daydream, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
			fontSize: "48px",
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
		
		this.createButton(centerX - 80, centerY + 160, "RESTART", () => {
			this.scene.stop("UIScene");
			this.scene.stop("GameScene");
			this.scene.start("GameScene");
		});
		this.createHomeButton(centerX + 80, centerY + 160);
		
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
			fontSize: "48px",
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
		
		if (nextWave) {
			this.createButton(centerX - 80, centerY + 160, "CONTINUE", () => {
				this.scene.stop("UIScene");
				this.scene.stop("GameScene");
				this.scene.start("GameScene", { resetWaves: false });
			});
		} else {
			this.createButton(centerX - 80, centerY + 160, "RESTART", () => {
				this.scene.stop("UIScene");
				this.scene.stop("GameScene");
				this.scene.start("GameScene", { resetWaves: true });
			});
		}
		this.createHomeButton(centerX + 80, centerY + 160);
		
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


