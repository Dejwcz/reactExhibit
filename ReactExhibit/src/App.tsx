import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { ThemeProvider } from "./context/ThemeContext";

const Fish = lazy(() => import("./screens/Fish"));
const ScreenTwo = lazy(() => import("./screens/ScreenTwo"));
const FormExScreen = lazy(() => import("./screens/FormExScreen"));
const Pomodoro = lazy(() => import("./screens/Pomodoro"));
const Kanban = lazy(() => import("./screens/Kanban"));
const MarkdownEditor = lazy(() => import("./screens/MarkdownEditor"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="" element={<Home />} />
          <Route path="/Fish" element={<Fish />} />
          <Route path="/ScreenTwo" element={<ScreenTwo />} />
          <Route path="/FormExScreen" element={<FormExScreen />} />
          <Route path="/Pomodoro" element={<Pomodoro />} />
          <Route path="/Kanban" element={<Kanban />} />
          <Route path="/Markdown" element={<MarkdownEditor />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router basename="/ReactProject">
        <div className="min-h-screen transition-colors duration-300">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
