import Phaser from "phaser";

interface Mirror {
  gameObject: Phaser.GameObjects.Rectangle;
  angle: number;
  x: number;
  y: number;
  id: number;
}

interface Beam {
  graphics: Phaser.GameObjects.Graphics;
  points: { x: number; y: number }[];
  active: boolean;
}

interface Intersection {
  x: number;
  y: number;
  type: "mirror" | "target";
  mirrorIndex?: number;
  targetIndex?: number;
}

export class RitualScene extends Phaser.Scene {
  private timeLeft: number = 240; // 4 minutes for final challenge
  private timerText!: Phaser.GameObjects.Text;
  private mirrors: Mirror[] = [];
  private beams: Beam[] = [];
  private beamSource: { x: number; y: number } = { x: 100, y: 400 };
  private beamTargets: { x: number; y: number }[] = [
    { x: 900, y: 200 },
    { x: 900, y: 400 },
    { x: 900, y: 600 },
  ];
  private isComplete: boolean = false;
  private completedTargets: number = 0;
  private requiredTargets: number = 3;
  private backButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "RitualScene" });
  }

  preload() {
    // Placeholder for ritual chamber background
    this.load.image(
      "ritual-bg",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    );
  }

  create(data?: { timeLeft?: number }) {
    const { width, height } = this.scale;

    if (data && data.timeLeft !== undefined) {
      this.timeLeft = data.timeLeft;
    }

    // Create ritual chamber background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f23);

    // Add ritual atmosphere
    this.createRitualAtmosphere();

    // Scene title
    this.add
      .text(width / 2, height * 0.08, "THE FINAL RITUAL", {
        fontSize: "36px",
        color: "#ffd700",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#b8860b",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        height * 0.15,
        "Direct the mystical beams to all three targets using the mirrors.\nClick and drag mirrors to rotate them and redirect the light.",
        {
          fontSize: "18px",
          color: "#f0e68c",
          fontFamily: '"Pixelify Sans", sans-serif',

          align: "center",
          wordWrap: { width: width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Timer
    this.timerText = this.add
      .text(width / 2, height * 0.22, `Time: ${this.timeLeft}s`, {
        fontSize: "24px",
        color: "#ff6b6b",
        fontFamily: "serif",
      })
      .setOrigin(0.5);

    // Navigation buttons
    this.createNavigationButtons();

    // Save initial state if restored
    if (data && data.timeLeft !== undefined) {
      import("../Game").then(({ WitchingHourGame }) => {
        WitchingHourGame.saveState(this.scene.key, this.timeLeft);
      });
    }

    // Create beam source
    this.createBeamSource();

    // Create beam targets
    this.createBeamTargets();

    // Create mirrors
    this.createMirrors();

    // Start beam calculation
    this.updateBeams();

    // Start timer
    this.startTimer();

    // Add final hint
    this.add
      .text(
        width / 2,
        height * 0.9,
        'The final incantation: "Let light find its way through reflection and guide us to salvation"',
        {
          fontSize: "24px",
          color: "#9370db",
          fontFamily: '"Pixelify Sans", sans-serif',

          fontStyle: "italic",
          align: "center",
          wordWrap: { width: width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private createRitualAtmosphere() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height * 0.5;
    const circleRadius = Math.min(width, height) * 0.3;
    const innerRadius = Math.min(width, height) * 0.25;

    // Create ritual circle
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffd700, 0.6);
    graphics.strokeCircle(centerX, centerY, circleRadius);
    graphics.strokeCircle(centerX, centerY, innerRadius);

    // Add mystical symbols around the circle
    const symbols = ["☽", "☾", "✦", "⚡", "🔮", "✨", "🌟", "⭐"];
    symbols.forEach((symbol, index) => {
      const angle = (index * 45 * Math.PI) / 180;
      const x = centerX + Math.cos(angle) * (circleRadius * 0.9);
      const y = centerY + Math.sin(angle) * (circleRadius * 0.9);

      this.add
        .text(x, y, symbol, {
          fontSize: "24px",
          color: "#ffd700",
        })
        .setOrigin(0.5);
    });

    // Add floating energy particles
    this.add.particles(0, 0, "ritual-bg", {
      x: { min: width * 0.2, max: width * 0.8 },
      y: { min: height * 0.3, max: height * 0.7 },
      scale: { start: 0.2, end: 0.05 },
      alpha: { start: 0.8, end: 0.2 },
      speed: { min: 10, max: 30 },
      lifespan: 3000,
      frequency: 150,
      tint: [0xffd700, 0xffff00, 0xffa500],
    });
  }

  private createBeamSource() {
    const { width, height } = this.scale;
    this.beamSource.x = width * 0.1;
    this.beamSource.y = height * 0.5;

    // Create beam source crystal
    const source = this.add
      .circle(this.beamSource.x, this.beamSource.y, 20, 0xffd700)
      .setStrokeStyle(3, 0xffff00);

    this.add
      .text(this.beamSource.x, this.beamSource.y - height * 0.05, "SOURCE", {
        fontSize: "14px",
        color: "#ffd700",
        fontFamily: "serif",
      })
      .setOrigin(0.5);

    // Add pulsing effect
    this.tweens.add({
      targets: source,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private createBeamTargets() {
    const { width, height } = this.scale;
    this.beamTargets = [
      { x: width * 0.9, y: height * 0.25 },
      { x: width * 0.9, y: height * 0.5 },
      { x: width * 0.9, y: height * 0.75 },
    ];

    this.beamTargets.forEach((target, index) => {
      const targetObj = this.add
        .circle(target.x, target.y, 15, 0x666666)
        .setStrokeStyle(2, 0xffd700);

      this.add
        .text(target.x, target.y + height * 0.04, `TARGET ${index + 1}`, {
          fontSize: "12px",
          color: "#ffd700",
          fontFamily: "serif",
        })
        .setOrigin(0.5);

      // Store reference for hit detection
      targetObj.setData("targetIndex", index);
      targetObj.setData("isHit", false);
    });
  }

  private createMirrors() {
    const { width, height } = this.scale;
    const mirrorPositions = [
      { x: width * 0.3, y: height * 0.4, angle: 45 },
      { x: width * 0.5, y: height * 0.35, angle: 135 },
      { x: width * 0.7, y: height * 0.4, angle: 45 },
      { x: width * 0.4, y: height * 0.65, angle: 315 },
      { x: width * 0.6, y: height * 0.7, angle: 225 },
    ];

    mirrorPositions.forEach((pos, index) => {
      // Create mirror
      const mirror = this.add
        .rectangle(pos.x, pos.y, 60, 8, 0xc0c0c0)
        .setStrokeStyle(2, 0xffd700);

      mirror.setRotation((pos.angle * Math.PI) / 180);

      const mirrorObj: Mirror = {
        gameObject: mirror,
        angle: pos.angle,
        x: pos.x,
        y: pos.y,
        id: index,
      };

      this.mirrors.push(mirrorObj);

      // Make interactive
      mirror.setInteractive({ useHandCursor: true });
      this.input.setDraggable(mirror);

      // Drag events
      mirror.on("drag", (pointer: Phaser.Input.Pointer) => {
        // Calculate angle based on drag direction
        const angle = Phaser.Math.Angle.Between(
          pos.x,
          pos.y,
          pointer.x,
          pointer.y
        );
        mirrorObj.angle = (angle * 180) / Math.PI + 90;
        mirror.setRotation(angle + Math.PI / 2);

        this.updateBeams();
      });
    });
  }

  private updateBeams() {
    // Clear existing beams
    this.beams.forEach((beam) => {
      beam.graphics.destroy();
    });
    this.beams = [];

    // Reset target hit status
    this.completedTargets = 0;

    // Calculate beam paths
    this.calculateBeamPath();
  }

  private calculateBeamPath() {
    const maxReflections = 10;
    let currentPos = { ...this.beamSource };
    let currentAngle = 0; // Start pointing right
    let reflections = 0;
    const beamPoints = [{ ...currentPos }];

    while (reflections < maxReflections) {
      // Find next intersection
      const intersection = this.findNextIntersection(currentPos, currentAngle);

      if (!intersection) {
        // No intersection, beam goes to edge of screen
        const edgePoint = this.getScreenEdgeIntersection(
          currentPos,
          currentAngle
        );
        beamPoints.push(edgePoint);
        break;
      }

      beamPoints.push({ x: intersection.x, y: intersection.y });

      if (intersection.type === "mirror") {
        // Reflect off mirror
        const mirror = this.mirrors[intersection.mirrorIndex!];
        const mirrorAngle = (mirror.angle * Math.PI) / 180;
        const incidentAngle = currentAngle;

        // Calculate reflection angle
        const normalAngle = mirrorAngle + Math.PI / 2;
        const reflectionAngle = 2 * normalAngle - incidentAngle - Math.PI;

        currentAngle = reflectionAngle;
        currentPos = { x: intersection.x, y: intersection.y };
        reflections++;
      } else if (intersection.type === "target") {
        // Hit target
        this.hitTarget(intersection.targetIndex!);
        break;
      }
    }

    // Create beam graphics
    this.drawBeam(beamPoints);
  }

  private findNextIntersection(
    pos: { x: number; y: number },
    angle: number
  ): Intersection | null {
    let closestIntersection: Intersection | null = null;
    let closestDistance = Infinity;

    // Check intersections with mirrors
    this.mirrors.forEach((mirror, index) => {
      const intersection = this.getLineRectangleIntersection(
        pos,
        angle,
        mirror
      );
      if (intersection) {
        const distance = Phaser.Math.Distance.Between(
          pos.x,
          pos.y,
          intersection.x,
          intersection.y
        );
        if (distance > 5 && distance < closestDistance) {
          // Avoid immediate re-intersection
          closestDistance = distance;
          closestIntersection = {
            ...intersection,
            type: "mirror",
            mirrorIndex: index,
          };
        }
      }
    });

    // Check intersections with targets
    this.beamTargets.forEach((target, index) => {
      const distance = Phaser.Math.Distance.Between(
        pos.x,
        pos.y,
        target.x,
        target.y
      );
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const targetAngle = Math.atan2(dy, dx);

      // Check if beam is pointing towards target
      const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(angle - targetAngle));
      if (angleDiff < 0.1 && distance < closestDistance) {
        // Small angle tolerance
        closestDistance = distance;
        closestIntersection = {
          x: target.x,
          y: target.y,
          type: "target",
          targetIndex: index,
        };
      }
    });

    return closestIntersection;
  }

  private getLineRectangleIntersection(
    pos: { x: number; y: number },
    angle: number,
    mirror: Mirror
  ) {
    // Simplified intersection calculation
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Check if line intersects with mirror bounds
    const centerX = mirror.x;
    const centerY = mirror.y;

    // Calculate intersection point (simplified)
    const t = (centerX - pos.x) / dx;
    if (t > 0) {
      const intersectY = pos.y + t * dy;
      if (Math.abs(intersectY - centerY) < 30) {
        // Mirror height tolerance
        return { x: centerX, y: intersectY };
      }
    }

    return null;
  }

  private getScreenEdgeIntersection(
    pos: { x: number; y: number },
    angle: number
  ) {
    const { width, height } = this.scale;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Find intersection with screen edges
    const tRight = (width - pos.x) / dx;
    const tLeft = (0 - pos.x) / dx;
    const tBottom = (height - pos.y) / dy;
    const tTop = (0 - pos.y) / dy;

    const validTs = [tRight, tLeft, tBottom, tTop].filter((t) => t > 0);
    const minT = Math.min(...validTs);

    return {
      x: pos.x + minT * dx,
      y: pos.y + minT * dy,
    };
  }

  private drawBeam(points: { x: number; y: number }[]) {
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xffff00, 0.8);

    if (points.length > 1) {
      graphics.beginPath();
      graphics.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        graphics.lineTo(points[i].x, points[i].y);
      }

      graphics.strokePath();
    }

    const beam: Beam = {
      graphics,
      points,
      active: true,
    };

    this.beams.push(beam);
  }

  private hitTarget(targetIndex: number) {
    this.completedTargets++;

    // Visual feedback for hit target
    const target = this.beamTargets[targetIndex];
    this.add
      .circle(target.x, target.y, 15, 0x00ff00)
      .setStrokeStyle(3, 0xffff00);

    // Particle effect
    const particles = this.add.particles(target.x, target.y, "ritual-bg", {
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      speed: { min: 50, max: 100 },
      lifespan: 1000,
      quantity: 15,
      tint: 0x00ff00,
    });

    this.time.delayedCall(1000, () => {
      particles.destroy();
    });

    // Check if all targets are hit
    if (this.completedTargets >= this.requiredTargets) {
      this.onPuzzleComplete();
    }
  }

  private createNavigationButtons() {
    const { width, height } = this.scale;

    // Back button (to CryptScene)
    this.backButton = this.createButton(
      width * 0.25,
      height * 0.9,
      "← BACK",
      0x87cefa,
      0x000000
    );
    const backBg = this.backButton.list[0] as Phaser.GameObjects.Rectangle;
    backBg.setInteractive({ useHandCursor: true });
    backBg.on("pointerup", () => this.goBack());

    // No next button for final scene
  }

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

  private goBack() {
    // Save current time and go to previous scene
    import("../Game").then(({ WitchingHourGame }) => {
      WitchingHourGame.saveState("CryptScene", this.timeLeft);
      this.scene.start("CryptScene", { timeLeft: this.timeLeft });
    });
  }

  private onPuzzleComplete() {
    const { width, height } = this.scale;

    this.isComplete = true;

    // Clear state on completion
    import("../Game").then(({ WitchingHourGame }) => {
      WitchingHourGame.clearState();
    });

    // Final success message
    this.add
      .text(width / 2, height * 0.4, "THE RITUAL IS COMPLETE!", {
        fontSize: "48px",
        color: "#ffd700",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#b8860b",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height * 0.45,
        "The Witching Hour has passed.\nThe darkness retreats, and dawn approaches.",
        {
          fontSize: "24px",
          color: "#f0e68c",
          fontFamily: '"Pixelify Sans", sans-serif',

          align: "center",
        }
      )
      .setOrigin(0.5);

    // Disable all interactions
    this.mirrors.forEach((mirror) => {
      mirror.gameObject.disableInteractive();
    });

    // Victory animation
    const victoryGraphics = this.add.graphics();
    victoryGraphics.lineStyle(8, 0xffd700, 1);
    victoryGraphics.strokeCircle(
      width / 2,
      height * 0.5,
      Math.min(width, height) * 0.4
    );

    this.tweens.add({
      targets: victoryGraphics,
      alpha: 0,
      scaleX: 3,
      scaleY: 3,
      duration: 3000,
      ease: "Power2",
    });

    // End game message
    this.time.delayedCall(4000, () => {
      this.add
        .text(
          width / 2,
          height * 0.6,
          "Thank you for playing The Witching Hour!",
          {
            fontSize: "28px",
            color: "#ffffff",
            fontFamily: "serif",
          }
        )
        .setOrigin(0.5);

      this.add
        .text(
          width / 2,
          height * 0.65,
          "Click anywhere to restart the adventure",
          {
            fontSize: "18px",
            color: "#cccccc",
            fontFamily: "serif",
          }
        )
        .setOrigin(0.5);

      // Allow restart
      this.input.once("pointerdown", () => {
        this.scene.start("IntroScene");
      });
    });
  }

  private startTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isComplete) {
          this.timeLeft--;
          this.timerText.setText(`Time: ${this.timeLeft}s`);

          // Save state
          import("../Game").then(({ WitchingHourGame }) => {
            WitchingHourGame.saveState(this.scene.key, this.timeLeft);
          });

          if (this.timeLeft <= 0) {
            this.onTimeUp();
          } else if (this.timeLeft <= 30) {
            this.timerText.setColor("#ff0000");
          }
        }
      },
      loop: true,
    });
  }

  private onTimeUp() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.5, "OOPS! ELIMINATED!", {
        fontSize: "32px",
        color: "#ff0000",
        fontFamily: '"Pixelify Sans", sans-serif',

        stroke: "#8b0000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    // Disable interactions
    this.mirrors.forEach((mirror) => {
      mirror.gameObject.disableInteractive();
    });

    // Clear state and go to Intro
    import("../Game").then(({ WitchingHourGame }) => {
      WitchingHourGame.clearState();
    });

    // Go to Intro after delay
    this.time.delayedCall(3000, () => {
      this.scene.start("IntroScene");
    });
  }
}
