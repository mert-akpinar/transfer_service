<?php
require_once '../db.php';
require_once '../utils/response.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (
    !$data ||
    !isset($data['index']) ||
    !isset($data['status'])
) {
    sendResponse(['error' => 'Geçersiz veri'], 400);
}

$file = __DIR__ . '/../data/reservations.json';

if (!file_exists($file)) {
    sendResponse(['error' => 'Veri bulunamadı'], 404);
}

$reservations = json_decode(file_get_contents($file), true);

if (!isset($reservations[$data['index']])) {
    sendResponse(['error' => 'Rezervasyon bulunamadı'], 404);
}

// Güncelleme işlemi
$reservations[$data['index']]['status'] = $data['status'];

file_put_contents($file, json_encode($reservations, JSON_PRETTY_PRINT));

sendResponse(['success' => true, 'status' => $data['status']]);
?>