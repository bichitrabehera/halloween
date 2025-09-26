import Phaser from "phaser";
import { IntroScene } from "./scenes/IntroScene";
import { ProphecyScene } from "./scenes/ProphecyScene";
import { ForestScene } from "./scenes/ForestScene";
import { CryptScene } from "./scenes/CryptScene";
import { RitualScene } from "./scenes/RitualScene";

export class WitchingHourGame {
  private game: Phaser.Game | null = null;
  private sceneOrder: string[] = [
    "IntroScene",
    "ProphecyScene",
    "ForestScene",
    "CryptScene",
    "RitualScene",
  ];

  constructor(containerId: string) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerId,
      backgroundColor: "#1a1a2e",
      scene: [IntroScene, ProphecyScene, ForestScene, CryptScene, RitualScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE, // 🔑 always match window/container size
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    this.game = new Phaser.Game(config);

    // Check for saved game state and resume if exists
    const savedState = WitchingHourGame.loadState();
    if (savedState) {
      this.game.scene.start(savedState.scene, { timeLeft: savedState.timeLeft });
    }
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

  static saveState(sceneKey: string, timeLeft: number) {
    const state = { scene: sceneKey, timeLeft };
    localStorage.setItem('witchingHourGameState', JSON.stringify(state));
  }

  static loadState(): { scene: string; timeLeft: number } | null {
    const stateStr = localStorage.getItem('witchingHourGameState');
    if (stateStr) {
      try {
        return JSON.parse(stateStr);
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
        WitchingHourGame.clearState();
      }
    }
    return null;
  }

  static clearState() {
    localStorage.removeItem('witchingHourGameState');
  }

  // Navigation helpers
  nextScene(currentSceneKey: string, timeLeft?: number) {
    const currentIndex = this.sceneOrder.indexOf(currentSceneKey);
    if (currentIndex >= 0 && currentIndex < this.sceneOrder.length - 1) {
      const nextSceneKey = this.sceneOrder[currentIndex + 1];
      if (timeLeft !== undefined) {
        WitchingHourGame.saveState(nextSceneKey, timeLeft);
      }
      this.game?.scene.start(nextSceneKey, timeLeft !== undefined ? { timeLeft } : undefined);
    }
  }

  prevScene(currentSceneKey: string, timeLeft?: number) {
    const currentIndex = this.sceneOrder.indexOf(currentSceneKey);
    if (currentIndex > 0) {
      const prevSceneKey = this.sceneOrder[currentIndex - 1];
      if (timeLeft !== undefined) {
        WitchingHourGame.saveState(prevSceneKey, timeLeft);
      }
      this.game?.scene.start(prevSceneKey, timeLeft !== undefined ? { timeLeft } : undefined);
    }
  }

  getSceneOrder(): string[] {
    return [...this.sceneOrder];
  }
}
