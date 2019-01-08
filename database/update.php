<?php

$name = $_POST['name'];
$id = $_POST['id'];
$city = $_POST['city'];
$state = $_POST['state'];
$country = $_POST['country'];
$error = $_POST['error'];
$time = $_POST['time'];
$score = $_POST['score'];

require_once(__DIR__ . '/./database.php');

updateDatabase($name, $country, $city, $state, $id, $error, $time, $score);

?>
