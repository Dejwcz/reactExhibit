import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

const features = [
  {
    title: "Pomodoro Timer",
    description: "Stay focused with the Pomodoro technique. Track your productivity sessions.",
    path: "/Pomodoro",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-neon-pink to-red-500",
  },
  {
    title: "Kanban Board",
    description: "Organize tasks with drag & drop. Move items between columns seamlessly.",
    path: "/Kanban",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
    gradient: "from-neon-purple to-neon-pink",
  },
  {
    title: "Markdown Editor",
    description: "Write and preview markdown in real-time. Export to HTML or copy to clipboard.",
    path: "/Markdown",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    gradient: "from-green-500 to-teal-400",
  },
  {
    title: "Aquarium Planner",
    description: "Plan your perfect aquarium with smart fish management and volume calculations.",
    path: "/Fish",
    icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Service Order",
    description: "Interactive form demo with real-time calculations and dynamic inputs.",
    path: "/FormExScreen",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    gradient: "from-neon-pink to-neon-purple",
  },
  {
    title: "Animations",
    description: "Explore smooth Framer Motion animations and interactive hover effects.",
    path: "/ScreenTwo",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
    gradient: "from-neon-purple to-neon-cyan",
  },
];

const Home = () => {
  return (
    <TransitionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">React</span>
            <span className="text-white">Exhibit</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            A showcase of modern React features, beautiful glassmorphism design,
            and smooth animations built with Vite, TypeScript, and Tailwind CSS.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"].map((tech, i) => (
            <span
              key={tech}
              className="px-4 py-2 glass rounded-full text-sm text-white/80"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Link to={feature.path} className="block group">
                <div className="glass-card h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-[10px] bg-dark-bg-300 flex items-center justify-center">
                      <svg className="w-6 h-6 icon-adaptive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-neon-purple text-sm font-medium group-hover:text-neon-cyan transition-colors">
                    Explore
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Floating Orbs (decorative) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-neon-cyan/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default Home;
