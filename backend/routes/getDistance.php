<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("../config.php");

$from = urlencode($_GET['from']);
$to = urlencode($_GET['to']);

$url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=$from&destinations=$to&key=$GOOGLE_API_KEY";

$response = file_get_contents($url);
echo $response;