"use client"

import { useState } from "react"
import PropTypes from "prop-types"

function FlashCard({ question }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="bg-[#98f5e1] dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
      <h4 className="font-medium mb-4 text-gray-800 dark:text-white">Question:</h4>
      <p className="mb-6 min-h-[3rem] text-gray-800 dark:text-gray-300">{question}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 px-4 py-2 rounded-lg bg-[#f1c0e8] dark:bg-blue-500 text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300"
        >
          Flip
        </button>
        <button className="flex-1 px-4 py-2 rounded-lg bg-[#f1c0e8] dark:bg-blue-500 text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300">
          Next
        </button>
      </div>
    </div>
  )
}

FlashCard.propTypes = {
  question: PropTypes.string.isRequired,
}

export default FlashCard

