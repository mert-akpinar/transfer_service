import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function CarList({ formData, onCarSelect }) {
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState({});
  const navigate = useNavigate(); // ← Geri butonu için

  useEffect(() => {
    const fetchCars = async () => {
      const params = new URLSearchParams(formData).toString();
      const res = await fetch(`http://localhost/transfer_service/backend/routes/cars.php?${params}`);
      const data = await res.json();
      setCars(data);
    };
    fetchCars();
  }, [formData]);

  const handlePrev = (index) => {
    setCurrentIndex((prev) => ({
      ...prev,
      [index]: (prev[index] ?? 0) === 0
        ? cars[index].images.length - 1
        : prev[index] - 1,
    }));
  };

  const handleNext = (index) => {
    setCurrentIndex((prev) => ({
      ...prev,
      [index]: (prev[index] ?? 0) === cars[index].images.length - 1
        ? 0
        : prev[index] + 1,
    }));
  };

  return (
    <div className="luxury-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Geri</button>
      <h2 className="luxury-title">Lütfen Sizin İçin Uygun Aracı Seçin</h2>

      {cars.map((car, index) => {
        const imageIndex = currentIndex[index] ?? 0;
        return (
          <div className="luxury-card" key={car.id}>
            <div className="luxury-header">{car.name}</div>
            <div className="luxury-body">
              <div className="luxury-left">
                <div className="luxury-slider">
                  <button onClick={() => handlePrev(index)} className="slider-btn">‹</button>
                  <img src={car.images[imageIndex]} alt={car.name} className="luxury-image" />
                  <button onClick={() => handleNext(index)} className="slider-btn">›</button>
                </div>
              </div>
              <div className="luxury-right">
                <h4>Dâhil Olan Hizmetler</h4>
                <ul>
                  {car.services?.map((service, idx) => (
                    <li key={idx}>✓ {service}</li>
                  ))}
                </ul>
                <div className="price-section">
                  <label>
                    <input type="radio" name={`tripType-${car.id}`} defaultChecked />
                    Tek Yön
                  </label>
                  <span className="price-box">{car.price_eur} €</span>

                  <label>
                    <input type="radio" name={`tripType-${car.id}`} />
                    Gidiş - Dönüş
                  </label>
                  <span className="price-box">{car.price_eur * 2} €</span>
                </div>
                <div className="note">* Toplam araç fiyatıdır, kişi başı değildir.</div>
                <button className="reserve-btn" onClick={() => onCarSelect(car)}>✓ REZERVASYON</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
