import Phaser from "phaser";
import { IntroScene } from "./scenes/IntroScene";
import { ForestScene } from "./scenes/ForestScene";
import { StartScene } from "./scenes/StartScene";
import { FinishScene } from "./scenes/FinishScene";
import { Prologue } from "./scenes/Prologue";

export class WitchingHourGame {
  private game: Phaser.Game | null = null;
  private sceneOrder: string[] = ["IntroScene", "ForestScene", "FinishScene"];

  constructor(containerId: string) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerId,
      backgroundColor: "#1a1a2e",
      scene: [Prologue, StartScene, IntroScene, ForestScene, FinishScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    this.game = new Phaser.Game(config);
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  getGame(): Phaser.Game | null {
    return this.game;
  }

  // Navigation helpers with time tracking
  nextScene(
    currentSceneKey: string,
    timeLeft?: number,
    startTime?: number,
    completionTime?: number
  ) {
    const currentIndex = this.sceneOrder.indexOf(currentSceneKey);
    if (currentIndex >= 0 && currentIndex < this.sceneOrder.length - 1) {
      const nextSceneKey = this.sceneOrder[currentIndex + 1];
      this.game?.scene.start(nextSceneKey, {
        timeLeft,
        startTime,
        completionTime,
      });
    }
  }

  prevScene(currentSceneKey: string, timeLeft?: number, startTime?: number) {
    const currentIndex = this.sceneOrder.indexOf(currentSceneKey);
    if (currentIndex > 0) {
      const prevSceneKey = this.sceneOrder[currentIndex - 1];
      this.game?.scene.start(prevSceneKey, { timeLeft, startTime });
    }
  }

  getSceneOrder(): string[] {
    return [...this.sceneOrder];
  }
}
