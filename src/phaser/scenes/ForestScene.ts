import Phaser from "phaser";

interface SymbolNode {
  symbol: string;
  x: number;
  y: number;
  connections: number[];
  activated: boolean;
  gameObject?: Phaser.GameObjects.Text;
}

export class ForestScene extends Phaser.Scene {
  private timeLeft: number = 150; // 2.5 minutes
  private timerText!: Phaser.GameObjects.Text;
  private symbols: SymbolNode[] = [];
  private currentPath: number[] = [];
  private correctPath: number[] = [0, 2, 4, 1, 3]; // Specific sequence
  private isComplete: boolean = false;
  private graphics!: Phaser.GameObjects.Graphics;
  private nextButton!: Phaser.GameObjects.Container;
  private backButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "ForestScene" });
  }

  preload() {
    // Placeholder for forest background
    this.load.image(
      "forest-bg",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );
  }

  create(data?: { timeLeft?: number }) {
    const { width, height } = this.scale;

    if (data && data.timeLeft !== undefined) {
      this.timeLeft = data.timeLeft;
    }

    // Create forest background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d2818);

    // Add forest atmosphere
    this.createForestAtmosphere();

    // Scene title
    this.add
      .text(width / 2, height * 0.08, "THE ANCIENT FOREST", {
        fontSize: "36px",
        color: "#228b22",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#006400",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        height * 0.15,
        "Activate the ancient symbols in the correct order to reveal the hidden path.\nClick symbols to trace the mystical sequence.",
        {
          fontSize: "18px",
          color: "#90ee90",
          fontFamily: '"Pixelify Sans", sans-serif',

          align: "center",
          wordWrap: { width: width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Timer
    this.timerText = this.add
      .text(width / 2, height * 0.22, `Time: ${this.timeLeft}s`, {
        fontSize: "24px",
        color: "#ff6b6b",
        fontFamily: "serif",
      })
      .setOrigin(0.5);

    // Navigation buttons
    this.createNavigationButtons();

    // Save initial state if restored
    if (data && data.timeLeft !== undefined) {
      import("../Game").then(({ WitchingHourGame }) => {
        WitchingHourGame.saveState(this.scene.key, this.timeLeft);
      });
    }

    // Create graphics for drawing paths
    this.graphics = this.add.graphics();

    // Create symbol altar
    this.createSymbolAltar();

    // Start timer
    this.startTimer();

    // Add mystical hint
    this.add
      .text(
        width / 2,
        height * 0.85,
        'The spirits whisper: "Earth to Air, Air to Spirit, Spirit to Fire, Fire to Water, Water completes the circle"',
        {
          fontSize: "24px",
          color: "#9370db",
          fontFamily: '"Pixelify Sans", sans-serif',

          fontStyle: "italic",
          align: "center",
          wordWrap: { width: width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private createForestAtmosphere() {
    const { width, height } = this.scale;

    // Create tree silhouettes
    for (let i = 0; i < 8; i++) {
      const treeX = Phaser.Math.Between(width * 0.05, width * 0.95);
      const treeY = Phaser.Math.Between(height * 0.65, height);

      this.add
        .rectangle(
          treeX,
          treeY,
          Phaser.Math.Between(20, 40),
          Phaser.Math.Between(100, 200),
          0x1a4a1a
        )
        .setAlpha(0.6);
    }

    // Add floating lights
    this.add.particles(0, 0, "forest-bg", {
      x: { min: width * 0.1, max: width * 0.9 },
      y: { min: height * 0.25, max: height * 0.75 },
      scale: { start: 0.2, end: 0.1 },
      alpha: { start: 0.8, end: 0.3 },
      speed: { min: 5, max: 15 },
      lifespan: 4000,
      frequency: 300,
      tint: [0x90ee90, 0x228b22, 0x32cd32],
    });
  }

  private createSymbolAltar() {
    const { width, height } = this.scale;
    // Define symbol positions in a pentagram pattern
    const centerX = width / 2;
    const centerY = height * 0.5;
    const radius = Math.min(width, height) * 0.2;

    const symbolData = [
      { symbol: "🌍", name: "Earth", angle: 0 }, // Top
      { symbol: "🔥", name: "Fire", angle: 72 }, // Top right
      { symbol: "💧", name: "Water", angle: 144 }, // Bottom right
      { symbol: "💨", name: "Air", angle: 216 }, // Bottom left
      { symbol: "✨", name: "Spirit", angle: 288 }, // Top left
    ];

    symbolData.forEach((data, index) => {
      const angle = (data.angle * Math.PI) / 180;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Create symbol background circle
      this.add.circle(x, y, 40, 0x2d4a2d, 0.8).setStrokeStyle(3, 0x228b22);

      // Create symbol
      const symbol = this.add
        .text(x, y, data.symbol, {
          fontSize: "36px",
          color: "#90ee90",
        })
        .setOrigin(0.5);

      // Create label
      this.add
        .text(x, y + radius * 0.1, data.name, {
          fontSize: "14px",
          color: "#90ee90",
          fontFamily: "serif",
        })
        .setOrigin(0.5);

      // Store symbol data
      this.symbols.push({
        symbol: data.symbol,
        x: x,
        y: y,
        connections: this.getConnections(index),
        activated: false,
        gameObject: symbol,
      });

      // Make interactive
      symbol.setInteractive({ useHandCursor: true });
      symbol.on("pointerdown", () => this.activateSymbol(index));

      // Hover effects
      symbol.on("pointerover", () => {
        if (!this.symbols[index].activated) {
          symbol.setScale(1.2);
          symbol.setTint(0xffff00);
        }
      });

      symbol.on("pointerout", () => {
        if (!this.symbols[index].activated) {
          symbol.setScale(1);
          symbol.clearTint();
        }
      });
    });

    // Draw pentagram lines
    this.drawPentagram(centerX, centerY, radius);
  }

  private getConnections(index: number): number[] {
    // Define which symbols connect to which (pentagram pattern)
    const connections = [
      [2, 4], // Earth connects to Air and Spirit
      [3, 0], // Fire connects to Water and Earth
      [4, 1], // Water connects to Spirit and Fire
      [0, 2], // Air connects to Earth and Water
      [1, 3], // Spirit connects to Fire and Air
    ];
    return connections[index];
  }

  private drawPentagram(centerX: number, centerY: number, radius: number) {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x228b22, 0.5);

    // Draw pentagram lines
    const angles = [0, 72, 144, 216, 288];
    const points = angles.map((angle) => ({
      x: centerX + Math.cos((angle * Math.PI) / 180) * radius,
      y: centerY + Math.sin((angle * Math.PI) / 180) * radius,
    }));

    // Draw the star pattern
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    graphics.lineTo(points[2].x, points[2].y);
    graphics.lineTo(points[4].x, points[4].y);
    graphics.lineTo(points[1].x, points[1].y);
    graphics.lineTo(points[3].x, points[3].y);
    graphics.closePath();
    graphics.strokePath();
  }

  private activateSymbol(index: number) {
    if (this.isComplete || this.symbols[index].activated) return;

    // Check if this is the next correct symbol in sequence
    const expectedIndex = this.correctPath[this.currentPath.length];

    if (index === expectedIndex) {
      // Correct symbol
      this.symbols[index].activated = true;
      this.currentPath.push(index);

      // Visual feedback
      const symbol = this.symbols[index].gameObject!;
      symbol.setTint(0x00ff00);
      symbol.setScale(1.3);

      // Draw path line if not first symbol
      if (this.currentPath.length > 1) {
        this.drawPathLine(
          this.currentPath[this.currentPath.length - 2],
          this.currentPath[this.currentPath.length - 1]
        );
      }

      // Check if puzzle complete
      if (this.currentPath.length === this.correctPath.length) {
        this.onPuzzleComplete();
      }

      // Play success sound (placeholder)
      this.tweens.add({
        targets: symbol,
        alpha: 0.5,
        duration: 200,
        yoyo: true,
        repeat: 2,
      });
    } else {
      // Wrong symbol - reset
      this.resetPuzzle();

      // Visual feedback for wrong choice
      const symbol = this.symbols[index].gameObject!;
      symbol.setTint(0xff0000);

      this.time.delayedCall(500, () => {
        symbol.clearTint();
      });
    }
  }

  private drawPathLine(fromIndex: number, toIndex: number) {
    const from = this.symbols[fromIndex];
    const to = this.symbols[toIndex];

    this.graphics.lineStyle(4, 0x00ff00, 0.8);
    this.graphics.beginPath();
    this.graphics.moveTo(from.x, from.y);
    this.graphics.lineTo(to.x, to.y);
    this.graphics.strokePath();
  }

  private resetPuzzle() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height * 0.5;
    const radius = Math.min(width, height) * 0.2;

    // Reset all symbols
    this.symbols.forEach((symbol) => {
      symbol.activated = false;
      symbol.gameObject!.clearTint();
      symbol.gameObject!.setScale(1);
    });

    // Clear path
    this.currentPath = [];
    this.graphics.clear();

    // Redraw pentagram
    this.drawPentagram(centerX, centerY, radius);
  }

  private createNavigationButtons() {
    const { width, height } = this.scale;

    // Back button (to ProphecyScene)
    this.backButton = this.createButton(
      width * 0.25,
      height * 0.9,
      "← BACK",
      0x87cefa,
      0x000000
    );
    const backBg = this.backButton.list[0] as Phaser.GameObjects.Rectangle;
    backBg.setInteractive({ useHandCursor: true });
    backBg.on("pointerup", () => this.goBack());

    // Next button (only enabled on complete)
    this.nextButton = this.createButton(
      width * 0.75,
      height * 0.9,
      "NEXT →",
      0xff6b6b,
      0x000000
    );
    this.nextButton.setVisible(false); // Hidden until complete
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    bgColor: number,
    textColor: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setDepth(3);

    const bg = this.add
      .rectangle(0, 0, 160, 50, bgColor)
      .setStrokeStyle(3, 0x000000);
    const label = this.add
      .text(0, 0, text, {
        fontSize: "24px",
        fontFamily: "Pixelify Sans",
        color: `#${textColor.toString(16).padStart(6, "0")}`,
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    container.add([bg, label]);
    return container;
  }

  private goBack() {
    // Save current time and go to previous scene
    import("../Game").then(({ WitchingHourGame }) => {
      WitchingHourGame.saveState("ProphecyScene", this.timeLeft);
      this.scene.start("ProphecyScene", { timeLeft: this.timeLeft });
    });
  }

  private goNext() {
    // Go to next scene with fresh timer
    this.scene.start("CryptScene");
  }

  private onPuzzleComplete() {
    const { width, height } = this.scale;

    this.isComplete = true;

    // Success message
    this.add
      .text(width / 2, height * 0.7, "THE PATH IS REVEALED!", {
        fontSize: "32px",
        color: "#00ff00",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#008000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Disable all interactions
    this.symbols.forEach((symbol) => {
      symbol.gameObject!.disableInteractive();
    });

    // Show next button
    this.nextButton.setVisible(true);
    const nextBg = this.nextButton.list[0] as Phaser.GameObjects.Rectangle;
    nextBg.setInteractive({ useHandCursor: true });
    nextBg.on("pointerup", () => this.goNext());

    // Clear state before transition
    import("../Game").then(({ WitchingHourGame }) => {
      WitchingHourGame.clearState();
    });

    // Transition to next scene after delay or on button click
    this.time.delayedCall(2500, () => {
      if (!this.nextButton.visible) {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
          this.goNext();
        });
      }
    });
  }

  private startTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isComplete) {
          this.timeLeft--;
          this.timerText.setText(`Time: ${this.timeLeft}s`);

          // Save state
          import("../Game").then(({ WitchingHourGame }) => {
            WitchingHourGame.saveState(this.scene.key, this.timeLeft);
          });

          if (this.timeLeft <= 0) {
            this.onTimeUp();
          } else if (this.timeLeft <= 30) {
            this.timerText.setColor("#ff0000");
          }
        }
      },
      loop: true,
    });
  }

  private onTimeUp() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.7, "OOPS! ELIMINATED!", {
        fontSize: "32px",
        color: "#ff0000",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#8b0000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Disable interactions
    this.symbols.forEach((symbol) => {
      symbol.gameObject!.disableInteractive();
    });

    // Clear state and go to Intro
    import("../Game").then(({ WitchingHourGame }) => {
      WitchingHourGame.clearState();
    });

    // Go to Intro after delay
    this.time.delayedCall(3000, () => {
      this.scene.start("IntroScene");
    });
  }
}
