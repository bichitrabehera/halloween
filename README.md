# 🎃 The Witching Hour

A mystical 2D puzzle-adventure game built with React, Vite, and Phaser 3.

## 🎯 Game Overview

**The Witching Hour** is an atmospheric story-driven puzzle game where players must solve four challenging puzzles before midnight strikes. Navigate through haunted vaults, ancient forests, cryptic chambers, and perform the final ritual to prevent eternal darkness.

### 🧩 Game Features

- **4 Unique Puzzle Scenes**: Each with distinct mechanics and atmospheric visuals
- **Story-Driven Experience**: Rich narrative with mystical themes
- **Timed Challenges**: Race against the clock in each scene
- **Interactive Puzzles**: Drag-and-drop, rotation, and beam-redirection mechanics
- **Atmospheric Design**: Immersive visuals with particle effects and animations

### 🎮 Puzzle Types

1. **Prophecy Scene** - Rune alignment puzzle
2. **Forest Scene** - Symbol altar sequence puzzle  
3. **Crypt Scene** - Floating rune rotation puzzle
4. **Ritual Scene** - Beam and mirror redirection puzzle

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Phaser 3.90** - Game engine
- **CSS3** - Styling and animations

## 📁 Project Structure

```
src/
├── phaser/
│   ├── Game.ts              # Main Phaser game initialization
│   └── scenes/
│       ├── IntroScene.ts    # Game introduction
│       ├── ProphecyScene.ts # Rune alignment puzzle
│       ├── ForestScene.ts   # Symbol sequence puzzle
│       ├── CryptScene.ts    # Rotation puzzle
│       └── RitualScene.ts   # Final beam puzzle
├── components/
│   └── GameCanvas.tsx       # React wrapper for Phaser
├── App.tsx                  # Main React component
└── main.tsx                 # React entry point
```

## 🎨 Game Design

### Visual Style
- Dark, mystical atmosphere with purple and gold color schemes
- Particle effects for magical ambiance
- Smooth animations and transitions between scenes

### Gameplay Mechanics
- **No character movement** - All interaction through UI elements
- **Click-based puzzles** - Drag, drop, and rotate objects
- **Progressive difficulty** - Each scene introduces new mechanics
- **Time pressure** - Countdown timers add urgency

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎃 Happy Halloween!

Enjoy solving the mysteries of The Witching Hour! 🌙✨
