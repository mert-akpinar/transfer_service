import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CarList from "./pages/CarList";
import ReservationForm from "./pages/ReservationForm";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

// iFrame Yüksekliğini Ana Siteye Gönderen Bileşen
function HeightUpdater() {
  const location = useLocation();

  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'setHeight', height }, '*');
    };

    // Yükseklik ölçümünü birden fazla kez tetikle (gecikmeli yüklemeleri yakalamak için)
    const scheduleHeightUpdates = () => {
      sendHeight(); // hemen gönder
      setTimeout(sendHeight, 200); // 200ms sonra tekrar
      setTimeout(sendHeight, 600); // 600ms sonra tekrar
      requestAnimationFrame(sendHeight); // render sonrası tekrar
    };

    scheduleHeightUpdates(); // İlk yükleme

    const observer = new MutationObserver(scheduleHeightUpdates);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', scheduleHeightUpdates);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleHeightUpdates);
    };
  }, [location]);

  return null;
}

function App() {
  const [formData, setFormData] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  return (
    <Router>
      <HeightUpdater />
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