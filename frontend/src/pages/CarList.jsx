import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function CarList({ formData, onCarSelect }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});

  // Kur verisini backend'den çek
  useEffect(() => {
    fetch("http://localhost/transfer_service/backend/data/rates.json")
      .then(res => res.json())
      .then(data => setExchangeRates(data))
      .catch(() => setExchangeRates({ EUR: 1 }));
  }, []);

  const currency = formData?.currency || "EUR";
  const rate = exchangeRates[currency] || 1;

  const getConvertedPrice = (eur) => Math.round(eur * rate);

  const cars = [
    {
      id: 1,
      name: "Standart Vip",
      price_eur: 60,
      images: Array.from({ length: 5 }, (_, i) => `/images/cars/standartvip/standartvip_${i + 1}.PNG`),
      services: ["WiFi", "İçecek", "Derin Temizlik"],
    },
    {
      id: 2,
      name: "Premium Vip",
      price_eur: 75,
      images: Array.from({ length: 11 }, (_, i) => `/images/cars/premiumvip/premiumvip_${i + 1}.PNG`),
      services: ["WiFi", "İçecek", "Yatabilir Koltuklar", "TV"],
    },
    {
      id: 3,
      name: "Maybach Class",
      price_eur: 150,
      images: Array.from({ length: 18 }, (_, i) => `/images/cars/maybachclass/maybachclass_${i + 1}.PNG`),
      services: ["VIP Hizmet", "Sürücü", "Özel Tasarım", "Mini Bar"],
    },
    {
      id: 4,
      name: "Sprinter 10 kişilik",
      price_eur: 90,
      images: Array.from({ length: 6 }, (_, i) => `/images/cars/sprinter10kisilik/sprinter10kisilik_${i + 1}.PNG`),
      services: ["10 Kişilik", "Konforlu Oturma", "Klima"],
    },
    {
      id: 5,
      name: "Sprinter 14 kişilik",
      price_eur: 110,
      images: Array.from({ length: 5 }, (_, i) => `/images/cars/sprinter14kisilik/sprinter14kisilik_${i + 1}.PNG`),
      services: ["14 Kişilik", "USB Şarj", "Geniş Alan"],
    },
    {
      id: 6,
      name: "E Class",
      price_eur: 130,
      images: Array.from({ length: 5 }, (_, i) => `/images/cars/eclass/eclass_${i + 1}.PNG`),
      services: ["Konfor", "Sürücü Dahil", "Otomatik Kapı"],
    },
    {
      id: 7,
      name: "S Class",
      price_eur: 160,
      images: Array.from({ length: 3 }, (_, i) => `/images/cars/sclass/sclass_${i + 1}.PNG`),
      services: ["Prestij", "VIP", "Ses Yalıtımı"],
    },
  ];

  const handleNext = (index) => {
    const images = cars[index]?.images || [];
    setCurrentIndex((prev) => {
      const next = (prev[index] ?? 0) + 1;
      return {
        ...prev,
        [index]: next >= images.length ? 0 : next,
      };
    });
  };

  const handlePrev = (index) => {
    const images = cars[index]?.images || [];
    setCurrentIndex((prev) => {
      const prevIndex = prev[index] ?? 0;
      return {
        ...prev,
        [index]: prevIndex === 0 ? images.length - 1 : prevIndex - 1,
      };
    });
  };

  return (
    <div className="luxury-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Geri</button>
      <h2 className="luxury-title">Lütfen Sizin İçin Uygun Aracı Seçin</h2>

      {cars.map((car, index) => {
        const imageIndex = currentIndex[index] ?? 0;
        const hasImages = car.images && car.images.length > 0;
        const imageSrc = hasImages ? car.images[imageIndex] : "";

        return (
          <div className="luxury-card" key={car.id}>
            <div className="luxury-header">{car.name}</div>
            <div className="luxury-body">
              <div className="luxury-left">
                {hasImages ? (
                  <div className="luxury-slider">
                    <button onClick={() => handlePrev(index)} className="slider-btn">‹</button>
                    <img src={imageSrc} alt={car.name} className="luxury-image" />
                    <button onClick={() => handleNext(index)} className="slider-btn">›</button>
                  </div>
                ) : (
                  <div className="luxury-slider"><p>Görsel bulunamadı.</p></div>
                )}
              </div>

              <div className="luxury-right">
                <h4>Dâhil Olan Hizmetler</h4>
                <div className="services-inline">
                  {car.services?.map((service, idx) => (
                    <span className="service-pill" key={idx}>✓ {service}</span>
                  ))}
                </div>

                <div className="price-section">
                  <label className="trip-option">
                    <input type="radio" name={`tripType-${car.id}`} defaultChecked />
                    <span>Tek Yön</span>
                    <span className="price-box">
                      {getConvertedPrice(car.price_eur)} {currency}
                    </span>
                  </label>

                  <label className="trip-option">
                    <input type="radio" name={`tripType-${car.id}`} />
                    <span>Gidiş Dönüş</span>
                    <span className="price-box">
                      {getConvertedPrice(car.price_eur * 2)} {currency}
                    </span>
                  </label>
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