import { useEffect, useState } from "react";
import axios from "axios";

export default function CarList({ formData, onSelectCar }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const { from, to } = formData;

  useEffect(() => {
    if (!from || !to) return;

    const fetchCars = async () => {
      try {
        const res = await axios.get(
          `http://localhost/transfer_service/backend/routes/cars.php?from=${from}&to=${to}`
        );
        setCars(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Araçlar alınamadı:", err);
        setLoading(false);
      }
    };

    fetchCars();
  }, [from, to]);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Mevcut Araçlar ({cars.length})</h2>
      {cars.map((car) => (
        <div key={car.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h3>{car.name}</h3>
          <p>Fiyat (EUR): €{car.price_eur}</p>
          <p>Mesafe: {car.distance_km} km</p>
          <button onClick={() => onSelectCar(car)}>Bu aracı seç</button>
        </div>
      ))}
    </div>
  );
}