<?php
require_once __DIR__ . '/../config.php';

function getDistanceKm($origin, $destination) {
    global $GOOGLE_API_KEY;

    // Adresleri varsayılan şehirlerle tamamla
    $origin_full = completeAddress($origin);
    $destination_full = completeAddress($destination);

    $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" . urlencode($origin_full) . "&destinations=" . urlencode($destination_full) . "&key=$GOOGLE_API_KEY&language=tr";

    $response = file_get_contents($url);
    $data = json_decode($response, true);

    if (
        $data['status'] === 'OK' &&
        $data['rows'][0]['elements'][0]['status'] === 'OK'
    ) {
        $meters = $data['rows'][0]['elements'][0]['distance']['value'];
        return round($meters / 1000);
    } else {
        file_put_contents(__DIR__ . '/../data/api_error_log.txt', json_encode([
            'request_url' => $url,
            'origin' => $origin,
            'destination' => $destination,
            'response' => $data
        ], JSON_PRETTY_PRINT));
        return 100; // fallback
    }
}

function completeAddress($place) {
    // İlçeye göre şehir ekle
    $mapping = [
        "Fethiye" => "Muğla",
        "Kalkan" => "Antalya",
        "Kapadokya" => "Nevşehir",
        "Pamukkale" => "Denizli",
        "Konya Mevlana" => "Konya"
    ];

    foreach ($mapping as $keyword => $city) {
        if (stripos($place, $keyword) !== false) {
            return "$place, $city";
        }
    }

    return "$place, Antalya";
}
?>