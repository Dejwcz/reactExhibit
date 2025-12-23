import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TransitionWrapperProps {
  children: ReactNode;
}

const TransitionWrapper = ({ children }: TransitionWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionWrapper;
