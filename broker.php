<?php
// Define the log file for writing the raw JSON
$logFile = 'current.log';
$errorLogFile = 'error.log';

try {
    // Read the raw JSON input
    $rawInput = file_get_contents('php://input');

    // Check if input is not empty
    if (!empty($rawInput)) {
        // Validate if the input is valid JSON
        $parsedInput = json_decode($rawInput, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            // Save the valid JSON input to a file
            file_put_contents($logFile, $rawInput);

            // Respond with success
            echo "OK";
        } else {
            // If JSON decoding fails, log an error and respond
            $error = json_last_error_msg();
            file_put_contents($errorLogFile, date('Y-m-d H:i:s') . " - JSON Decode Error: $error\nRaw Input: $rawInput\n", FILE_APPEND);

            // Respond with an error message
            echo "Error: Invalid JSON. $error";
        }
    } else {
        // If no valid input is received
        if (file_exists($logFile)) {
            // Return the contents of the existing log file
            echo file_get_contents($logFile);
        } else {
            echo "No data available.";
        }
    }
} catch (Exception $e) {
    // Catch and log any unexpected errors
    file_put_contents($errorLogFile, date('Y-m-d H:i:s') . " - Exception: " . $e->getMessage() . "\n", FILE_APPEND);

    // Respond with a generic error message
    echo "Error: An unexpected error occurred.";
}