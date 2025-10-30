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
  private currentQuestionIndex: number = 0;
  private score: number = 0;
  private startTime: number = 0;
  private inputElement!: HTMLInputElement;
  private submitButton: Phaser.GameObjects.Text | null = null;
  private questionText: Phaser.GameObjects.Text | null = null;
  private feedbackText: Phaser.GameObjects.Text | null = null;
  private hintText: Phaser.GameObjects.Text | null = null;
  private chancesText: Phaser.GameObjects.Text | null = null;
  private attemptsLeft: number = 3;

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

    // Chances Text (Top-Right)
    this.chancesText = this.add
      .text(width - 30, 30, `Chances Left: ${this.attemptsLeft}`, {
        fontSize: "24px",
        color: "#ffcc00",
        fontFamily: "Poppins, Arial",
      })
      .setOrigin(1, 0);

    // Display current question
    this.displayCurrentQuestion();

    // Feedback Text
    this.feedbackText = this.add
      .text(width / 2, height * 0.7, "", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Henny Penny, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Hint Text
    this.hintText = this.add
      .text(width / 2, height * 0.8, "", {
        fontSize: "20px",
        color: "#aaaaff",
        fontFamily: "Poppins, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Enter Key
    this.input.keyboard?.on("keydown-ENTER", () => this.handleSubmit());
  }

  displayCurrentQuestion() {
    const { width, height } = this.scale;
    const q = questions[this.currentQuestionIndex];

    // Question text
    this.questionText = this.add
      .text(50, 100, `Q${q.id}: ${q.question}`, {
        fontSize: "18px",
        color: "#FFFFFF",
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0, 0);

    // Create DOM input for answer
    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Enter your answer";
    this.inputElement.style.position = "absolute";
    this.inputElement.style.left = "50px";
    this.inputElement.style.top = `${height * 0.5}px`;
    this.inputElement.style.width = "400px";
    this.inputElement.style.padding = "8px";
    this.inputElement.style.fontSize = "16px";
    this.inputElement.style.zIndex = "1000";
    this.inputElement.style.border = "none";
    this.inputElement.style.borderBottom = "3px solid #ffcc00";
    this.inputElement.style.borderRight = "3px solid #ffcc00";
    this.inputElement.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    document.body.appendChild(this.inputElement);

    // Submit button
    this.submitButton = this.add
      .text(width / 2, height * 0.6, "Submit", {
        fontSize: "24px",
        color: "#FFD700",
        backgroundColor: "#333333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleSubmit());
  }

  handleSubmit() {
    const answer = this.inputElement.value.trim().toLowerCase();
    const correctAnswer =
      questions[this.currentQuestionIndex].answer.toLowerCase();

    if (answer === correctAnswer) {
      this.score += 1;
      this.feedbackText?.setText("Correct! Well done.");
      this.feedbackText?.setColor("#00ff00");
      this.currentQuestionIndex += 1;

      // Remove current elements
      this.questionText?.destroy();
      this.inputElement.remove();
      this.submitButton?.destroy();

      if (this.currentQuestionIndex < questions.length) {
        this.time.delayedCall(1000, () => {
          this.feedbackText?.setText("");
          this.displayCurrentQuestion();
        });
      } else {
        // Quiz completed
        const endTime = Date.now();
        const timeTaken = (endTime - this.startTime) / 1000;
        console.log(
          `Quiz completed in ${timeTaken} seconds with score ${this.score}`
        );
        this.time.delayedCall(1000, () => {
          this.scene.start("FinishScene", {
            startTime: this.startTime,
            score: this.score,
          });
        });
      }
    } else {
      this.attemptsLeft -= 1;
      this.updateChancesDisplay();

      if (this.attemptsLeft === 1) {
        this.hintText?.setText("Hint: Think carefully about the calculation.");
      }

      if (this.attemptsLeft > 0) {
        this.feedbackText?.setText(
          `Wrong! Try again. (${this.attemptsLeft} tries left)`
        );
        this.feedbackText?.setColor("#ff4444");
      } else {
        this.feedbackText?.setText("Game Over! The forest consumes you...");
        this.feedbackText?.setColor("#ff0000");
        this.inputElement.disabled = true;
        this.submitButton?.disableInteractive();
        this.time.delayedCall(2000, () => {
          this.inputElement.remove();
          this.scene.start("GameOver");
        });
      }
    }
  }

  updateChancesDisplay() {
    this.chancesText?.setText(`Chances Left: ${this.attemptsLeft}`);
    this.chancesText?.setColor(this.attemptsLeft <= 1 ? "#ff4444" : "#ffcc00");
  }

  // Clean up DOM elements when scene is destroyed
  // Phaser scenes don't have a destroy method, but we can override shutdown
  shutdown() {
    if (this.inputElement && document.body.contains(this.inputElement)) {
      document.body.removeChild(this.inputElement);
    }
  }
}
