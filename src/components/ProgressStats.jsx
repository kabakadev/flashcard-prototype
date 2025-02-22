"use client"

import { motion } from "framer-motion"
import { CircularProgress } from "./CircularProgress"
import { Brain, Trophy, Clock, Target } from "lucide-react"

export default function ProgressStats() {
  const stats = [
    {
      icon: Brain,
      value: 85,
      label: "Retention Rate",
      description: "Average memory retention",
    },
    {
      icon: Trophy,
      value: 120,
      label: "Cards Mastered",
      description: "Successfully learned",
    },
    {
      icon: Clock,
      value: 15,
      label: "Minutes/Day",
      description: "Average study time",
    },
    {
      icon: Target,
      value: 92,
      label: "Accuracy",
      description: "Correct answers",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Centered Title and Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Understand Any Topic, One Flashcard at a Time
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Create and study your own flashcards with an intuitive, distraction-free experience. Track your progress and
          retain knowledge more effectively.
        </p>
      </motion.div>

      {/* Stats Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Circular Progress Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#98f5e1] dark:bg-gray-800 rounded-lg p-8 h-[400px] transition-colors duration-300"
        >
          <div className="grid grid-cols-2 gap-6 h-full items-center">
            <CircularProgress percentage={85} label="Weekly Goal" color="#f1c0e8" darkColor="#3b82f6" />
            <CircularProgress percentage={92} label="Mastery Level" color="#f1c0e8" darkColor="#3b82f6" />
            <CircularProgress percentage={78} label="Study Streak" color="#f1c0e8" darkColor="#3b82f6" />
            <CircularProgress percentage={95} label="Focus Score" color="#f1c0e8" darkColor="#3b82f6" />
          </div>
        </motion.div>

        {/* Stats Cards Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4 h-[400px]"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#98f5e1] dark:bg-gray-800 rounded-lg p-6 flex flex-col justify-center transition-colors duration-300"
            >
              <stat.icon className="w-6 h-6 mb-3 text-gray-800 dark:text-gray-100" />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {stat.value}
                  {stat.label.includes("Rate") || stat.label.includes("Accuracy") ? "%" : ""}
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{stat.description}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

