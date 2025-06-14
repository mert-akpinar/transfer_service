<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(200);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/response.php';

$data = json_decode(file_get_contents('php://input'), true);

file_put_contents(__DIR__ . '/../log.txt', print_r($data, true));

// Temel alan kontrolleri
if (
    !$data || 
    !isset($data['name']) || 
    !isset($data['email']) || 
    !isset($data['phone']) ||
    !isset($data['pickup']) ||
    !isset($data['dropoff']) ||
    !isset($data['date']) ||
    !isset($data['time']) ||
    !isset($data['selected_car'])
) {
    sendResponse(['error' => 'Eksik veya geçersiz veri'], 400);
}

// reservations.json dosyasını yükle
$file = __DIR__ . '/../data/reservations.json';
$reservations = [];

if (file_exists($file)) {
    $reservations = json_decode(file_get_contents($file), true);
}

// En büyük id'yi bul ve 1 artır
$maxId = 0;
foreach ($reservations as $reservation) {
    if (isset($reservation['id']) && $reservation['id'] > $maxId) {
        $maxId = $reservation['id'];
    }
}

$data['id'] = $maxId + 1;

// Yeni rezervasyonu ekle
$reservations[] = $data;

// JSON dosyasını güncelle
file_put_contents($file, json_encode($reservations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

sendResponse(['success' => true, 'id' => $data['id']]);