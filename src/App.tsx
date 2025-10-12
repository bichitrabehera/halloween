import GameCanvas from "./components/GameCanvas";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white font-serif">
      <main className="flex items-center justify-center">
        <div className="w-full max-w-10xl aspect-[4/3]">
          <GameCanvas />
        </div>
      </main>
    </div>
  );
}

export default App;
