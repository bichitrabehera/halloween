import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

export class Prologue extends Phaser.Scene {
  constructor() {
    super({ key: "Prologue" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
  }

  create() {
    const { width, height } = this.scale;

    // === BACKGROUND ===
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setTint(0x555555);

    // === ROUND TITLE ===
    const roundTitle = this.add
      .text(width / 2, height * 0.1, "Prologue: Echoes from the Kernel", {
        fontSize: "30px",
        fontFamily: '"Press Start 2P", monospace', // Added quotes and better fallback
        color: "#F8D47E",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setAlpha(0);

    this.tweens.add({
      targets: roundTitle,
      alpha: 1,
      duration: 1000,
      ease: "Power2",
    });

    // === STORY TEXT ===
    const story = `



In the forgotten digital town of Byte Hollow, there lived once a developer unlike any other a genius, a madman, a sorcerer of syntax. His name was lost to time, but the legends remember him as The Codemancer.

Obsessed with unlocking forbidden knowledge, he created a language made not of logic, but of chaos. He bound JavaScript to Python, wrapped recursion in hex, and opened ports to unknown realms. His final program the BugHex Protocol was so dangerous, so unstable, it began to consume the very world that ran it.

To stop him, the greatest minds of the Old Code sealed him away in the Shadow Kernel, an exile from which no packet ever returned. But on Halloween night when the firewalls between realities grow thin his curse has reawakened.

Now, systems everywhere are crashing. Time loops. Logic breaks. And Byte Hollow is being pulled back into his corrupted code.

There is only one hope: you, the last of the Codebreakers a keeper of clean logic and defender of truth in syntax. You must venture through haunted systems, decode the Codemancer’s traps, and face him before midnight.

If you fail, the world will be rewritten in his image.



`;

    this.add
      .text(width / 2, height * 0.55, story, {
        fontSize: "20px",
        fontFamily: "Courier Prime, monospace",
        color: "#E5E5E5",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5)
      .setDepth(3);

    // === CONTINUE PROMPT ===
    const continueText = this.add
      .text(width / 2, height * 0.9, "[ Press ENTER to Continue ]", {
        fontSize: "22px",
        fontFamily: "Pixelify Sans, Arial",
        color: "#B2B2B2",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(4);

    // Fade in the continue prompt after story finishes
    this.time.delayedCall(story.length * 100 + 1000, () => {
      this.tweens.add({
        targets: continueText,
        alpha: 1,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    });

    // === Go to next scene when ENTER pressed ===
    if (this.input.keyboard) {
      this.input.keyboard.on("keydown-ENTER", () => {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
          this.scene.start("StartScene"); // change to your next scene key
        });
      });
    }

    // === FADE IN CAMERA ===
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
