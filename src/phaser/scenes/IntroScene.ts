import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

export class IntroScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  private dialogBox!: Phaser.GameObjects.Rectangle;
  private dialogText!: Phaser.GameObjects.Text;
  private nextButton!: Phaser.GameObjects.Container;
  private backButton!: Phaser.GameObjects.Container;
  private titleText!: Phaser.GameObjects.Text;

  private storyPages: string[] = [];
  private currentPage: number = 0;

  constructor() {
    super({ key: "IntroScene" });
  }

  preload() {
    this.load.image("bg_forest", forestBg);
  }

  create() {
    const { width, height } = this.scale;

    // --- Background ---
    this.bg = this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setDepth(0);

    // --- Game Title ---
    this.titleText = this.add
      .text(20, 20, "THE WITCHING HOUR", {
        fontSize: "32px",
        color: "#ffcc00",
        fontFamily: "Pixelify Sans",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0, 0)
      .setDepth(2);

    // --- Story Pages ---
    this.storyPages = [
      `Welcome, brave adventurer!

The Kingdom of Eldrith is now cursed.
Ruled by Queen Isolde, it once knew prosperity.

A terrible prophecy threatens eternal darkness: The Witching Hour —
when the veil between the living and the dead grows thin...`,

      `The only hope lies in the Moonstone Crystal —
a relic that can seal away the darkness.
But it has been stolen by the necromancer, Lord Varkon.

Queen Isolde has summoned you —
a young adventurer from a forgotten village —
to retrieve the Moonstone and save the kingdom.`,

      `Your journey begins within the Royal Keep,
haunted by shadows as the curse spreads.

Only a fragmented prophecy remains:
"When the blood moon rises and the veil is thin,
the Moonstone lies beneath the haunted forest..."

Four trials await you:
• The Haunted Vault
• The Forest’s shifting paths
• The Crypt’s cursed runes
• The Final Ritual’s beams of light

The fate of Eldrith rests in your hands...`,
    ];

    // --- Dialog Box ---
    this.dialogBox = this.add
      .rectangle(
        width / 2,
        height * 0.65,
        width * 0.6,
        height * 0.55,
        0xfff8e7,
        0.95
      )
      .setStrokeStyle(4, 0xd4af7f)
      .setDepth(1)
      .setOrigin(0.5);

    // --- Dialog Text ---
    this.dialogText = this.add
      .text(width / 2, height * 0.65, this.storyPages[0], {
        fontSize: "28px",
        color: "#4b0082",
        fontFamily: "Pixelify Sans",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5)
      .setDepth(2);

    // --- Buttons ---
    this.nextButton = this.createButton(
      width * 0.75,
      height * 0.85,
      "NEXT →",
      0xff6b6b,
      0x000000
    );
    const nextBg = this.nextButton.list[0] as Phaser.GameObjects.Rectangle;
    nextBg.setInteractive({ useHandCursor: true });
    nextBg.on("pointerup", () => this.advanceStory());

    // No back button for IntroScene (first scene)
    this.backButton = this.createButton(
      width * 0.25,
      height * 0.85,
      "← BACK",
      0x87cefa,
      0x000000
    );
    this.backButton.setVisible(false); // Always hidden
  }

  // --- Helper to create button container ---
  private createButton(
    x: number,
    y: number,
    text: string,
    bgColor: number,
    textColor: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y).setDepth(3);

    const bg = this.add
      .rectangle(0, 0, 160, 50, bgColor)
      .setStrokeStyle(3, 0x000000);
    const label = this.add
      .text(0, 0, text, {
        fontSize: "24px",
        fontFamily: "Pixelify Sans",
        color: `#${textColor.toString(16).padStart(6, "0")}`,
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    container.add([bg, label]);
    return container;
  }

  // --- Advance story ---
  private advanceStory() {
    if (this.currentPage < this.storyPages.length - 1) {
      this.currentPage++;
      this.dialogText.setText(this.storyPages[this.currentPage]);
      this.backButton.setVisible(true);

      if (this.currentPage === this.storyPages.length - 1) {
        // Change NEXT → BEGIN QUEST
        (this.nextButton.list[1] as Phaser.GameObjects.Text).setText(
          "BEGIN QUEST"
        );
        (this.nextButton.list[0] as Phaser.GameObjects.Rectangle).setFillStyle(
          0x88ff88
        );
      }
    } else {
      this.scene.start("ProphecyScene");
    }
  }

  // --- Go back in story ---
  private goBack() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.dialogText.setText(this.storyPages[this.currentPage]);
      if (this.currentPage === 0) this.backButton.setVisible(false);

      if (this.currentPage < this.storyPages.length - 1) {
        (this.nextButton.list[1] as Phaser.GameObjects.Text).setText("NEXT →");
        (this.nextButton.list[0] as Phaser.GameObjects.Rectangle).setFillStyle(
          0xff6b6b
        );
      }
    }
  }
}
