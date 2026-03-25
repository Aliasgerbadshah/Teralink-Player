<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read the incoming JSON payload from Vue/React/VanillaJS app.js
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);
$link = $input['link'] ?? '';

if (empty($link)) {
    echo json_encode(['ok' => false, 'error' => 'No link provided']);
    exit;
}

// Prepare xAPIverse Payload
$payload = json_encode([
    'url' => $link
]);

$ch = curl_init('https://xapiverse.com/api/terabox');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'xAPIverse-Key: sk_d35341aacb2113314516800c03737ab2',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Curl Error: ' . $error_msg]);
} else {
    http_response_code($httpcode);
    echo $response;
}

curl_close($ch);
