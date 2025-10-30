import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: "IntroScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
  }

  create() {
    const { width, height } = this.scale;

    // --- Background ---
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setDepth(0)
      .setTint(0x222222); // dark overlay for haunted effect

    // Optional: add subtle fog or particle effects here

    // --- Story Text ---
    const story = `
“I tried to fix the infinite loop… but it fixed me…”
“We deprecated logic… now chaos runs the build…”

    `;

    this.add
      .text(width / 2, height * 0.2, story, {
        fontSize: "28px",
        // fontFamily: "Henny Penny, Arial",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
        wordWrap: { width: width * 0.75 },
        lineSpacing: 10,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    const story2 = `
You stand before the ancient terminal.
Symbols pulse across the screen — half-code, half-curse.

This is the Crypt of Riddles.
Every riddle is a lock.
Every lock guards a fragment of the Sigil of Syntax — your only key forward.

NOTE : AS SOON AS YOU CLICK ENTER A HIDDEN TIMER WILL START`;

    this.add
      .text(width / 2, height * 0.55, story2, {
        fontSize: "24px",
        // fontFamily: "Henny Penny, Arial",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
        wordWrap: { width: width * 0.75 },
        lineSpacing: 10,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

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
    this.time.delayedCall(story.length * 100 + 1000, () => {
      this.tweens.add({
        targets: continueText,
        alpha: 1,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
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
    this.input?.keyboard?.once("keydown-ENTER", startTransition);

    // === Click to continue ===
    continueText.once("pointerup", startTransition);

    // === FADE IN CAMERA ===
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
