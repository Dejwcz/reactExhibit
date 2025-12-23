const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-neon-purple animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-neon-cyan animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
