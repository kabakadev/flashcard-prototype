"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Target, Clock } from "lucide-react"
import FlashCard from "./components/FlashCard"
import "./App.css"

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
]

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
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
              login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Master Any Subject with Smart Flashcards! 📚
          </h2>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            Create personalized decks, track your progress, and optimize your learning with spaced repetition.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { Icon: GraduationCap, text: "Build decks effortlessly" },
              { Icon: Target, text: "Track your Study progress" },
              { Icon: Clock, text: "Review at the perfect time" },
            ].map(({ Icon, text }, index) => (
              <div key={index} className="bg-[#98f5e1] dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
                <Icon className="w-8 h-8 mx-auto mb-4 text-gray-800 dark:text-blue-400" />
                <p className="text-center text-gray-800 dark:text-white">{text}</p>
              </div>
            ))}
          </div>

          <button className="px-8 py-3 rounded-lg bg-[#f1c0e8] dark:bg-blue-500 text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300 mb-16">
            Start learning today
          </button>

          {/* Flashcards Section */}
          <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Try Our Interactive Flashcards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {sampleCards.map((card) => (
              <FlashCard key={card.id} {...card} />
            ))}
          </div>

          {/* Bottom Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Understand Any Topic, One Flashcard at a Time
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and study your own flashcards with an intuitive, distraction-free experience. Track your progress
                and retain knowledge more effectively.
              </p>
            </div>
            <div className="bg-[#98f5e1] dark:bg-gray-800 rounded-lg aspect-square transition-colors duration-300" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2025 Flashlearn. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App

