<?php
require_once '../db.php';
require_once '../config.php';
require_once '../utils/response.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    global $ADMIN_EMAIL, $ADMIN_PASSWORD;

    if ($data['email'] === $ADMIN_EMAIL && $data['password'] === $ADMIN_PASSWORD) {
        sendResponse(['token' => 'secure-admin-token']);
    } else {
        sendResponse(['error' => 'Geçersiz giriş'], 401);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = $_GET['token'] ?? '';
    if ($token !== 'secure-admin-token') {
        sendResponse(['error' => 'Yetkisiz erişim'], 403);
    }
    $reservations = getReservations();
    sendResponse($reservations);
}
?>