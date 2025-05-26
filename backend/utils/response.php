<?php
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header("Content-Type: application/json");
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
?>