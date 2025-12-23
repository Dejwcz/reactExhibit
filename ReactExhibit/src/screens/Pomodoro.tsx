import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

type TimerMode = "work" | "shortBreak" | "longBreak";

interface TimerConfig {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const DEFAULT_CONFIG: TimerConfig = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  work: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const MODE_COLORS: Record<TimerMode, string> = {
  work: "neon-pink",
  shortBreak: "neon-cyan",
  longBreak: "neon-purple",
};

const Pomodoro = () => {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_CONFIG.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const saved = localStorage.getItem("pomodoros");
    return saved ? parseInt(saved) : 0;
  });

  const totalTime = DEFAULT_CONFIG[mode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const currentColor = MODE_COLORS[mode];

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Play sounds
  const playSound = useCallback((type: "tick" | "start" | "pause" | "finish") => {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case "tick":
        oscillator.frequency.value = 1000;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case "start":
        oscillator.frequency.value = 600;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        // Second beep
        setTimeout(() => {
          const ctx2 = new AudioContext();
          const osc2 = ctx2.createOscillator();
          const gain2 = ctx2.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx2.destination);
          osc2.frequency.value = 800;
          osc2.type = "sine";
          gain2.gain.setValueAtTime(0.2, ctx2.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx2.currentTime + 0.15);
          osc2.start(ctx2.currentTime);
          osc2.stop(ctx2.currentTime + 0.15);
        }, 150);
        break;
      case "pause":
        oscillator.frequency.value = 400;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case "finish":
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
    }
  }, []);

  // Show notification
  const showNotification = useCallback((title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/vite.svg" });
    }
    playSound("finish");
  }, [playSound]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Tick sound for last 3 seconds
  useEffect(() => {
    if (isRunning && timeLeft > 0 && timeLeft <= 3) {
      playSound("tick");
    }
  }, [timeLeft, isRunning, playSound]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      if (mode === "work") {
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        localStorage.setItem("pomodoros", newCount.toString());
        showNotification("Pomodoro Complete!", "Time for a break.");

        // Auto switch to break
        if (newCount % 4 === 0) {
          setMode("longBreak");
          setTimeLeft(DEFAULT_CONFIG.longBreak);
        } else {
          setMode("shortBreak");
          setTimeLeft(DEFAULT_CONFIG.shortBreak);
        }
      } else {
        showNotification("Break Over!", "Ready to focus?");
        setMode("work");
        setTimeLeft(DEFAULT_CONFIG.work);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, completedPomodoros, showNotification]);

  // Handle mode change
  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(DEFAULT_CONFIG[newMode]);
    setIsRunning(false);
  };

  // Toggle start/pause
  const handleToggle = () => {
    if (isRunning) {
      playSound("pause");
    } else {
      playSound("start");
    }
    setIsRunning(!isRunning);
  };

  // Reset timer
  const handleReset = () => {
    setTimeLeft(DEFAULT_CONFIG[mode]);
    setIsRunning(false);
  };

  // Reset stats
  const handleResetStats = () => {
    setCompletedPomodoros(0);
    localStorage.setItem("pomodoros", "0");
  };

  // Calculate circle properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <TransitionWrapper>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Pomodoro</span> Timer
          </h1>
          <p className="text-white/60">Stay focused, take breaks, be productive</p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-300
                ${mode === m
                  ? `bg-${MODE_COLORS[m]}/20 border border-${MODE_COLORS[m]}/50 text-${MODE_COLORS[m]}`
                  : "glass opacity-60 hover:opacity-100"
                }
              `}
              style={mode === m ? {
                backgroundColor: `var(--color-${MODE_COLORS[m]})20`,
                borderColor: `var(--color-${MODE_COLORS[m]})`,
                color: `var(--color-${MODE_COLORS[m]})`
              } : {}}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="glass-card mb-8">
          <div className="flex flex-col items-center py-8">
            {/* Circular Progress */}
            <div className="relative mb-8">
              <svg width="280" height="280" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="opacity-10"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke={`var(--color-${currentColor})`}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    filter: `drop-shadow(0 0 10px var(--color-${currentColor}))`
                  }}
                />
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-white/60 mt-2">{MODE_LABELS[mode]}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className="btn-neon px-8 py-4 text-lg flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {timeLeft === DEFAULT_CONFIG[mode] ? "Start" : "Resume"}
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="btn-glass px-6 py-4"
                aria-label="Reset timer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card text-center">
            <div className="text-4xl font-bold text-gradient mb-2">
              {completedPomodoros}
            </div>
            <div className="text-white/60 text-sm">Pomodoros Today</div>
            <div className="text-white/40 text-xs mt-1">
              ~{Math.round(completedPomodoros * 25 / 60 * 10) / 10} hours focused
            </div>
          </div>

          <div className="glass-card text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: `var(--color-${currentColor})` }}>
              {Math.ceil(timeLeft / 60)}
            </div>
            <div className="text-white/60 text-sm">Minutes Left</div>
            <div className="text-white/40 text-xs mt-1">
              {mode === "work" ? "Stay focused!" : "Relax & recharge"}
            </div>
          </div>
        </div>

        {/* Reset Stats Button */}
        {completedPomodoros > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <button
              onClick={handleResetStats}
              className="text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              Reset statistics
            </button>
          </motion.div>
        )}

        {/* Info */}
        <div className="mt-8 glass-card">
          <h3 className="font-semibold mb-3">How it works</h3>
          <ul className="text-white/60 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-neon-pink">1.</span>
              Work for 25 minutes with full concentration
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-cyan">2.</span>
              Take a 5-minute break to rest your mind
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-purple">3.</span>
              After 4 pomodoros, take a longer 15-minute break
            </li>
          </ul>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default Pomodoro;
