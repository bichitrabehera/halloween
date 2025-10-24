import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";
import story2 from "../../assets/img2.png";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: "IntroScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
    this.load.image("story_2", story2);
  }

  create() {
    const { width, height } = this.scale;

    // --- Background ---
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setDepth(0)
      .setTint(0x555555);

    this.add
      .image(width / 2, height * 0.55, "story_2")
      .setScale(0.6)
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
      .setDepth(4)
      .setInteractive({ useHandCursor: true }); // Make it interactive for clicks

    // Fade in the continue prompt after story finishes
    this.tweens.add({
      targets: continueText,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Track if transition has started to prevent double-triggering
    let isTransitioning = false;

    const startTransition = () => {
      if (isTransitioning) return;
      isTransitioning = true;

      const startTime = Date.now(); // timer starts
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.time.delayedCall(700, () => {
        this.scene.start("ForestScene", { startTime });
      });
    };

    // === Go to next scene when ENTER pressed ===
    this.input.keyboard?.once("keydown-ENTER", startTransition);

    // === Click to continue ===
    continueText.once("pointerup", startTransition);

    // === FADE IN CAMERA ===
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
