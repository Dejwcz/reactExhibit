import "./AwesomeBox.css";
import { motion } from "framer-motion";

const AwesomeBox = () => {
  return (
    <motion.div
      initial={{ opacity: 0.3, y: 100, scale: 0.8 }} // Jemný fade-in a přiblížení
      animate={{
        opacity: 1,
        y: [0, -15, 0], // Jemné levitování nahoru-dolů
        scale: 1,
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
      whileHover={{
        scale: 1.2,
        rotate: 20, // Mírná rotace na hover
        transition: { duration: 0.3 },
      }}
      className="awesome-box"
    >
      🚀 Animation
    </motion.div>
  );
};

export default AwesomeBox;
