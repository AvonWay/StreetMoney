<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $name = $data['name'] ?? 'Unknown';
    $email = $data['email'] ?? 'No Email';
    $type = $data['type'] ?? 'General';
    $message = $data['message'] ?? 'No Message';

    $to = "bigsteppa333@gmail.com"; // REPLACE WITH YOUR EMAIL
    $subject = "New Contact: $type from $name";
    $body = "Name: $name\nEmail: $email\nType: $type\n\nMessage:\n$message";
    $headers = "From: no-reply@streetmoneyman.com";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to send email."]);
    }
} else {
    // Handle Preflight or other methods
    echo json_encode(["status" => "ready"]);
}
?>
