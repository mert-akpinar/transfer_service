<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$ratesFile = __DIR__ . "/../data/rates.json";
if (file_exists($ratesFile)) {
    echo file_get_contents($ratesFile);
} else {
    echo json_encode(["error" => "Rates file not found."]);
}
?>
