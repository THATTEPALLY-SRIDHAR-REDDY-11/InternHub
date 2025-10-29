import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to InternHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your comprehensive platform for internship management and career development
        </p>
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/internships"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            View Internships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;