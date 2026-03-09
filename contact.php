<?php
/**
 * Contact form handler - sends email to portfolio owner via mail()
 * Configure $recipient below
 */

$recipient = 'andrew_young17@icloud.com';

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Honeypot spam check - if filled, it's a bot
if (!empty($_POST['website'])) {
    header('Location: index.html?sent=1');
    exit;
}

// Sanitize inputs
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    header('Location: index.html?error=1');
    exit;
}

// Basic email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html?error=1');
    exit;
}

// Build email
$subject = 'Portfolio Contact from ' . $name;
$body = "Name: $name\n";
$body .= "Email: $email\n\n";
$body .= "Message:\n$message";

$headers = [
    'From: ' . $email,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    error_log('[Contact Form] mail() failed to send');
}

if ($sent) {
    header('Location: index.html?sent=1');
} else {
    header('Location: index.html?error=1');
}
exit;