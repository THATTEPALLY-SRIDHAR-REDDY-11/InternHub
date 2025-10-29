import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Internships from "./pages/Internships";
import CreateInternship from "./pages/CreateInternship";

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">InternHub</h1>
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/create" element={<CreateInternship />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;