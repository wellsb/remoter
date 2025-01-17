<?php

header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type");

if (isset($_POST['txaction'])) {
    file_put_contents('current.log', $_POST['txaction'].",".$_POST['stamp'].",".$_POST['txparams']);
} else {
    echo file_get_contents('current.log');
}
?>

