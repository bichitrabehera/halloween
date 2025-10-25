import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";
import code1 from "../../assets/code.png";

export class ForestScene extends Phaser.Scene {
  private inputElement!: HTMLInputElement;
  private feedbackText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private chancesText!: Phaser.GameObjects.Text;
  private attemptsLeft = 3;
  private startTime: number = 0;

  constructor() {
    super({ key: "ForestScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
    this.load.image("code", code1);
  }

  create() {
    this.startTime = Date.now();
    const { width, height } = this.scale;

    // --- Background ---
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setDepth(0)
      .setTint(0x222222);

    // --- Story (Left) ---
    const story = `
With each puzzle you solve, the chamber shifts. Lights flicker.
 Ghosts pause. And deep in the machine, something snarls:
One by one, you solve the cursed queries. One by one,
 the pieces of the Sigil recompile.

At the final gate, a broken statue of an ancient developer speaks:

👻 “If your logic is pure… your recursion true… then go. But beware…”
👻 “…he’s begun rewriting the runtime.”
`;
    this.add
      .text(width * 0.25, height * 0.45, story, {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: width * 0.35 },
        lineSpacing: 4,
      })
      .setOrigin(0.5);

    this.add
      .image(width * 0.75, height * 0.48, "code")
      .setScale(0.5)
      .setOrigin(0.5);

    // --- Input Box ---
    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Enter your answer";
    this.inputElement.style.position = "absolute";
    this.inputElement.style.top = `${height * 0.65}px`;
    this.inputElement.style.left = `${width * 0.25 - 150}px`;
    this.inputElement.style.width = "300px";
    this.inputElement.style.fontSize = "20px";
    this.inputElement.style.textAlign = "center";
    this.inputElement.style.padding = "8px";
    this.inputElement.style.border = "none";
    this.inputElement.style.borderBottom = "3px solid #ffcc00";
    this.inputElement.style.borderRight = "3px solid #ffcc00";
    this.inputElement.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    document.body.appendChild(this.inputElement);

    // --- Chances Text (Top-Right) ---
    this.chancesText = this.add
      .text(width - 30, 30, `Chances Left: ${this.attemptsLeft}`, {
        fontSize: "24px",
        color: "#ffcc00",
        fontFamily: "Poppins, Arial",
      })
      .setOrigin(1, 0); // top-right alignment

    // --- Feedback Text ---
    this.feedbackText = this.add
      .text(width * 0.25, height * 0.83, "", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Henny Penny, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // --- Hint Text ---
    this.hintText = this.add
      .text(width * 0.75, height * 0.9, "", {
        fontSize: "20px",
        color: "#aaaaff",
        fontFamily: "Poppins, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // --- Enter Key ---
    this.input.keyboard?.on("keydown-ENTER", () => this.checkAnswer());
  }

  private checkAnswer() {
    const answer = this.inputElement.value.trim().toLowerCase();
    const correctAnswer = "foxglove";

    if (answer === correctAnswer) {
      this.feedbackText.setText("✨ The curse fades... You solved it! ✨");
      this.feedbackText.setColor("#00ff00");
      this.inputElement.disabled = true;
      this.time.delayedCall(2000, () => {
        this.inputElement.remove();
        this.scene.start("FinishScene", { startTime: this.startTime });
      });
    } else {
      this.attemptsLeft--;
      this.updateChancesDisplay();

      if (this.attemptsLeft === 1) {
        this.hintText.setText(
          "💡 Hint: Check binary and hex indices carefully to extract letters."
        );
      }

      if (this.attemptsLeft > 0) {
        this.feedbackText.setText(
          `❌ Wrong! The spirits grow restless... (${this.attemptsLeft} tries left)`
        );
        this.feedbackText.setColor("#ff4444");
      } else {
        this.feedbackText.setText("💀 The forest consumes you... Game Over!");
        this.feedbackText.setColor("#ff0000");
        this.inputElement.disabled = true;
        this.time.delayedCall(2000, () => {
          this.inputElement.remove();
          this.scene.start("GameOver");
        });
      }
    }
  }

  private updateChancesDisplay() {
    this.chancesText.setText(`Chances Left: ${this.attemptsLeft}`);
    this.chancesText.setColor(this.attemptsLeft <= 1 ? "#ff4444" : "#ffcc00");
  }

  shutdown() {
    if (this.inputElement) this.inputElement.remove();
  }
}
