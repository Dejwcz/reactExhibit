import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./screens/Home";

import Navbar from "./components/NavBar";

const Fish = lazy(() => import("./screens/Fish"));
const ScreenTwo = lazy(() => import("./screens/ScreenTwo"));
const FormPractice = lazy(() => import("./screens/FormExScreen"));

function App() {
  return (
    <div className="container">
      <Router basename="/ReactProject">
        <Navbar />
        <AnimatePresence mode="wait">
          <Suspense fallback={<h1>Loading...</h1>}>
            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/Fish" element={<Fish />} />
              <Route path="/ScreenTwo" element={<ScreenTwo />} />
              <Route path="/FormExScreen" element={<FormPractice />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;
