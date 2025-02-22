"use client"

import { motion } from "framer-motion"
import PropTypes from "prop-types"

export default function FeatureCard({ Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-full bg-[#98f5e1] dark:bg-gray-800 rounded-lg p-6 
        flex flex-col items-center justify-center transition-colors duration-300"
    >
      <div className="rounded-full bg-[#ffffff] dark:bg-blue-500 p-3 mb-4">
        <Icon className="w-6 h-6 text-gray-800 dark:text-white" />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </motion.div>
  )
}

FeatureCard.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

