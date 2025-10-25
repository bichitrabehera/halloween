import Phaser from "phaser";
import bgImage from "../../assets/bg1.jpg";
import gameOverSound from "../../assets/gameover.mp3"; // 👈 add your sound file here

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload(): void {
    this.load.image("gameoverBg", bgImage);
    this.load.audio("gameover_sfx", gameOverSound); // 👈 preload sound
  }

  create(): void {
    // Mark Game Over in localStorage
    localStorage.setItem("gameOver", "true");

    // Background
    const bg = this.add
      .image(0, 0, "gameoverBg")
      .setOrigin(0)
      .setTint(0x555555);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    // --- Play Game Over Sound ---
    const gameOverSfx = this.sound.add("gameover_sfx");
    gameOverSfx.play({ volume: 0.7 }); // adjust volume (0–1)

    // Game Over text
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "GAME OVER", {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "64px",
        color: "#ff0000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Disable all input
    const input = this.input;
    if (input && input.keyboard) input.keyboard.enabled = false;
    if (input && input.mouse) input.mouse.enabled = false;
    (input as any).touch = null; // disable touch safely

    // Prevent reloads
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You cannot reload this page after Game Over.";
      return e.returnValue;
    };
  }
}
