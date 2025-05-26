import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import CarList from "./pages/CarList";
import ReservationForm from "./pages/ReservationForm";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [formData, setFormData] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onNext={setFormData} />} />
        <Route path="/cars" element={<CarList formData={formData} onCarSelect={setSelectedCar} />} />
        <Route path="/reservation" element={<ReservationForm formData={formData} selectedCar={selectedCar} />} />
        <Route path="/admin" element={
          <div className="container">
            {!adminToken ? (
              <AdminLogin onLogin={setAdminToken} />
            ) : (
              <AdminPanel token={adminToken} onLogout={() => setAdminToken(null)} />
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;