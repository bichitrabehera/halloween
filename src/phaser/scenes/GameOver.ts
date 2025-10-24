import Phaser from "phaser";
import bgImage from "../../assets/bg1.jpg";
// GameOverScene.js

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  preload() {
    this.load.image("gameoverBg", bgImage);
  }

  create() {
    const { width, height } = this.scale;

    // Background
    const bg = this.add
      .image(0, 0, "gameoverBg")
      .setOrigin(0)
      .setDisplaySize(width, height)
      .setTint(0x555555);

    // Game Over text
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "GAME OVER", {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: "64px",
        color: "#ff0000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Disable all input
    this.input.keyboard.enabled = false;
    this.input.mouse.enabled = false;
    this.input.touch.enabled = false;

    window.onbeforeunload = function (event) {
      event.preventDefault();
      event.returnValue = "You cannot reload this page after Game Over.";
      return "You cannot reload this page after Game Over.";
    };

    // Disable some keys that trigger reload
    window.addEventListener("keydown", function (e) {
      // Block F5
      if (e.key === "F5") {
        e.preventDefault();
        alert("Reload is disabled after Game Over.");
      }

      // Block Ctrl+R or Cmd+R
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        alert("Reload is disabled after Game Over.");
      }
    });
  }
}

export default GameOverScene;
