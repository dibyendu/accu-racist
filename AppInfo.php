<?php

class AppInfo {
  /********************************************/
  // All the environment variables
  /********************************************/
  public static function appID() {
    return getenv('FACEBOOK_APP_ID');
  }
  public static function appSecret() {
    return getenv('FACEBOOK_SECRET');
  }
  public static function dbUser() {
    return getenv('DB_USER');
  }
  public static function dbPass() {
    return getenv('DB_PASS');
  }
  public static function dbHost() {
    return getenv('DB_HOST');
  }
  public static function dbName() {
    return getenv('DB_NAME');
  }
  public static function geoLocationKey() {
    return getenv('IP_STACK_API_KEY');
  }
  public static function adminPassword() {
    return getenv('ADMIN_PASSWORD');
  }
  /********************************************/


  public static function getUrl($path = '/') {
    if (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1)
      || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https'
    ) {
      $protocol = 'https://';
    }
    else {
      $protocol = 'http://';
    }
    return $protocol . $_SERVER['HTTP_HOST'] . $path;
  }
}
?>