<?php

$error = $_POST['error'];
$time = $_POST['time'];
$score = $_POST['score'];
$id = $_POST['id'];

require_once(__DIR__ . '/./database.php');

echo logGameCompletion($id, $error, $time, $score);

?>