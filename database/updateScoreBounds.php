<?php

$min_time = $_POST['min_time'];
$max_time = $_POST['max_time'];
$min_error = $_POST['min_error'];
$max_error = $_POST['max_error'];

require_once(__DIR__ . '/./database.php');

echo setScoreBounds($min_time, $max_time, $min_error, $max_error);

?>