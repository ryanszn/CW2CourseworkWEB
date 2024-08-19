<?php

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log received data for debugging
file_put_contents('debug.log', print_r($_POST, true), FILE_APPEND);

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data from POST request
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validate form data
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(array('success' => false, 'error' => 'All fields are required.'));
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(array('success' => false, 'error' => 'Invalid email format.'));
        exit;
    }

    // Define email details
    $to = 'ryangrahamjackson@gmail.com'; // Recipient's email address
    $subject = 'Contact Form Submission';
    $message_body = "Name: $name\nEmail: $email\n\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    // Attempt to send the email
    if (mail($to, $subject, $message_body, $headers)) {
        echo json_encode(array('success' => true));
    } else {
        $error = error_get_last()['message'] ?? 'Unknown error';
        echo json_encode(array('success' => false, 'error' => 'Failed to send email. Error: ' . $error));
    }
} else {
    echo json_encode(array('success' => false, 'error' => 'Invalid request.'));
}

?>
