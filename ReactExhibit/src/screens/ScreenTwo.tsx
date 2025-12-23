import { useState } from "react";
import { motion } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

const ScreenTwo = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <TransitionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Animation</span> Showcase
          </h1>
          <p className="text-white/60">Interactive Framer Motion demos</p>
        </div>

        {/* Play/Pause Toggle */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-glass flex items-center gap-2"
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause Animations
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Animations
              </>
            )}
          </button>
        </div>

        {/* Animation Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Floating Box */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-center">Float & Glow</h3>
            <div className="flex justify-center py-8">
              <motion.div
                animate={isPlaying ? {
                  y: [0, -20, 0],
                  boxShadow: [
                    "0 0 20px rgba(131, 56, 236, 0.3)",
                    "0 0 40px rgba(131, 56, 236, 0.6)",
                    "0 0 20px rgba(131, 56, 236, 0.3)",
                  ],
                } : {}}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-cyan flex items-center justify-center cursor-pointer"
              >
                <span className="text-3xl">✨</span>
              </motion.div>
            </div>
          </div>

          {/* Rotating Shapes */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-center">Orbit</h3>
            <div className="flex justify-center py-8">
              <div className="relative w-32 h-32">
                {/* Center */}
                <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-neon-cyan" />
                {/* Orbiting elements */}
                {[0, 120, 240].map((degree, i) => (
                  <motion.div
                    key={`${degree}-${isPlaying}`}
                    initial={{ rotate: degree }}
                    animate={{ rotate: isPlaying ? degree + 360 : degree }}
                    transition={{
                      duration: 4 + i,
                      ease: "linear",
                      repeat: isPlaying ? Infinity : 0,
                    }}
                    className="absolute inset-0"
                  >
                    <div
                      className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${
                        i === 0 ? "bg-neon-pink" : i === 1 ? "bg-neon-purple" : "bg-neon-cyan"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scale Pulse */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-center">Pulse</h3>
            <div className="flex justify-center py-8">
              <motion.div
                animate={isPlaying ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                } : {}}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                whileHover={{ scale: 1.3 }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple cursor-pointer"
              />
            </div>
          </div>

          {/* Morphing Shape */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-center">Morph</h3>
            <div className="flex justify-center py-8">
              <motion.div
                animate={isPlaying ? {
                  borderRadius: ["20%", "50%", "30%", "50%", "20%"],
                  rotate: [0, 90, 180, 270, 360],
                } : {}}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                whileHover={{ scale: 1.2 }}
                className="w-24 h-24 bg-gradient-to-br from-neon-cyan to-neon-purple cursor-pointer"
              />
            </div>
          </div>

          {/* Stagger Cards */}
          <div className="glass-card md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-center">Stagger Animation</h3>
            <p className="text-white/60 text-center text-sm mb-6">Hover over the cards</p>
            <motion.div
              className="flex justify-center gap-4 flex-wrap"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={{
                hover: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {[
                { color: "from-neon-pink to-neon-purple", icon: "🚀" },
                { color: "from-neon-purple to-neon-cyan", icon: "💎" },
                { color: "from-neon-cyan to-blue-500", icon: "⚡" },
                { color: "from-blue-500 to-neon-pink", icon: "🔥" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hover: { y: -10, scale: 1.05 },
                  }}
                  whileHover={{ y: -15, scale: 1.1 }}
                  className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl cursor-pointer transition-shadow hover:shadow-neon-purple`}
                >
                  {item.icon}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Interactive Drag */}
          <div className="glass-card md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-center">Drag Me!</h3>
            <div className="relative h-32 rounded-xl bg-white/5 overflow-hidden">
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.2}
                whileDrag={{ scale: 1.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default ScreenTwo;
