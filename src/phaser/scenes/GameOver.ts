import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload(): void {
    this.load.image("gameoverBg", "assets/bg.png");
  }

  create(): void {
    // Mark Game Over in localStorage
    localStorage.setItem("gameOver", "true");

    // Background
    const bg = this.add.image(0, 0, "gameoverBg").setOrigin(0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    // Game Over text
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "GAME OVER", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#ff0000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Disable all input (TypeScript-safe)
    const input = this.input;
    if (input && input.keyboard) input.keyboard.enabled = false;
    if (input && input.mouse) input.mouse.enabled = false;
    // Phaser.InputPlugin doesn’t expose `.touch` in types, so cast to any:
    (input as any).touch = null;

    // Warn if reload attempted
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You cannot reload this page after Game Over.";
      return e.returnValue;
    };
  }
}
