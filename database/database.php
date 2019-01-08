<?php

require_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/../AppInfo.php');

date_default_timezone_set('Asia/Calcutta');

$dbUser = AppInfo::dbUser();
$dbPass = AppInfo::dbPass();
$dbHost = AppInfo::dbHost();
$dbName = AppInfo::dbName();

$allTimeCollectionName           = 'all';
$recentCollectionName            = 'recent';
$errorDistributionCollectionName = 'error';
$logCollectionName               = 'log';
$scoreBoundsCollectionName       = 'bounds';
$maxDocuments                    = 100;

function connectToDatabase($dbUser, $dbPass, $dbHost, $dbName) {
    try {
reconnect:
        $database = new MongoClient("mongodb+srv://{$dbUser}:{$dbPass}@{$dbHost}/${dbName}?retryWrites=true");
    }
    catch (MongoConnectionException $e) {
        goto reconnect;
    }
    return $database->$dbName;
}

if (!isset($database)) {
  $database = connectToDatabase($dbUser, $dbPass, $dbHost, $dbName);
  $allTimeCollection           = $database->$allTimeCollectionName;
  $recentCollection            = $database->$recentCollectionName;
  $errorDistributionCollection = $database->$errorDistributionCollectionName;
  $logCollection               = $database->$logCollectionName;
  $scoreBoundsCollection       = $database->$scoreBoundsCollectionName;
}

function modifyRecentCollection($name, $country, $city, $state, $id, $error, $time, $score) {
    global $maxDocuments, $recentCollection;
    if ($recentCollection->count() < $maxDocuments) {
      $doc = array(
          'facebook_id' => $id,
          'score' => $score,
          'error' => $error,
          'time' => $time,
          'name' => $name,
          'address' => (object) array(
              'country' => $country,
              'state' => $state,
              'city' => $city
          ),
          'date' => new MongoDate()
      );
      $recentCollection->insert($doc);
    } else {
        $document = $recentCollection->find()->sort(array(
            "date" => 1
        ))->limit(1)->getNext();
        $recentCollection->update(array(
            "_id" => $document["_id"]
        ), array(
            '$set' => array(
                'facebook_id' => $id,
                'score' => $score,
                'error' => $error,
                'time' => $time,
                'name' => $name,
                'address' => (object) array(
                    'country' => $country,
                    'state' => $state,
                    'city' => $city
                ),
                'date' => new MongoDate()
            )
        ));
    }
    return;
}

function modifyAllTimeCollection($name, $country, $city, $state, $id, $error, $time, $score) {
    global $maxDocuments, $allTimeCollection;
    $cursor = $allTimeCollection->find(array(
      "_id" => $id
    ));
    if ($cursor->count()) {
        $document = $cursor->getNext();
        if ($document["score"] < $score || ($document["score"] == $score && $document["error"] > $error) || ($document["score"] == $score && $document["error"] == $error && $document["time"] > $time)) {
            $allTimeCollection->update(array(
                "_id" => $document["_id"]
            ), array(
                '$set' => array(
                    'score' => $score,
                    'error' => $error,
                    'time' => $time,
                    'name' => $name,
                    'address' => (object) array(
                        'country' => $country,
                        'state' => $state,
                        'city' => $city
                    ),
                    'date' => new MongoDate()
                )
            ));
        }
    } else {
        if ($allTimeCollection->count() < $maxDocuments) {
          $doc = array(
              '_id' => $id,
              'score' => $score,
              'error' => $error,
              'time' => $time,
              'name' => $name,
              'address' => (object) array(
                  'country' => $country,
                  'state' => $state,
                  'city' => $city
              ),
              'date' => new MongoDate()
          );
          $allTimeCollection->insert($doc);
        } else {
            $doc = $allTimeCollection->find(array(), array(
                "_id" => false,
                "score" => true,
                "error" => true,
                "time" => true
            ))->sort(array(
                "score" => 1,
                "error" => -1,
                "time" => -1
            ))->limit(1)->getNext();
            if ($doc["score"] < $score || ($doc["score"] == $score && $doc["error"] > $error) || ($doc["score"] == $score && $doc["error"] == $error && $doc["time"] >= $time)) {
                $document = $allTimeCollection->find(array(
                  "score" => $doc["score"],
                  "error" => $doc["error"],
                  "time" => $doc["time"]
                ), array(
                  "_id" => true
                ))->sort(array(
                  "date" => 1
                ))->limit(1)->getNext();
                $allTimeCollection->remove(array(
                  "_id" => $document['_id']
                ));
                $new_doc = array(
                    "_id" => $id,
                    "score" => $score,
                    "error" => $error,
                    "time" => $time,
                    'name' => $name,
                    'address' => (object) array(
                        'country' => $country,
                        'state' => $state,
                        'city' => $city
                    ),
                    "date" => new MongoDate()
                );
                $allTimeCollection->insert($new_doc);
            }
        }
    }
    return;
}

function modifyErrorDistribution($score) {
    global $errorDistributionCollection;
    $score  = round($score, 1, PHP_ROUND_HALF_DOWN);
    $cursor = $errorDistributionCollection->find(array(
        "score" => $score
    ));
    if (!$cursor->hasNext()) {
      $doc = array(
          "score" => $score,
          "count" => 1
      );
      $errorDistributionCollection->insert($doc);
    }
    else {
      $errorDistributionCollection->update(array(
        "score" => $score
      ), array(
        '$inc' => array(
          "count" => 1
        )
      ));
    }
    return;
}

