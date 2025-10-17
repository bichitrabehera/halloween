import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

export class ForestScene extends Phaser.Scene {
  private inputElement!: HTMLInputElement;
  private feedbackText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private attemptsLeft = 3;
  private startTime: number = 0;

  constructor() {
    super({ key: "ForestScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
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

    // --- Title ---
    this.add
      .text(width * 0.25, height * 0.2, "Round 1: The Cursed Forest", {
        fontSize: "50px",
        color: "#ffcc00",
        fontFamily: "Henny Penny, Arial",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    // --- Story (Left) ---
    const story = `
The fog thickens as you step into the cursed forest.
Shadows twist between the trees, and faint whispers echo around you.

A ghostly voice murmurs:
"Decode the ancient Python spell hidden among the letters
to reveal the sacred flower and lift the curse."

Time is short — the shadows grow closer with every passing moment.
`;
    this.add
      .text(width * 0.25, height * 0.45, story, {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Poppins, Arial",
        align: "center",
        wordWrap: { width: width * 0.35 },
        lineSpacing: 4,
      })
      .setOrigin(0.5);


    const code = `
letters = ['q','w','e','r','t','y','u','i','o','p',
           'a','s','d','f','g','h','j','k','l','z',
           'x','c','v','b','n','m']

fog = [0b11, 0x7, 0o14]
whispers = ("echo" * 2)[::-1]
shadows = [0b101, 0x4, 11]

i1 = (0b1100 + 0b1)
i2 = (2 << 1) + 3 + 2
i3 = sum([10 - 3, 0])
i4 = (0x11 - 4)
i5 = int(((3 << 3) - 7) / 2)
i6 = (len("glow") + 13) - 10
i7 = ord('x') - 100
i8 = (int("2")**2) - 3 + 2

indices = [12, 7, 19, 13, 17, 7, 21, 1]

flower = ""
for idx in indices:
    flower += letters[idx + 1]

for f in fog + shadows:
    flower += "" * f

for w in whispers:
    flower += "" if w in "aeiou" else ""

print(flower)

`;

    this.add
      .text(width * 0.75, height * 0.48, code, {
        fontSize: "20px",
        color: "#00ffcc",
        fontFamily: "monospace",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: { x: 20, y: 10 },
        align: "left",
      })
      .setOrigin(0.5);

    // --- Input Box ---
    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Enter flower name...";
    this.inputElement.style.position = "absolute";
    this.inputElement.style.top = `${height * 0.75}px`;
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
          this.scene.start("StartScene");
        });
      }
    }
  }

  shutdown() {
    if (this.inputElement) this.inputElement.remove();
  }
}
