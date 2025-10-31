import Phaser from "phaser";
import forestBg from "../../assets/forest_bg.png";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string; // e.g., "A", "B", "C", or "D"
}

const questions: Question[] = [
  {
    id: 1,
    question: `In the haunted forest of code, a programmer searches
    for a value by splitting the array of souls in half each time —
    narrowing down the ghost she seeks.
What algorithm is she using?`,
    options: [
      "A) LinearSearch",
      "B) BinarySearch",
      "C) BubbleSort",
      "D) Hashing",
    ],
    answer: "B",
  },
  {
    id: 2,
    question: `Inside a dusty server room, you find a mysterious
    program where the last spirit to enter is always the first to escape.
Which data structure guards this cursed behavior?`,
    options: ["A) Queue", "B) Stack", "C) LinkedList", "D) Array"],
    answer: "B",
  },
  {
    id: 3,
    question: `A mad scientist writes code that keeps calling itself until
    it disappears into the infinite void... unless a base case saves it.
What concept is this dark spell known as?`,
    options: ["A) Looping", "B) Recursion", "C) Compilation", "D) Inheritance"],
    answer: "B",
  },
  {
    id: 4,
    question: `You open a tomb labeled “Sorting Rituals” — one scroll says:
    “Divide, conquer, and merge the fallen lists back to life.”
Which sorting algorithm lies within?`,
    options: [
      "A) QuickSort",
      "B) BubbleSort",
      "C) MergeSort",
      "D) SelectionSort",
    ],
    answer: "C",
  },
  {
    id: 5,
    question: `In a haunted operating system, multiple zombie processes wait
     for each other endlessly — none moving forward.
What is this dreadful condition called?`,
    options: ["A) Starvation", "B) Overload", "C) Deadlock", "D) Thrashing"],
    answer: "C",
  },
  {
    id: 6,
    question: `A vampire coder encrypts messages so only his clan can read them.
What is the art of this secret transformation called?`,
    options: ["A) Compression", "B) Hashing", "C) Cryptography", "D) Encoding"],
    answer: "C",
  },
  {
    id: 7,
    question: `A ghostly router decides which portal each packet should pass
    through across the haunted network.
Which OSI layer is performing this trick?`,
    options: ["A) Network", "B) DataLink", "C) Transport", "D) Physical"],
    answer: "A",
  },
  {
    id: 8,
    question: `In a cursed database, a record vanishes after every restart
    because it was never committed.
What property of transactions has been violated?`,
    options: [
      "A) Consistency",
      "B) Isolation",
      "C) Durability",
      "D) Atomicity",
    ],
    answer: "C",
  },
  {
    id: 9,
    question: `A trickster AI learns from spooky data and predicts which
    door a ghost will appear behind next.
What branch of computer science is this dark art from?`,
    options: [
      "A) DataMining",
      "B) ArtificialIntelligence",
      "C) MachineLearning",
      "D) NeuralNetworks",
    ],
    answer: "C",
  },
  {
    id: 10,
    question: `You type a spell that makes your code repeat endlessly
    while a condition stays true — it loops until you break it.
Which Python keyword starts this cursed cycle?`,
    options: ["A) for", "B) loop", "C) while", "D) repeat"],
    answer: "C",
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
  private attemptsLeft: number = 5;

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

    // Chances Text
    this.chancesText = this.add
      .text(width - 30, 30, `Chances Left: ${this.attemptsLeft}`, {
        fontSize: "24px",
        color: "#ffcc00",
        fontFamily: "Poppins, Arial",
      })
      .setOrigin(1, 0);

    // Feedback
    this.feedbackText = this.add
      .text(width / 2, height * 0.8, "", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Henny Penny, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Hint
    this.hintText = this.add
      .text(width / 2, height * 0.87, "", {
        fontSize: "20px",
        color: "#aaaaff",
        fontFamily: "Poppins, Arial",
        align: "center",
      })
      .setOrigin(0.5);

    this.displayCurrentQuestion();

    // Enter key shortcut
    this.input.keyboard?.on("keydown-ENTER", () => this.handleSubmit());
  }

  displayCurrentQuestion() {
    const { width, height } = this.scale;
    const q = questions[this.currentQuestionIndex];

    // Clean up old elements
    const existingInput = document.querySelector("input");
    if (existingInput) existingInput.remove();
    this.questionText?.destroy();
    this.submitButton?.destroy();
    this.hintText?.setText("");
    this.feedbackText?.setText("");

    // ✅ Combine question + options in one text block
    const questionText = `
Q${q.id}: ${q.question.trim()}

${q.options.join("\n")}
  `;

    // Add the question with all options
    this.questionText = this.add
      .text(width / 2, height * 0.15, questionText, {
        fontSize: "20px",
        color: "#FFFFFF",
        fontFamily: "Poppins, Arial",
        align: "left",
        wordWrap: { width: width * 0.8 },
        lineSpacing: 10,
      })
      .setOrigin(0.5, 0);

    // Position input field below text dynamically
    this.time.delayedCall(10, () => {
      const questionBounds = this.questionText!.getBounds();
      const inputTop = questionBounds.bottom + 30;

      this.inputElement = document.createElement("input");
      this.inputElement.type = "text";
      this.inputElement.placeholder = "Enter option (A, B, C, or D)";
      this.inputElement.style.position = "absolute";
      this.inputElement.style.left = `${width / 2 - 200}px`;
      this.inputElement.style.top = `${inputTop}px`;
      this.inputElement.style.width = "400px";
      this.inputElement.style.padding = "10px";
      this.inputElement.style.fontSize = "18px";
      this.inputElement.style.textAlign = "center";
      this.inputElement.style.zIndex = "1000";
      this.inputElement.style.border = "2px solid #ffcc00";
      this.inputElement.style.borderRadius = "8px";
      this.inputElement.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      document.body.appendChild(this.inputElement);

      // Submit button
      const buttonTop = inputTop + 90;
      this.submitButton = this.add
        .text(width / 2, buttonTop, "Submit", {
          fontSize: "24px",
          color: "#FFD700",
          backgroundColor: "#333333",
          padding: { x: 25, y: 12 },
          fontFamily: "Poppins, Arial",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.handleSubmit());
    });
  }

  handleSubmit() {
    const answer = this.inputElement.value.trim().toUpperCase();
    const correctAnswer =
      questions[this.currentQuestionIndex].answer.toUpperCase();

    if (["A", "B", "C", "D"].includes(answer) === false) {
      this.feedbackText?.setText("⚠️ Please enter A, B, C, or D.");
      this.feedbackText?.setColor("#ffff00");
      return;
    }

    if (answer === correctAnswer) {
      this.score += 1;
      this.feedbackText?.setText("✅ Correct! Well done.");
      this.feedbackText?.setColor("#00ff00");
      this.currentQuestionIndex += 1;

      this.questionText?.destroy();
      this.inputElement.remove();
      this.submitButton?.destroy();

      if (this.currentQuestionIndex < questions.length) {
        this.time.delayedCall(1000, () => {
          this.feedbackText?.setText("");
          this.displayCurrentQuestion();
        });
      } else {
        const endTime = Date.now();
        const timeTaken = (endTime - this.startTime) / 1000;
        console.log(`Quiz completed in ${timeTaken}s, score ${this.score}`);
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
        this.hintText?.setText("💡 Hint: Think carefully before choosing!");
      }

      if (this.attemptsLeft > 0) {
        this.feedbackText?.setText(
          `❌ Wrong! Try again. (${this.attemptsLeft} tries left)`
        );
        this.feedbackText?.setColor("#ff4444");
      } else {
        this.feedbackText?.setText("☠️ Game Over! The forest consumes you...");
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

  shutdown() {
    if (this.inputElement && document.body.contains(this.inputElement)) {
      document.body.removeChild(this.inputElement);
    }
  }
}