function updateDatabase($name, $country, $city, $state, $id, $error, $time, $score) {
    $error = (float) $error;
    $time  = (float) $time;
    $score  = (float) $score;
    modifyRecentCollection($name, $country, $city, $state, $id, $error, $time, $score);
    modifyAllTimeCollection($name, $country, $city, $state, $id, $error, $time, $score);
    modifyErrorDistribution($score);
    return;
}

function getScoreBounds() {
    global $scoreBoundsCollection;
    $document = $scoreBoundsCollection->find(["_id" => 1])->limit(1)->getNext();
    return json_encode($document);
}

function setScoreBounds($min_time, $max_time, $min_error, $max_error) {
    global $scoreBoundsCollection;
    $scoreBoundsCollection->update(["_id" => 1], array(
      '$set' => array(
        "min_time" => $min_time,
        "max_time" => $max_time,
        "min_error" => $min_error,
        "max_error" => $max_error
      )
    ));
    return;
}

function getTop10() {
    global $allTimeCollection;
    $ret    = array();
    $idx    = 0;
    $cursor = $allTimeCollection->find()->sort(array(
        "score" => -1,
        "error" => 1,
        "time" => 1
    ))->limit(10);
    foreach ($cursor as $document) {
        $document['date'] = date('jS F, Y \a\t g:i:s A [\G\M\T P]', $document['date']->sec);
        $ret[$idx]        = $document;
        $idx += 1;
    }
    return json_encode($ret);
}

function getTop100() {
    global $allTimeCollection;
    $ret    = array();
    $idx    = 0;
    $cursor = $allTimeCollection->find()->sort(array(
        "score" => -1,
        "error" => 1,
        "time" => 1
    ));
    foreach ($cursor as $document) {
        $document['date'] = date('jS F, Y \a\t g:i:s A [\G\M\T P]', $document['date']->sec);
        $ret[$idx]        = $document;
        $idx += 1;
    }
    return json_encode(array(
        'type' => 'all',
        'data' => $ret
    ));
}

function getRecent100() {
    global $recentCollection;
    $ret    = array();
    $idx    = 0;
    $cursor = $recentCollection->find()->sort(array(
      "date" => -1
    ));
    foreach ($cursor as $document) {
        $document['date'] = date('jS F, Y \a\t g:i:s A [\G\M\T P]', $document['date']->sec);
        $ret[$idx]        = $document;
        $idx += 1;
    }
    return json_encode(array(
        'type' => 'recent',
        'data' => $ret
    ));
}

function getErrorDistribution() {
    global $errorDistributionCollection;
    $ret    = array();
    $idx    = 0;
    $cursor = $errorDistributionCollection->find()->sort(array("score" => -1));
    foreach ($cursor as $document) {
        $ret[$idx] = $document;
        $idx += 1;
    }
    return json_encode($ret);
}

function logGameInit($name, $ip, $email, $country, $city, $state, $id, $min_time, $max_time, $min_error, $max_error) {
    global $logCollection, $scoreBoundsCollection;
    $scoreBoundsCollection->update(array(
        "_id" => 1
    ), array(
        '$setOnInsert' => array(
            "min_time" => $min_time,
            "max_time" => $max_time,
            "min_error" => $min_error,
            "max_error" => $max_error
        )
    ), array(
        "upsert" => true
    ));
    $cursor = $logCollection->find(array('_id' => $id));
    if ($cursor->count()) {
        $document = $cursor->getNext();
        $document['count'] += 1;
        array_push($document['logs'], (object) array('sdate' => new MongoDate()));
        $logCollection->save($document);
    } else {
        $now = new MongoDate();
        $doc = array(
            '_id' => $id,
            'name' => $name,
            'ip' => $ip,
            'email' => $email,
            'address' => (object) array(
              'country' => $country,
              'state' => $state,
              'city' => $city
            ),
            'count' => 1,
            'best-max-score' => -999999,
            'best-min-error' => 999999,
            'best-score-time' => 0,
            'best-score-date' => $now,
            'logs' => array((object) array('sdate' => $now))
        );
        $logCollection->insert($doc);
    }
    return;
}

function logGameCompletion($id, $error, $time, $score) {
    $error = (float) $error;
    $time  = (float) $time;
    $score  = (float) $score;
    global $logCollection;
    $document = $logCollection->find(array('_id' => $id))->getNext();
    $idx = $document['count'] - 1;
    $document['logs'][$idx] = array_merge($document['logs'][$idx], array(
      'error' => $error,
      'time' => $time,
      'score' => $score,
      'fdate' => new MongoDate()
    ));
    if ($score > $document['best-max-score']) {
      $document['best-max-score'] = $score;
      $document['best-score-time'] = $time;
      $document['best-score-date'] = $document['logs'][$idx]['fdate'];
    } elseif ($score == $document['best-max-score'] && $time < $document['best-score-time']) {
      $document['best-score-time'] = $time;
      $document['best-score-date'] = $document['logs'][$idx]['fdate'];
    }
    if ($error < $document['best-min-error']) {
      $document['best-min-error'] = $error;
    }

    $logCollection->save($document);

    $document['best-score-date'] = date('jS F, Y \a\t g:i:s A (\G\M\T P)', $document['best-score-date']->sec);
    return json_encode($document);
}

function resetDB() {
    global $allTimeCollection, $recentCollection, $errorDistributionCollection, $logCollection, $scoreBoundsCollection;

    $allTimeCollection->deleteIndexes();
    $allTimeCollection->remove([]);

    $recentCollection->deleteIndexes();
    $recentCollection->remove([]);

    $errorDistributionCollection->deleteIndexes();
    $errorDistributionCollection->remove([]);

    $logCollection->deleteIndexes();
    $logCollection->remove([]);

    $scoreBoundsCollection->deleteIndexes();
    $scoreBoundsCollection->remove([]);

    return "database cleared";
}

?>