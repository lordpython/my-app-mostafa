import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  className?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({ text, className = "" }) => {
  return (
    <motion.div
      className={`typing-text ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="animate-typing">
        {text}
      </span>
    </motion.div>
  );
};
