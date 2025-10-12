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
The Haunted Quest begins!

It’s Halloween night, and the evil Necromancer
 Varkon has cursedthe nearby village.
Only a brave adventurer (you) can stop him by
 solving magical coding puzzles.

As soon as you are ready, click "Start" to begin your quest
 this will start the timer
    `;

    this.add
      .text(width / 2, height * 0.4, story, {
        fontSize: "32px",
        fontFamily: "Henny Penny, Arial",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
        wordWrap: { width: width * 0.75 },
        lineSpacing: 10,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    // --- START CHALLENGE Button ---
    const buttonContainer = this.add.container(width / 2, height * 0.75);

    const buttonBg = this.add
      .rectangle(0, 0, 300, 70, 0xdc143c) // dark red
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(3, 0x000000)
      .setDepth(1);

    const buttonText = this.add
      .text(0, 0, "Start", {
        fontSize: "38px",
        fontFamily: "Pixelify Sans, Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(2);

    buttonContainer.add([buttonBg, buttonText]);

    // Hover effect
    buttonBg.on("pointerover", () => buttonBg.setScale(1.05));
    buttonBg.on("pointerout", () => buttonBg.setScale(1));

    // Click effect → timer starts here
    buttonBg.on("pointerup", () => {
      const startTime = Date.now(); // timer starts
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.time.delayedCall(700, () => {
        this.scene.start("ForestScene", { startTime });
      });
    });

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
