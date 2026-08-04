import AboutUs from "../components/AboutUs";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Home
        </Link>
        <AboutUs />
      </div>
    </div>
  );
}
