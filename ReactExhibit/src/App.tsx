import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { ThemeProvider } from "./context/ThemeContext";
import { applyPageMeta } from "./seo";

const Fish = lazy(() => import("./screens/Fish"));
const ScreenTwo = lazy(() => import("./screens/ScreenTwo"));
const FormExScreen = lazy(() => import("./screens/FormExScreen"));
const Pomodoro = lazy(() => import("./screens/Pomodoro"));
const Kanban = lazy(() => import("./screens/Kanban"));
const MarkdownEditor = lazy(() => import("./screens/MarkdownEditor"));
const NotFound = lazy(() => import("./screens/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = useState("");

  useEffect(() => {
    const meta = applyPageMeta(location.pathname);
    setRouteAnnouncement(meta.title);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {routeAnnouncement}
      </div>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/Fish" element={<Fish />} />
          <Route path="/ScreenTwo" element={<ScreenTwo />} />
          <Route path="/FormExScreen" element={<FormExScreen />} />
          <Route path="/Pomodoro" element={<Pomodoro />} />
          <Route path="/Kanban" element={<Kanban />} />
          <Route path="/Markdown" element={<MarkdownEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <ThemeProvider>
      <Router basename={routerBasename}>
        <div className="min-h-screen transition-colors duration-300">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-dark-bg-300 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-neon-cyan"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-8">
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
