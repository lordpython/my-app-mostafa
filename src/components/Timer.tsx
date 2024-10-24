import React, { useEffect } from "react"
import { motion } from "framer-motion"

interface TimerProps {
  timeLeft: number
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  // Calculate percentage for progress bar
  const percentage = (timeLeft / 60) * 100;
  
  // Determine color based on time left
  const getColor = () => {
    if (timeLeft > 30) return "bg-green-500";
    if (timeLeft > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="relative w-32">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-white">الوقت المتبقي</span>
        <span className="text-sm font-medium text-white">{timeLeft}s</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <motion.div
          className={`h-2.5 rounded-full ${getColor()}`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
