import Phaser from "phaser";

export class FinishScene extends Phaser.Scene {
  private startTime: number = 0;

  constructor() {
    super({ key: "FinishScene" });
  }

  init(data: any) {
    // get start time from previous scene
    this.startTime = data.startTime || Date.now();
  }

  create() {
    const { width, height } = this.scale;

    // Background color
    this.cameras.main.setBackgroundColor("#000000");

    // Calculate time taken
    const timeTaken = ((Date.now() - this.startTime) / 1000).toFixed(2);

    // Title
    this.add
      .text(width / 2, height * 0.2, "✨ Round 1 Complete! ✨", {
        fontSize: "64px",
        color: "#ffcc00",
        fontFamily: "Henny Penny, Arial",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    // Time taken
    this.add
      .text(width / 2, height * 0.45, `⏱️ Time taken: ${timeTaken} seconds`, {
        fontSize: "36px",
        color: "#00ffcc",
        fontFamily: "Henny Penny, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Next Round / Restart button
    const buttonContainer = this.add.container(width / 2, height * 0.7);

    const btnBg = this.add.rectangle(0, 0, 300, 80, 0x4caf50);
    const btnText = this.add
      .text(0, 0, "NEXT ROUND", {
        fontSize: "32px",
        fontFamily: "Pixelify Sans, Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    buttonContainer.add([btnBg, btnText]);
    buttonContainer.setSize(300, 80);
    buttonContainer.setInteractive({ useHandCursor: true });

    btnBg.on("pointerover", () => btnBg.setFillStyle(0x66bb6a));
    btnBg.on("pointerout", () => btnBg.setFillStyle(0x4caf50));
    btnBg.on("pointerup", () => {
      // go to next round scene (or restart for now)
      this.scene.start("ForestScene", { startTime: Date.now() });
    });

    // Optional: fade in
    this.cameras.main.fadeIn(700, 0, 0, 0);
  }
}
