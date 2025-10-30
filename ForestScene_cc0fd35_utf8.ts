import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

interface Question {
  id: number;
  question: string;
  answer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: `Python Coding:
x = 2
for i in range(5):
    x *= 2
print(x)
What number echoes from the void?`,
    answer: "64",
  },
  {
    id: 2,
    question: `If the cost of 5 pens and 3 pencils is $21, and the cost of 2 pens and 1 pencil is $7, what is the cost of 1 pen?`,
    answer: "2",
  },
  {
    id: 3,
    question: `A train 120m long is running at a speed of 60 km/h. In how many seconds will it pass a man standing on the platform?`,
    answer: "7.2",
  },
  {
    id: 4,
    question: `If 3 typists can type 3 pages in 3 minutes, how many typists will it take to type 18 pages in 6 minutes?`,
    answer: "6",
  },
  {
    id: 5,
    question: `A bag contains 6 red, 4 blue, and 5 green balls. What is the minimum number of balls you need to pick to be sure of getting at least 2 balls of the same color?`,
    answer: "4",
  },
  {
    id: 6,
    question: `In a class of 60 students, 30 study English, 25 study Maths, and 10 study both. How many students study neither?`,
    answer: "15",
  },
  {
    id: 7,
    question: `A man buys an article for $240 and sells it at a 20% profit. He then sells another article for $180 at 10% loss. What is his overall profit or loss?`,
    answer: "20",
  },
  {
    id: 8,
    question: `Find the next number in the series: 2, 6, 12, 20, 30, ?`,
    answer: "42",
  },
  {
    id: 9,
    question: `A cube has side length 4 cm. How many smaller cubes of side 1 cm can be formed from it?`,
    answer: "64",
  },
  {
    id: 10,
    question: `If a clock is set right at 6 AM, in how many minutes will it gain 12 minutes?`,
    answer: "720",
  },
];

export class ForestScene extends Phaser.Scene {
  private userAnswers: { [key: number]: string } = {};
  private score: number | null = null;
  private startTime: number = 0;
  private inputs: HTMLInputElement[] = [];
  private submitButton: Phaser.GameObjects.Text | null = null;
  private scoreText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: "ForestScene" });
  }

  init(data: { startTime: number }) {
    this.startTime = data.startTime;
  }

  preload() {
    this.load.image("bg_forest", forestBg);
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add
      .image(width / 2, height / 2, "bg_forest")
      .setDisplaySize(width, height)
      .setDepth(0)
      .setTint(0x222222);

    // Title
    this.add
      .text(width / 2, 50, "Company Aptitude Quiz", {
        fontSize: "32px",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Display questions and create inputs
    let yOffset = 100;
    questions.forEach((q) => {
      // Question text
      this.add
        .text(50, yOffset, `Q${q.id}: ${q.question}`, {
          fontSize: "18px",
          color: "#FFFFFF",
          wordWrap: { width: width - 100 },
        })
        .setOrigin(0, 0);

      yOffset += 120; // Adjust based on question length

      // Create DOM input for answer
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "absolute";
      input.style.left = "50px";
      input.style.top = `${yOffset}px`;
      input.style.width = "400px";
      input.style.padding = "8px";
      input.style.fontSize = "16px";
      input.style.zIndex = "1000";
      document.body.appendChild(input);
      this.inputs.push(input);

      // Handle input change
      input.addEventListener("input", (e) => {
        this.userAnswers[q.id] = (e.target as HTMLInputElement).value;
      });

      yOffset += 50;
    });

    // Submit button
    this.submitButton = this.add
      .text(width / 2, yOffset + 50, "Submit", {
        fontSize: "24px",
        color: "#FFD700",
        backgroundColor: "#333333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleSubmit());

    // Score display (initially hidden)
    this.scoreText = this.add
      .text(width / 2, yOffset + 120, "", {
        fontSize: "24px",
        color: "#FFD700",
      })
      .setOrigin(0.5);
  }

  handleSubmit() {
    let tempScore = 0;
    questions.forEach((q) => {
      if (
        this.userAnswers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()
      ) {
        tempScore += 1;
      }
    });
    this.score = tempScore;

    // Display score
    if (this.scoreText) {
      this.scoreText.setText(`Your score: ${this.score} / ${questions.length}`);
    }

    // Remove inputs after submission
    this.inputs.forEach((input) => {
      document.body.removeChild(input);
    });
    this.inputs = [];

    // Disable submit button
    if (this.submitButton) {
      this.submitButton.disableInteractive();
      this.submitButton.setColor("#666666");
    }

    // Calculate time taken
    const endTime = Date.now();
    const timeTaken = (endTime - this.startTime) / 1000; // in seconds
    console.log(`Quiz completed in ${timeTaken} seconds`);

    // TODO: Transition to next scene based on score or time
  }

  // Clean up DOM elements when scene is destroyed
  // Phaser scenes don't have a destroy method, but we can override shutdown
  shutdown() {
    this.inputs.forEach((input) => {
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    });
  }
}
