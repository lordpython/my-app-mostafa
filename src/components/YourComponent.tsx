import * as React from "react"
import { motion } from "framer-motion"

interface ComponentProps {
  // Add your props here
}

const YourComponent: React.FC<ComponentProps> = () => {
  return (
    <motion.div
      className="relative forced-colors-adjust-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Your component content */}
    </motion.div>
  )
}

export default YourComponent
