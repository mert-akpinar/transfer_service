<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !is_array($input)) {
    echo json_encode(["success" => false, "error" => "Invalid data"]);
    exit;
}

$ratesFile = __DIR__ . "/../data/rates.json";

if (file_put_contents($ratesFile, json_encode($input, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Could not save rates"]);
}
?>