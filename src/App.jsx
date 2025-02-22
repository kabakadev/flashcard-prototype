"use client"

import { ThemeProvider } from "./components/ThemeProvider"
import ThemeToggle from "./components/ThemeToggle"
import FlashCard from "./components/FlashCard"
import { GraduationCap, Target, Clock, BookOpen, Brain, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import "./App.css"
import ProgressStats from "./components/ProgressStats"
import FeatureCard from "./components/FeatureCard"

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

const features = [
  {
    Icon: GraduationCap,
    title: "Build decks effortlessly",
    description: "Create custom flashcard decks with our intuitive interface. Import content or start from scratch.",
  },
  {
    Icon: Target,
    title: "Track your Study progress",
    description: "Monitor your learning journey with detailed analytics and progress tracking.",
  },
  {
    Icon: Clock,
    title: "Review at the perfect time",
    description: "Our spaced repetition system ensures you review cards at optimal intervals.",
  },
  {
    Icon: BookOpen,
    title: "Smart Learning Paths",
    description: "Follow structured learning paths designed to maximize your retention and understanding.",
  },
  {
    Icon: Brain,
    title: "Memory Techniques",
    description: "Learn and apply proven memory techniques to enhance your study sessions.",
  },
  {
    Icon: Sparkles,
    title: "Personalized Insights",
    description: "Get personalized recommendations based on your learning patterns and progress.",
  },
]

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FBF8CC] dark:bg-[#1a1b1e] transition-colors duration-300">
        {/* Navigation */}
        <nav className="bg-[#b4d4ff] dark:bg-[#2d3748] p-4 sticky top-0 z-50 transition-colors duration-300">
          <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Flashlearn</h1>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-[#ffd4f7] dark:bg-blue-500 text-gray-800 dark:text-white 
                  hover:opacity-90 transition-colors duration-300"
              >
                login
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white px-4 py-2">
              Master Any Subject with Smart Flashcards! 📚
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto px-4">
              Create personalized decks, track your progress, and optimize your learning with spaced repetition.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-none bg-[#ffd4f7] dark:bg-blue-500 text-gray-800 dark:text-white 
                hover:opacity-90 transition-colors duration-300 mb-16 text-lg font-light"
            >
              Start learning today
            </motion.button>

            {/* Flashcards Section */}
            <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Try Our Interactive Flashcards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {sampleCards.map((card) => (
                <FlashCard key={card.id} {...card} />
              ))}
            </div>

            {/* Progress Stats Section */}
            <ProgressStats />
          </div>
        </main>

        <footer className="text-center text-gray-600 dark:text-gray-400 py-8 mt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <p className="mb-4">© 2025 Flashlearn. All rights reserved.</p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-800 dark:hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App

