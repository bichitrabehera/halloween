import Phaser from "phaser";

interface Rune extends Phaser.GameObjects.Text {
  originalX: number;
  originalY: number;
  symbol: string;
  inSlot: boolean;
  slotIndex: number;
}

export class ProphecyScene extends Phaser.Scene {
  private timeLeft: number = 120; // 2 minutes
  private timerText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private runes: Rune[] = [];
  private runeSlots: Phaser.GameObjects.Rectangle[] = [];
  private correctOrder: string[] = ["☽", "✦", "⚡", "🔮", "☾"];
  private currentOrder: string[] = [];
  private isComplete: boolean = false;
  private nextButton!: Phaser.GameObjects.Container;
  private backButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "ProphecyScene" });
  }

  preload() {
    // Create placeholder textures
    this.load.image(
      "vault-bg",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );
  }

  create(data?: { timeLeft?: number }) {
    const { width, height } = this.scale;

    if (data && data.timeLeft !== undefined) {
      this.timeLeft = data.timeLeft;
    }

    // Create vault background
    this.add.rectangle(width / 2, height / 2, width, height, 0x2c1810);

    // Add stone texture effect
    for (let i = 0; i < 50; i++) {
      this.add
        .rectangle(
          Phaser.Math.Between(0, width),
          Phaser.Math.Between(0, height),
          Phaser.Math.Between(20, 60),
          Phaser.Math.Between(20, 60),
          0x3d2817
        )
        .setAlpha(0.3);
    }

    // Scene title
    this.add
      .text(width / 2, height * 0.1, "THE HAUNTED VAULT", {
        fontSize: "36px",
        color: "#d4af37",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#8b7355",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instructions
    this.instructionText = this.add
      .text(
        width / 2,
        height * 0.18,
        "Arrange the ancient runes in the correct order to unlock the prophecy.\nDrag the runes to the slots below in the proper sequence.",
        {
          fontSize: "18px",
          color: "#f5deb3",
          fontFamily: '"Pixelify Sans", sans-serif',

          align: "center",
          wordWrap: { width: width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Timer
    this.timerText = this.add
      .text(width / 2, height * 0.25, `Time: ${this.timeLeft}s`, {
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

    // Create rune slots
    this.createRuneSlots();

    // Create draggable runes
    this.createRunes();

    // Start countdown
    this.startTimer();

    // Prophecy text (hint)
    this.add
      .text(
        width / 2,
        height * 0.85,
        'The prophecy whispers: "Moon wanes, Star shines, Lightning strikes, Crystal glows, Moon waxes"',
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

  private createRuneSlots() {
    const { width, height } = this.scale;
    const startX = width * 0.15;
    const spacing = width * 0.15;
    const slotSize = Math.min(width * 0.08, 80);
    const slotY = height * 0.5;

    for (let i = 0; i < 5; i++) {
      const slot = this.add
        .rectangle(startX + i * spacing, slotY, slotSize, slotSize, 0x4a4a4a)
        .setStrokeStyle(3, 0xd4af37);

      this.runeSlots.push(slot);

      // Add slot number
      this.add
        .text(startX + i * spacing, slotY + slotSize / 2, `${i + 1}`, {
          fontSize: "20px",
          color: "#d4af37",
          fontFamily: "serif",
        })
        .setOrigin(0.5);
    }
  }

  private createRunes() {
    const { width, height } = this.scale;
    const runeSymbols = ["☽", "✦", "⚡", "🔮", "☾"];
    const startX = width * 0.15;
    const spacing = width * 0.15;
    const runeY = height * 0.4;
    const runeSize = Math.min(width * 0.06, 48);

    // Shuffle the runes
    const shuffled = [...runeSymbols].sort(() => Math.random() - 0.5);

    shuffled.forEach((symbol, index) => {
      const rune = this.add
        .text(startX + index * spacing, runeY, symbol, {
          fontSize: `${runeSize}px`,
          color: "#8a2be2",
          fontFamily: "serif",
        })
        .setOrigin(0.5) as Rune;

      rune.setInteractive({ useHandCursor: true });
      this.input.setDraggable(rune);

      // Store original position
      rune.originalX = rune.x;
      rune.originalY = rune.y;
      rune.symbol = symbol;
      rune.inSlot = false;
      rune.slotIndex = -1;

      this.runes.push(rune);
    });

    // Drag events
    this.input.on(
      "dragstart",
      (pointer: Phaser.Input.Pointer, gameObject: Rune) => {
        gameObject.setTint(0xffff00);
        this.children.bringToTop(gameObject);
      }
    );

    this.input.on(
      "drag",
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Rune,
        dragX: number,
        dragY: number
      ) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    );

    this.input.on(
      "dragend",
      (pointer: Phaser.Input.Pointer, gameObject: Rune) => {
        gameObject.clearTint();
        this.handleRuneDrop(gameObject);
      }
    );
  }

  private handleRuneDrop(rune: Rune) {
    const { width } = this.scale;
    const slotSize = Math.min(width * 0.08, 80);
    let placed = false;

    // Check if dropped on a slot
    this.runeSlots.forEach((slot, index) => {
      const distance = Phaser.Math.Distance.Between(
        rune.x,
        rune.y,
        slot.x,
        slot.y
      );

      if (distance < slotSize / 1.5 && !placed) {
        // Remove any existing rune from this slot
        this.runes.forEach((r) => {
          if (r.slotIndex === index && r !== rune) {
            r.x = r.originalX;
            r.y = r.originalY;
            r.inSlot = false;
            r.slotIndex = -1;
          }
        });

        // Place rune in slot
        rune.x = slot.x;
        rune.y = slot.y;
        rune.inSlot = true;
        rune.slotIndex = index;
        placed = true;

        // Update current order
        this.updateCurrentOrder();
      }
    });

    // If not placed in a slot, return to original position
    if (!placed) {
      rune.x = rune.originalX;
      rune.y = rune.originalY;
      rune.inSlot = false;
      rune.slotIndex = -1;
      this.updateCurrentOrder();
    }
  }

  private updateCurrentOrder() {
    this.currentOrder = new Array(5).fill("");

    this.runes.forEach((rune) => {
      if (rune.inSlot) {
        const slotIndex = rune.slotIndex;
        this.currentOrder[slotIndex] = rune.symbol;
      }
    });

    // Check if puzzle is complete
    if (this.currentOrder.every((symbol) => symbol !== "")) {
      this.checkSolution();
    }
  }

  private checkSolution() {
    const isCorrect = this.currentOrder.every(
      (symbol, index) => symbol === this.correctOrder[index]
    );

    if (isCorrect && !this.isComplete) {
      this.isComplete = true;
      this.onPuzzleComplete();
    }
  }

  private createNavigationButtons() {
    const { width, height } = this.scale;

    // Back button (to IntroScene)
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
      WitchingHourGame.saveState("IntroScene", this.timeLeft);
      this.scene.start("IntroScene", { timeLeft: this.timeLeft });
    });
  }

  private goNext() {
    // Go to next scene with fresh timer
    this.scene.start("ForestScene");
  }

  private onPuzzleComplete() {
    const { width, height } = this.scale;

    // Success feedback
    this.add
      .text(width / 2, height * 0.7, "PROPHECY UNLOCKED!", {
        fontSize: "32px",
        color: "#00ff00",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#008000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Disable interactions
    this.runes.forEach((rune) => rune.disableInteractive());

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
    this.time.delayedCall(2000, () => {
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
    this.runes.forEach((rune) => rune.disableInteractive());

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
