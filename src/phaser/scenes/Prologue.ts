import Phaser from "phaser";
import firstBg from "../../assets/example.png";
import prologueImg from "../../assets/prologue_image.png";

export class Prologue extends Phaser.Scene {
  constructor() {
    super({ key: "Prologue" });
  }

  preload() {
    this.load.image("bg_first", firstBg);
    this.load.image("prologue_image", prologueImg);
  }

  create() {
    const { width, height } = this.scale;

    // === BACKGROUND ===
    this.add
      .image(width / 2, height / 2, "bg_first")
      .setDisplaySize(width, height)
      // .setTint(0x555555);

    // === ROUND TITLE ===
    const roundTitle = this.add
      .text(width / 2, height * 0.1, "Prologue: Echoes from the Kernel", {
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

    this.add
      .image(width / 2, height * 0.55, "prologue_image")
      .setScale(0.5)
      .setOrigin(0.5)
      .setDepth(3);


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
      this.tweens.add({
        targets: continueText,
        alpha: 1,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

    // === Go to next scene when ENTER pressed ===
    this.input.keyboard.on("keydown-ENTER", () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.time.delayedCall(800, () => {
        this.scene.start("StartScene"); // change to your next scene key
      });
    });

    // === FADE IN CAMERA ===
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
