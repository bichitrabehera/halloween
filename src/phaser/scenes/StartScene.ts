import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";
import pumpkinImg from "../../assets/pumpkin.png"; // small pumpkin PNG

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
    this.load.image("pumpkin", pumpkinImg); // preload pumpkin
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setTint(0x222222) // dark overlay for haunted effect
      .setDepth(0);

    // Title container
    const titleContainer = this.add.container(width / 2, height * 0.32);

    const titleText = this.add
      .text(0, 0, "HAUNTED QUEST", {
        fontSize: "100px",
        fontFamily: "Henny Penny, Arial",
        fontStyle: "italic",
        color: "#8A784E",
        stroke: "#000000",
        strokeThickness: 6,
        align: "center",
      })
      .setOrigin(0.5);

    const pumpkin = this.add
      .image(titleText.width / 2 + 150, 0, "pumpkin")
      .setScale(0.07)
      .setOrigin(0.5);

    titleContainer.add([titleText, pumpkin]);

    // Tagline
    this.add
      .text(
        width / 2,
        height * 0.5,
        "Solve the puzzles... escape the mansion",
        {
          fontSize: "44px",
          fontFamily: "Henny Penny, Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 2,
          letterSpacing: 1,
        }
      )
      .setOrigin(0.5);

    // Play button
    const playContainer = this.add
      .container(width / 2, height * 0.65)
      .setDepth(2);
    const btnBg = this.add
      .rectangle(0, 0, 300, 70, 0x4b0000)
      .setStrokeStyle(3, 0x000000)
      .setInteractive({ useHandCursor: true });
    const btnText = this.add
      .text(0, 0, "PLAY NOW", {
        fontSize: "36px",
        fontFamily: "Pixelify Sans, Arial",
        color: "#DCD7C9",
        stroke: "#000000",
        strokeThickness: 2,
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    playContainer.add([btnBg, btnText]);

    // Button hover effects
    btnBg.on("pointerover", () => btnBg.setScale(1.03));
    btnBg.on("pointerout", () => btnBg.setScale(1));

    // Start next scene on click (timer starts in IntroScene)
    btnBg.on("pointerup", () => {
      this.tweens.add({
        targets: playContainer,
        scaleX: 0.98,
        scaleY: 0.98,
        duration: 80,
        yoyo: true,
      });
      this.scene.start("IntroScene");
    });

    // ENTER key shortcut
    this.input.keyboard?.on("keydown-ENTER", () => {
      this.scene.start("IntroScene");
    });

    // Fade in
    this.cameras.main.fadeIn(700, 0, 0, 0);
  }
}
