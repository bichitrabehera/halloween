import Phaser from "phaser";
import firstBg from "../../assets/example.png";

export class FinishScene extends Phaser.Scene {
  private startTime: number = 0;

  constructor() {
    super({ key: "FinishScene" });
  }

  init(data: any) {
    // get start time from previous scene
    this.startTime = data.startTime || Date.now();
  }

  preload() {
    this.load.image("bg_image", firstBg);
  }

  create() {
    const { width, height } = this.scale;

    // Background color
    this.add
      .image(width / 2, height / 2, "bg_image")
      .setDisplaySize(width, height)
      .setTint(0x555555);

    // Calculate time taken
    const timeTaken = ((Date.now() - this.startTime) / 1000).toFixed(2);

    // Title
    this.add
      .text(width / 2, height * 0.2, "Round 1 Complete!", {
        fontSize: "48px",
        color: "#ffcc00",
        fontFamily: "'Press Start 2P', Arial",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    // Time taken
    this.add
      .text(width / 2, height * 0.45, `⏱️ Time taken: ${timeTaken} seconds`, {
        fontSize: "30px",
        color: "#00ffcc",
        fontFamily: "'Press Start 2P', Arial",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
