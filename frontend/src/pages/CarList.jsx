import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locations from "../data/locations";
import "../App.css";

export default function CarList({ formData, onCarSelect }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [distance, setDistance] = useState(0); // km
  
  useEffect(() => {
    fetch("http://localhost/transfer_service/backend/data/rates.json")
      .then(res => res.json())
      .then(data => setExchangeRates(data))
      .catch(() => setExchangeRates({ EUR: 1 }));
  }, []);

  useEffect(() => {
    if (formData?.from && formData?.to && window.google) {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [formData.from],
          destinations: [formData.to],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const distanceText = response.rows[0].elements[0].distance.text;
            const km = parseFloat(distanceText.replace(",", ".").replace(" km", ""));
            setDistance(km);
          }
        }
      );
    }
  }, [formData]);

  const currency = formData?.currency || "EUR";
  const rate = exchangeRates[currency] || 1;

  const pricePerKmEUR = {
    1: 0.6,
    2: 0.75,
    3: 1.5,
    4: 0.9,
    5: 1.1,
    6: 1.3,
    7: 1.6,
  };

  const getDynamicPrice = (carId, multiplier = 1) => {
    const basePrice = distance * (pricePerKmEUR[carId] || 0);
    return Math.round(basePrice * rate * multiplier);
  };

  const cars = [
    { id: 1, name: "Standart Vip", images: Array.from({ length: 4 }, (_, i) => `/images/cars/standartvip/standartvip_${i + 1}.PNG`), services: ["WiFi", "İçecek", "Derin Temizlik"] },
    { id: 2, name: "Premium Vip", images: Array.from({ length: 4 }, (_, i) => `/images/cars/premiumvip/premiumvip_${i + 1}.PNG`), services: ["WiFi", "İçecek", "Yatabilir Koltuklar", "TV"] },
    { id: 3, name: "Maybach Class", images: Array.from({ length: 4 }, (_, i) => `/images/cars/maybachclass/maybachclass_${i + 1}.PNG`), services: ["VIP Hizmet", "Sürücü", "Özel Tasarım", "Mini Bar"] },
    { id: 4, name: "Sprinter 10 kişilik", images: Array.from({ length: 4 }, (_, i) => `/images/cars/sprinter10kisilik/sprinter10kisilik_${i + 1}.PNG`), services: ["10 Kişilik", "Konforlu Oturma", "Klima"] },
    { id: 5, name: "Sprinter 14 kişilik", images: Array.from({ length: 4 }, (_, i) => `/images/cars/sprinter14kisilik/sprinter14kisilik_${i + 1}.PNG`), services: ["14 Kişilik", "USB Şarj", "Geniş Alan"] },
    { id: 6, name: "E Class", images: Array.from({ length: 4 }, (_, i) => `/images/cars/eclass/eclass_${i + 1}.PNG`), services: ["Konfor", "Sürücü Dahil", "Otomatik Kapı"] },
    { id: 7, name: "S Class", images: Array.from({ length: 4 }, (_, i) => `/images/cars/sclass/sclass_${i + 1}.PNG`), services: ["Prestij", "VIP", "Ses Yalıtımı"] },
  ];

  const handleNext = (index) => {
    const images = cars[index]?.images || [];
    setCurrentIndex((prev) => {
      const next = (prev[index] ?? 0) + 1;
      return { ...prev, [index]: next >= images.length ? 0 : next };
    });
  };

  const handlePrev = (index) => {
    const images = cars[index]?.images || [];
    setCurrentIndex((prev) => {
      const prevIndex = prev[index] ?? 0;
      return { ...prev, [index]: prevIndex === 0 ? images.length - 1 : prevIndex - 1 };
    });
  };

  const handleSelect = (car) => {
  const price = getDynamicPrice(car.id); // Aracın fiyatı hesaplanır
  const selectedCarData = { ...car, price }; // Fiyat bilgisi eklenir
  onCarSelect(selectedCarData); // ReservationForm'a gönderilir
  navigate("/reservation");
};

  const fromLabel = locations.find(l => l.value === formData?.from)?.label || formData?.from;
  const toLabel = locations.find(l => l.value === formData?.to)?.label || formData?.to;

  return (
    <div className="carlist-page-wrapper">
      <div className="carlist-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Geri</button>
        <h2 className="luxury-title">Lütfen Sizin İçin Uygun Aracı Seçin</h2>
        <div className="route-display">{fromLabel} → {toLabel}</div>
      </div>

      <div className="luxury-container">
        {cars.map((car, index) => {
          const imageIndex = currentIndex[index] ?? 0;
          const imageSrc = car.images?.[imageIndex] || "";

          return (
            <div className="luxury-card" key={car.id}>
              <div className="luxury-header">{car.name}</div>
              <div className="luxury-body">
                <div className="luxury-left">
                  <div className="luxury-slider">
                    <button onClick={() => handlePrev(index)} className="slider-btn">‹</button>
                    <img src={imageSrc} alt={car.name} className="luxury-image" />
                    <button onClick={() => handleNext(index)} className="slider-btn">›</button>
                  </div>
                </div>

                <div className="luxury-right">
                  <h4>Dâhil Olan Hizmetler</h4>
                  <div className="services-inline">
                    {car.services.map((s, idx) => (
                      <span className="service-pill" key={idx}>✓ {s}</span>
                    ))}
                  </div>

                  <div className="price-section">
                    <label className="trip-option">
                      <input type="radio" name={`tripType-${car.id}`} defaultChecked />
                      <span>Tek Yön</span>
                      <span className="price-box">
                        {getDynamicPrice(car.id)} {currency}
                      </span>
                    </label>
                    <label className="trip-option">
                      <input type="radio" name={`tripType-${car.id}`} />
                      <span>Gidiş Dönüş</span>
                      <span className="price-box">
                        {getDynamicPrice(car.id, 2)} {currency}
                      </span>
                    </label>
                  </div>

                  <div className="note">* Toplam araç fiyatıdır, kişi başı değildir.</div>
                  <button className="reserve-btn" onClick={() => handleSelect(car)}>✓ REZERVASYON</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}