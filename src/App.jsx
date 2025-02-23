import { useState, useEffect } from "react";
import { GraduationCap, Target, Clock } from "lucide-react";
import FlashCard from "./components/FlashCard";
import { ThemeProvider } from "./components/theme-toggle";
import Homepage from "./components/home-page";
import "./App.css";

const sampleCards = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
  },
  {
    id: 2,
    question: "What is the chemical symbol of Gold?",
    answer: "Au",
  },
  {
    id: 3,
    question: "What is the biggest planet in our Solar system?",
    answer: "Jupiter",
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#fbf8cc] dark:bg-[#1a1b1e] transition-colors duration-300">
        {/* Navigation */}
        <nav className="bg-[#a3c4f3] dark:bg-[#2d3748] p-4 transition-colors duration-300">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Flashlearn</h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-[#f1c0e8] dark:bg-blue-500 text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#f1c0e8] dark:bg-blue-500 text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300">
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <Homepage />

        {/* Flashcards Section */}
        <div className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Try Our Interactive Flashcards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {sampleCards.map((card) => (
              <FlashCard key={card.id} {...card} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Flashlearn. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
