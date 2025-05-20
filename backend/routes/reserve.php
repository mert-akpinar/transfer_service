<?php
// CORS ayarları (OPTIONS preflight için dahil!)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    http_response_code(200);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

require_once '../db.php';
require_once '../utils/response.php';

$data = json_decode(file_get_contents('php://input'), true);

if (
    !$data || 
    !isset($data['name']) || 
    !isset($data['email']) || 
    !isset($data['selected_car'])
) {
    sendResponse(['error' => 'Geçersiz veri'], 400);
}

saveReservation($data);
sendResponse(['success' => true]);
?>