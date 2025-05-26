<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("../config.php");

echo json_encode([
  "googleApiKey" => $GOOGLE_API_KEY
]);