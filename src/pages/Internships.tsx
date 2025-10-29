import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  duration: string;
  applicationDeadline: string;
}

const Internships = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://internhub-backend-rnzq.onrender.com';
      const response = await fetch(`${API_URL}/api/internships`);
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading internships...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
        <Link
          to="/internships/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post Internship
        </Link>
      </div>

      <div className="grid gap-6">
        {internships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No internships found</p>
            <Link
              to="/internships/create"
              className="text-blue-600 hover:text-blue-800"
            >
              Post the first internship →
            </Link>
          </div>
        ) : (
          internships.map((internship) => (
            <div key={internship._id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{internship.title}</h3>
              <p className="text-gray-600 mb-2">{internship.company} • {internship.location}</p>
              <p className="text-gray-700 mb-4">{internship.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Duration: {internship.duration}</span>
                <span>Salary: {internship.salary}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Internships;