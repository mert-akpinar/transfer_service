<?php
function saveReservation($data) {
    $file = __DIR__ . '/data/reservations.json';
    if (file_exists($file)) {
        $reservations = json_decode(file_get_contents($file), true);
        if (!is_array($reservations)) {
            $reservations = [];
        }
    } else {
        $reservations = [];
    }
    $reservations[] = $data;
    file_put_contents($file, json_encode($reservations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getReservations() {
    $file = __DIR__ . '/data/reservations.json';
    if (!file_exists($file)) {
        return [];
    }
    return json_decode(file_get_contents($file), true);
}
?>