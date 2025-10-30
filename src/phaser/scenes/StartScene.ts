import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
  }

  create() {
    const { width, height } = this.scale;

    // === BACKGROUND ===
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setTint(0x555555);

    // === ROUND TITLE ===
    const roundTitle = this.add
      .text(width / 2, height * 0.15, "ROUND 1: THE CRYPT OF RIDDLES", {
        fontSize: "30px",
        fontFamily: '"Press Start 2P", monospace', // Added quotes and better fallback
        color: "#F8D47E",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setAlpha(0);

    this.tweens.add({
      targets: roundTitle,
      alpha: 1,
      duration: 1000,
      ease: "Power2",
    });

    // === STORY TEXT ===
    const story = [
      "A terminal flickers alive:",
      ">>> ERROR: SIGIL OF SYNTAX CORRUPTED",
      ">>> SOLVE OR BE SEALED FOREVER",
    ];

    const storyText = this.add
      .text(width / 2, height * 0.45, "", {
        fontSize: "26px",
        fontFamily: "Courier Prime, monospace",
        color: "#E5E5E5",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5)
      .setDepth(3);

    // === Typewriter Effect ===
    let lineIndex = 0;
    this.time.addEvent({
      delay: 90,
      loop: true,
      callback: () => {
        if (lineIndex < story.length) {
          storyText.setText(story.slice(0, lineIndex + 1).join("\n"));
          lineIndex++;
        }
      },
    });

    // === CONTINUE PROMPT ===
    const continueText = this.add
      .text(width / 2, height * 0.9, "[ Press ENTER to Continue ]", {
        fontSize: "22px",
        fontFamily: "Pixelify Sans, Arial",
        color: "#B2B2B2",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(4);

    // Fade in the continue prompt after story finishes
    this.time.delayedCall(story.length * 100 + 1000, () => {
      this.tweens.add({
        targets: continueText,
        alpha: 1,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    });

    // === Go to next scene when ENTER pressed ===
    this.input.keyboard?.on("keydown-ENTER", () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.time.delayedCall(800, () => {
        this.scene.start("IntroScene"); // change to your next scene key
      });
    });

    // === FADE IN CAMERA ===
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
