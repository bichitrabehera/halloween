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

  }
}
