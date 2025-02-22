"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"

function FlashCard({ question, answer }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative w-[282px] h-[248px] [perspective:1000px]">
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d] cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full bg-[#98f5e1] dark:bg-gray-800 rounded-[20px] p-8 flex flex-col justify-between transition-colors duration-300">
            <div>
              <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-100">Question:</h4>
              <p className="text-gray-800 dark:text-gray-200 min-h-[100px]">{question}</p>
            </div>
            <div className="flex gap-[19px]">
              <button
                onClick={() => setIsFlipped(true)}
                className="flex-1 py-2 rounded-[30px] bg-[#ffd4f7] dark:bg-blue-500 
                  text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300"
              >
                Flip
              </button>
              <button
                className="flex-1 py-2 rounded-[30px] bg-[#ffd4f7] dark:bg-blue-500 
                  text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
          <div className="w-full h-full bg-[#98f5e1] dark:bg-gray-800 rounded-[20px] p-6 flex flex-col justify-between transition-colors duration-300">
            <div>
              <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-100">Answer:</h4>
              <p className="text-gray-800 dark:text-gray-200 min-h-[100px]">{answer}</p>
            </div>
            <div className="flex gap-[19px]">
              <button
                onClick={() => setIsFlipped(false)}
                className="flex-1 py-2 rounded-[30px] bg-[#ffd4f7] dark:bg-blue-500 
                  text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300"
              >
                Flip
              </button>
              <button
                className="flex-1 py-2 rounded-[30px] bg-[#ffd4f7] dark:bg-blue-500 
                  text-gray-800 dark:text-white hover:opacity-90 transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

FlashCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
}

export default FlashCard

