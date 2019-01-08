<?php

require_once(__DIR__ . '/../AppInfo.php');
require_once(__DIR__ . '/./database.php');

$password = $_POST['password'];

if ($password == AppInfo::adminPassword()) {
  echo resetDB();
} else {
  echo "wrong password";
}

?>