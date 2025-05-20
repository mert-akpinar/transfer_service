<?php
function saveReservation($data) {
    $file = __DIR__ . '/data/reservations.json';
    $reservations = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $reservations[] = $data;
    file_put_contents($file, json_encode($reservations, JSON_PRETTY_PRINT));
    return true;
}

function getReservations() {
    $file = __DIR__ . '/data/reservations.json';
    return file_exists($file) ? json_decode(file_get_contents($file), true) : [];
}
?>