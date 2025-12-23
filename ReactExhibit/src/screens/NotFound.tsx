import { Link } from "react-router-dom";
import TransitionWrapper from "../components/TransitionWrapper";

const NotFound = () => {
  return (
    <TransitionWrapper>
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-white/60 mb-8">
          The page you’re looking for doesn’t exist (or it was moved).
        </p>
        <Link to="/" className="btn-neon inline-flex items-center justify-center">
          Go home
        </Link>
      </div>
    </TransitionWrapper>
  );
};

export default NotFound;
