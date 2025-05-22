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
  const [complete, setComplete] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  const handleNext = (data) => setFormData(data);
  const handleCarSelect = (car) => setSelectedCar(car);
  const handleComplete = () => {
    setComplete(true);
    setFormData(null);
    setSelectedCar(null);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Kullanıcı ana sayfası */}
        <Route path="/" element={
          <div className="page-center">
            {!formData ? (
              <Home onNext={handleNext} />
            ) : !selectedCar ? (
              <CarList formData={formData} onCarSelect={handleCarSelect} />
            ) : !complete ? (
              <ReservationForm
                formData={formData}
                selectedCar={selectedCar}
                onComplete={handleComplete}
              />
            ) : (
              <p style={{
                fontSize: "20px",
                textAlign: "center",
                backgroundColor: "#fff",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
              }}>
                Teşekkürler! Rezervasyon alındı.
              </p>
            )}
          </div>
        } />

        {/* Admin paneli */}
        <Route path="/admin" element={
          <div className="container">
            <h1>Admin Panel</h1>
            {!adminToken ? (
              <AdminLogin onLogin={setAdminToken} />
            ) : (
              <AdminPanel token={adminToken} onLogout={handleAdminLogout} />
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;