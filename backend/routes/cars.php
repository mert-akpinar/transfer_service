<?php
require_once '../utils/response.php';
require_once '../utils/distance.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
$from = $_GET['from'] ?? '';
$to = $_GET['to'] ?? '';

if (!$from || !$to) {
    sendResponse(['error' => 'Alış ve varış noktası zorunludur'], 400);
}

$cars = json_decode(file_get_contents('../data/cars.json'), true);
$km = getDistanceKm($from, $to);

foreach ($cars as &$car) {
    $price = round(($km * $car['multiplier']) / 5) * 5;
    $car['price_eur'] = $price;
    $car['distance_km'] = $km;
}

sendResponse($cars);
?>
