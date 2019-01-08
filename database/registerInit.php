<?php

$name = $_POST['name'];
$ip = $_POST['ip'];
$email = $_POST['email'];
$id = $_POST['id'];
$city = $_POST['city'];
$state = $_POST['state'];
$country = $_POST['country'];
$min_time = $_POST['min_time'];
$max_time = $_POST['max_time'];
$min_error = $_POST['min_error'];
$max_error = $_POST['max_error'];

require_once(__DIR__ . '/./database.php');

logGameInit($name, $ip, $email, $country, $city, $state, $id, $min_time, $max_time, $min_error, $max_error);

?>
