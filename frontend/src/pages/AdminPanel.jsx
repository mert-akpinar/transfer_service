import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const ITEMS_PER_PAGE = 20;

export default function AdminPanel({ token, onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [rates, setRates] = useState({});
  const [savingRates, setSavingRates] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetch("http://localhost/transfer_service/backend/routes/get-rates.php")
      .then((res) => res.json())
      .then((data) => setRates(data))
      .catch(() => showNotification("Kur bilgileri alınamadı", "error"));
  }, []);

  const handleRateChange = (currency, value) => {
    setRates({ ...rates, [currency]: value });
  };

  const saveRates = () => {
    setSavingRates(true);
    fetch("http://localhost/transfer_service/backend/routes/save-rates.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rates)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showNotification("Kur bilgileri güncellendi!", "success");
        } else {
          showNotification("Hata: Kur bilgileri kaydedilemedi.", "error");
        }
      })
      .catch(() => showNotification("Sunucu hatası", "error"))
      .finally(() => setSavingRates(false));
  };

  useEffect(() => {
    fetch(`http://localhost/transfer_service/backend/routes/admin.php?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          const reversed = [...data].reverse();
          setReservations(reversed);
          setFiltered(reversed);
        }
      })
      .catch(() => setError("Sunucuya bağlanılamadı"));
  }, [token]);

  useEffect(() => {
    const term = search.toLowerCase();
    const results = reservations.filter((r) =>
      [
        r.name, r.email, r.phone, r.selected_car?.name, r.selected_car?.price,
        r.pickup, r.dropoff, r.from, r.to, r.date, r.time,
        r.adults, r.children, r.currency,
        (r.extras || []).join(", "), r.note, r.status, r.createdAt,
      ]
        .map((v) => String(v || "").toLowerCase())
        .some((val) => val.includes(term))
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, reservations]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rezervasyonlar");
    XLSX.writeFile(workbook, "rezervasyonlar.xlsx");
  };

  pdfMake.vfs = pdfFonts.vfs;

  const exportToPDF = () => {
    const tableBody = [
      [
        "#", "Ad", "Email", "Telefon", "Araç", "Fiyat",
        "Pickup", "Dropoff", "Alış", "Varış", "Tarih", "Saat",
        "Yetişkin", "Çocuk", "Para", "Ekstralar", "Not"
      ],
      ...filtered.map((r, i) => [
        i + 1,
        r?.name || "-",
        r?.email || "-",
        r?.phone || "-",
        r?.selected_car?.name || "-",
        r?.selected_car?.price != null ? String(r.selected_car.price) : "-",
        r?.pickup || "-",
        r?.dropoff || "-",
        r?.from || "-",
        r?.to || "-",
        r?.date || "-",
        r?.time || "-",
        r?.adults != null ? String(r.adults) : "-",
        r?.children != null ? String(r.children) : "-",
        r?.currency || "-",
        Array.isArray(r?.extras) ? r.extras.join(", ") : (r.extras || "-"),
        r?.note || "-"
      ])
    ];

    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      content: [
        { text: "Rezervasyonlar", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [
              '3%', '8%', '10%', '8%', '8%', '5%', '6%', '6%', '6%',
              '6%', '5%', '5%', '4%', '4%', '4%', '7%', '5%'
            ],
            body: tableBody
          },
          fontSize: 8
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };

    pdfMake.createPdf(docDefinition).download("rezervasyonlar.pdf");
  };

  const updateStatus = (index, status) => {
    fetch("http://localhost/transfer_service/backend/routes/update-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updated = [...reservations];
          updated[index].status = status;
          setReservations(updated);
          setFiltered(updated);
          showNotification(`Durum güncellendi: ${status}`, "success");
        } else {
          showNotification("Durum güncellenemedi", "error");
        }
      })
      .catch(() => showNotification("Sunucu hatası", "error"));
  };

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="dashboard">
      <main className="main-content">
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <header className="topbar">
          <h1>Rezervasyonlar ({filtered.length})</h1>
        </header>

        <section className="stats">
          {["USD", "GBP", "RUB", "TRY"].map((currency) => (
            <div className="stat-card" key={currency}>
              <h3>{currency}</h3>
              <input
                type="number"
                step="0.01"
                value={rates[currency] || ""}
                onChange={(e) => handleRateChange(currency, parseFloat(e.target.value))}
                className="rate-input"
              />
            </div>
          ))}
          <button onClick={saveRates} className="save-button">
            {savingRates ? "Kaydediliyor..." : "Kurları Kaydet"}
          </button>
        </section>

        <section className="filters">
          <div className="search-export-wrapper">
            <input
              type="text"
              placeholder="Filtreleme"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={exportToExcel} className="export-button">Excel'e Aktar</button>
            <button onClick={exportToPDF} className="export-button">PDF'e Aktar</button>
          </div>
        </section>

        <section className="table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>⋮</th>
                <th>#</th>
                <th>Ad</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Araç</th>
                <th>Fiyat</th>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Alış</th>
                <th>Varış</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Yetişkin</th>
                <th>Çocuk</th>
                <th>Para</th>
                <th>Ekstralar</th>
                <th>Not</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((r, index) => (
                <tr key={index} className={`status-${(r.status || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "") // Türkçe karakterleri kaldır
  .replace(/[^\w\s-]/g, "") // Özel karakterleri sil
  .replaceAll(" ", "-")}`}>
                  <td>
                    <div className="dropdown">
                      <button className="dropdown-toggle">⋮</button>
                      <div className="dropdown-menu">
                        <button onClick={() => updateStatus((currentPage - 1) * ITEMS_PER_PAGE + index, "Rezervasyon Gerçekleşti")}>Rezervasyon Gerçekleşti</button>
                        <button onClick={() => updateStatus((currentPage - 1) * ITEMS_PER_PAGE + index, "Rezervasyon İptal Edildi")}>Rezervasyon İptal Edildi</button>
                        <button onClick={() => updateStatus((currentPage - 1) * ITEMS_PER_PAGE + index, "Rezervasyon Beklemede")}>Rezervasyon Beklemede</button>
                      </div>
                    </div>
                  </td>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.selected_car?.name || "-"}</td>
                  <td>{r.selected_car?.price || "-"}</td>
                  <td>{r.pickup}</td>
                  <td>{r.dropoff}</td>
                  <td>{r.from}</td>
                  <td>{r.to}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.adults}</td>
                  <td>{r.children}</td>
                  <td>{r.currency}</td>
                  <td>{(r.extras || []).join(", ") || "-"}</td>
                  <td>{r.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}