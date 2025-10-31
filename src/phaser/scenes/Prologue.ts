import Phaser from "phaser";
import forestBg from "../../assets/example.png";
import prologueImg from "../../assets/prologue_image.png";

export class Prologue extends Phaser.Scene {
  constructor() {
    super({ key: "Prologue" });
  }

  preload() {
    this.load.image("bg_forest1", forestBg);
    this.load.image("prologue_art", prologueImg);
  }

  create() {
    const { width, height } = this.scale;

    // === BACKGROUND ===
    this.add
      .image(width / 2, height / 2, "bg_forest1")
      .setDisplaySize(width, height)
      .setTint(0x555555)
      .setDepth(0);

    // === PROLOGUE IMAGE ===
    const prologueImage = this.add
      .image(width / 2, height / 2, "prologue_art")
      .setOrigin(0.5)
      .setDisplaySize(width * 0.7, height * 0.7)
      .setDepth(1)
      .setAlpha(0); // start transparent

    // Fade-in animation for the image
    this.tweens.add({
      targets: prologueImage,
      alpha: 1,
      duration: 1500,
      ease: "Power2",
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
      .setDepth(2);

    // Fade-in looping animation
    this.tweens.add({
      targets: continueText,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      delay: 1500, // appears after image fades in
    });

    // === FADE IN CAMERA ===
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // === SCENE TRANSITION HANDLER ===
    let isTransitioning = false;
    const startTransition = () => {
      if (isTransitioning) return;
      isTransitioning = true;

      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.time.delayedCall(700, () => {
        this.scene.start("StartScene"); // Change to your next scene
      });
    };

    // ENTER key or click to continue
    this.input?.keyboard?.once("keydown-ENTER", startTransition);
    continueText
      .setInteractive({ useHandCursor: true })
      .once("pointerup", startTransition);
  }
}
