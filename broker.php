<?php
if (isset($_POST['txaction'])) {
    file_put_contents('current.log', $_POST['txaction'].",".$_POST['stamp'].",".$_POST['txparams']);
} else {
    echo file_get_contents('current.log');
}
?>

