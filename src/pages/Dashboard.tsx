import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Internships</h3>
          <p className="text-gray-600 mb-4">Manage your internship applications</p>
          <Link
            to="/internships"
            className="text-blue-600 hover:text-blue-800"
          >
            View All →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Add Internship</h3>
          <p className="text-gray-600 mb-4">Post a new internship opportunity</p>
          <Link
            to="/internships/create"
            className="text-blue-600 hover:text-blue-800"
          >
            Create New →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-600 mb-4">Update your profile information</p>
          <span className="text-gray-400">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;