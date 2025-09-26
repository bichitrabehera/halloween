import Phaser from "phaser";

interface FloatingRune {
  gameObject: Phaser.GameObjects.Text;
  targetRotation: number;
  currentRotation: number;
  symbol: string;
  id: number;
  isCorrect: boolean;
}

export class CryptScene extends Phaser.Scene {
  private timeLeft: number = 180; // 3 minutes
  private timerText!: Phaser.GameObjects.Text;
  private floatingRunes: FloatingRune[] = [];
  private centerX: number = 512;
  private centerY: number = 400;
  private isComplete: boolean = false;
  private completedRunes: number = 0;
  private nextButton!: Phaser.GameObjects.Container;
  private backButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "CryptScene" });
  }

  preload() {
    // Placeholder for crypt background
    this.load.image(
      "crypt-bg",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );
  }

  create(data?: { timeLeft?: number }) {
    const { width, height } = this.scale;

    if (data && data.timeLeft !== undefined) {
      this.timeLeft = data.timeLeft;
    }

    this.centerX = width / 2;
    this.centerY = height * 0.5;

    // Create crypt background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Add crypt atmosphere
    this.createCryptAtmosphere();

    // Scene title
    this.add
      .text(width / 2, height * 0.08, "THE ANCIENT CRYPT", {
        fontSize: "36px",
        color: "#9370db",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#4b0082",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        height * 0.15,
        "Rotate the floating runes to their correct positions.\nClick each rune to rotate it until all align properly.",
        {
          fontSize: "18px",
          color: "#dda0dd",
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

    // Create floating runes
    this.createFloatingRunes();

    // Start timer
    this.startTimer();

    // Add mystical hint
    this.add
      .text(
        width / 2,
        height * 0.85,
        'The ancient text reads: "When all symbols face their destined direction, the seal shall break"',
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

  private createCryptAtmosphere() {
    const { width, height } = this.scale;

    // Create stone pillars
    for (let i = 0; i < 6; i++) {
      const pillarX = width * 0.15 + i * width * 0.15;
      this.add
        .rectangle(pillarX, height * 0.8, 30, 200, 0x2f2f2f)
        .setAlpha(0.7);

      // Add pillar details
      this.add
        .rectangle(pillarX, height * 0.65, 40, 20, 0x404040)
        .setAlpha(0.8);
      this.add.rectangle(pillarX, height * 0.9, 40, 20, 0x404040).setAlpha(0.8);
    }

    // Add floating dust particles
    this.add.particles(0, 0, "crypt-bg", {
      x: { min: width * 0.2, max: width * 0.8 },
      y: { min: height * 0.3, max: height * 0.7 },
      scale: { start: 0.1, end: 0.05 },
      alpha: { start: 0.6, end: 0.1 },
      speed: { min: 2, max: 8 },
      lifespan: 5000,
      frequency: 400,
      tint: [0x9370db, 0x8a2be2, 0x4b0082],
    });

    // Create mystical circle
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x9370db, 0.6);
    const circleRadius = Math.min(width, height) * 0.25;
    const innerRadius = Math.min(width, height) * 0.2;
    graphics.strokeCircle(this.centerX, this.centerY, circleRadius);
    graphics.strokeCircle(this.centerX, this.centerY, innerRadius);

    // Add inner patterns
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = this.centerX + Math.cos(angle) * (innerRadius * 0.9);
      const y1 = this.centerY + Math.sin(angle) * (innerRadius * 0.9);
      const x2 = this.centerX + Math.cos(angle) * (circleRadius * 0.9);
      const y2 = this.centerY + Math.sin(angle) * (circleRadius * 0.9);

      graphics.lineBetween(x1, y1, x2, y2);
    }
  }

  private createFloatingRunes() {
    const { width, height } = this.scale;
    const radius = Math.min(width, height) * 0.15;
    const runeData = [
      { symbol: "⚡", targetRotation: 0, angle: 0 }, // Top
      { symbol: "🌙", targetRotation: 90, angle: 90 }, // Right
      { symbol: "🔮", targetRotation: 180, angle: 180 }, // Bottom
      { symbol: "⭐", targetRotation: 270, angle: 270 }, // Left
    ];

    runeData.forEach((data, index) => {
      const angleRad = (data.angle * Math.PI) / 180;
      const x = this.centerX + Math.cos(angleRad) * radius;
      const y = this.centerY + Math.sin(angleRad) * radius;

      // Create rune background
      this.add.circle(x, y, 35, 0x2d2d4a, 0.8).setStrokeStyle(2, 0x9370db);

      // Create rune symbol
      const rune = this.add
        .text(x, y, data.symbol, {
          fontSize: "32px",
          color: "#dda0dd",
        })
        .setOrigin(0.5);

      // Random initial rotation
      const initialRotation = Phaser.Math.Between(0, 360);
      rune.setRotation((initialRotation * Math.PI) / 180);

      // Create floating rune object
      const floatingRune: FloatingRune = {
        gameObject: rune,
        targetRotation: data.targetRotation,
        currentRotation: initialRotation,
        symbol: data.symbol,
        id: index,
        isCorrect: false,
      };

      this.floatingRunes.push(floatingRune);

      // Make interactive
      rune.setInteractive({ useHandCursor: true });
      rune.on("pointerdown", () => this.rotateRune(floatingRune));

      // Hover effects
      rune.on("pointerover", () => {
        if (!floatingRune.isCorrect) {
          rune.setScale(1.2);
          rune.setTint(0xffff00);
        }
      });

      rune.on("pointerout", () => {
        if (!floatingRune.isCorrect) {
          rune.setScale(1);
          rune.clearTint();
        }
      });

      // Add floating animation
      this.tweens.add({
        targets: rune,
        y: y + Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(2000, 3000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Add rotation indicator (small arrow)
      const arrow = this.add
        .text(x, y - radius * 0.4, "↑", {
          fontSize: "16px",
          color: "#666666",
        })
        .setOrigin(0.5);

      // Rotate arrow to show target direction
      arrow.setRotation((data.targetRotation * Math.PI) / 180);
    });
  }

  private rotateRune(rune: FloatingRune) {
    if (this.isComplete || rune.isCorrect) return;

    // Rotate by 45 degrees
    rune.currentRotation = (rune.currentRotation + 45) % 360;

    // Animate rotation
    this.tweens.add({
      targets: rune.gameObject,
      rotation: (rune.currentRotation * Math.PI) / 180,
      duration: 300,
      ease: "Back.easeOut",
    });

    // Check if correct
    const tolerance = 45; // Allow larger tolerance for easier gameplay
    const diff = Math.abs(rune.currentRotation - rune.targetRotation);
    const isCorrect = diff <= tolerance || diff >= 360 - tolerance;

    if (isCorrect && !rune.isCorrect) {
      rune.isCorrect = true;
      this.completedRunes++;

      // Visual feedback
      rune.gameObject.setTint(0x00ff00);
      rune.gameObject.setScale(1.1);

      // Particle effect
      const particles = this.add.particles(
        rune.gameObject.x,
        rune.gameObject.y,
        "crypt-bg",
        {
          scale: { start: 0.3, end: 0 },
          alpha: { start: 1, end: 0 },
          speed: { min: 50, max: 100 },
          lifespan: 1000,
          quantity: 10,
          tint: 0x00ff00,
        }
      );

      // Remove particles after animation
      this.time.delayedCall(1000, () => {
        particles.destroy();
      });

      // Check if all runes are correct
      if (this.completedRunes === this.floatingRunes.length) {
        this.onPuzzleComplete();
      }
    } else if (rune.isCorrect && !isCorrect) {
      // Was correct, now incorrect
      rune.isCorrect = false;
      this.completedRunes--;
      rune.gameObject.clearTint();
      rune.gameObject.setScale(1);
    }
  }

  private createNavigationButtons() {
    const { width, height } = this.scale;

    // Back button (to ForestScene)
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
      WitchingHourGame.saveState("ForestScene", this.timeLeft);
      this.scene.start("ForestScene", { timeLeft: this.timeLeft });
    });
  }

  private goNext() {
    // Go to next scene with fresh timer
    this.scene.start("RitualScene");
  }

  private onPuzzleComplete() {
    const { width, height } = this.scale;

    this.isComplete = true;

    // Success message
    this.add
      .text(width / 2, height * 0.7, "THE ANCIENT SEAL IS BROKEN!", {
        fontSize: "32px",
        color: "#00ff00",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#008000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Disable all interactions
    this.floatingRunes.forEach((rune) => {
      rune.gameObject.disableInteractive();
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

    // Create completion effect
    const graphics = this.add.graphics();
    graphics.lineStyle(5, 0x00ff00, 1);
    const completeRadius = Math.min(width, height) * 0.3;
    graphics.strokeCircle(this.centerX, this.centerY, completeRadius);

    this.tweens.add({
      targets: graphics,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 2000,
      ease: "Power2",
    });

    // Transition to final scene after delay or on button click
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
    this.floatingRunes.forEach((rune) => {
      rune.gameObject.disableInteractive();
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
