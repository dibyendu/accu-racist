<?php
    require_once __DIR__ . '/vendor/autoload.php';
    require_once('AppInfo.php');
    require_once('database/database.php');

    function getIpAddress() {
      if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipAddresses = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim(end($ipAddresses));
      } else {
        return $_SERVER['REMOTE_ADDR'];
      }
    }
    ini_set("allow_url_fopen", 1);
    $location = file_get_contents('http://api.ipstack.com/' . getIpAddress() . '?access_key=' . AppInfo::geoLocationKey() . '&fields=country_name,region_name,city&output=json');
    $location = json_decode($location);

    \Facebook\FacebookSession::setDefaultApplication(AppInfo::appID(), AppInfo::appSecret());

    try {
     $fbToken = isset($_SESSION['fbToken']) ? $_SESSION['fbToken'] : NULL;
     if ($fbToken !== NULL) {
         $session = new \Facebook\FacebookSession($fbToken);
     } else {
         $helper = new \Facebook\FacebookJavaScriptLoginHelper();
         $session = $helper->getSession();
     }
    } catch(\Facebook\FacebookRequestException $ex) {
    } catch(\Exception $ex) {
    }

    if ($session) {
      try {
        $accessToken = $session->getAccessToken();
        $longLivedAccessToken = $accessToken->extend();
        $_SESSION['fbToken'] = $longLivedAccessToken;
        $me = (new \Facebook\FacebookRequest($session, 'GET', '/me?fields=id,name,email,first_name'))->execute()->getGraphObject(\Facebook\GraphUser::className())->asArray();
        $app_info = (new \Facebook\FacebookRequest($session, 'GET', '/' . AppInfo::appID()))->execute()->getGraphObject()->asArray();
        $app_name = $app_info["name"];
        $app_title = join("", explode(" ", ucwords(str_replace("-", " ", $app_name))));


        $user_id = $me["id"];
        $name = $me["name"];
        $first_name = $me["first_name"];
        $email = $me["email"];
        $ip = getIpAddress();
        $country = $location->country_name;
        $state = $location->region_name;
        $city = $location->city;


      } catch (FacebookRequestException $e) {
        echo 'Facebook Graph API returned an error: ' . $e->getMessage();
        exit;
      } catch (\Exception $e) {
        echo 'Some other error occurred: ' . $e->getMessage();
        exit;
      }
    }
?>

<!DOCTYPE html>
<html xmlns:fb="http://ogp.me/ns/fb#" lang="en">
<head>
    <meta charset="utf-8">
    <meta property="og:title" content="<?php echo $app_name; ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?php echo AppInfo::getUrl(); ?>" />
    <meta property="og:image" content="<?php echo AppInfo::getUrl('/logo.jpg'); ?>" />
    <meta property="og:site_name" content="<?php echo $app_name; ?>" />
    <meta property="og:description" content="An application for testing accuracy of human-eye with respect to some geometrical figures" />
    <meta property="fb:app_id" content="<?php echo AppInfo::appID(); ?>" />
    <title><?php echo $app_name; ?></title>
    <link rel="preload" href="//fonts.googleapis.com/css?family=Euphoria+Script|Tangerine|Stardos+Stencil|Source+Sans+Pro" as="style" onload="this.rel='stylesheet'">
    <link rel="preload" href="/fonts/chalkduster.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link rel="preload" href="/images/frontcurtain.jpg" as="image">
    <link rel="preload" href="/images/darkcurtain.jpg" as="image">
    <link rel="preload" href="/images/canvas-bg.jpg" as="image">
    <link rel="preload" href="/images/border.jpg" as="image">
    <link rel="preload" href="/images/icons.png" as="image">
    <link rel="preload" href="/images/fancybox_loading.gif" as="image">
    <link rel="preload" href="/images/digits.png" as="image">
    <link rel="preload" href="/images/picture-sketch.png" as="image">
    <link rel="preload" href="/images/header-sketch.png" as="image">
    <link href="/images/favicon.ico" rel="icon" type="image/ico">
    <style>
      @font-face {
        font-family: 'chalkdusterregular';
        src: url('/fonts/chalkduster.eot');
        src: url('/fonts/chalkduster.eot?#iefix') format('embedded-opentype'), url('/fonts/chalkduster.woff2') format('woff2'), url('/fonts/chalkduster.woff') format('woff'), url('/fonts/chalkduster.ttf') format('truetype'), url('/fonts/chalkduster.svg#chalkdusterregular') format('svg');
        font-weight: normal;
        font-style: normal;
      }
    </style>


    <!-- link rel="preload" href="/stylesheets/jquery.counter-analog.css" as="style" onload="this.rel='stylesheet'">
    <link rel="preload" href="/stylesheets/jquery.fancybox.css" as="style" onload="this.rel='stylesheet'">
    <link rel="preload" href="/stylesheets/tipTip.css" as="style" onload="this.rel='stylesheet'">
    <link rel="stylesheet" href="/stylesheets/main.css" -->


    <!-- when loading .css files from CDN, make sure to change all relative URLs in all of them -->
    <link rel="preload" href="https://cdn.jsdelivr.net/combine/gh/dibyendu/accu-racist@master/stylesheets/jquery.counter-analog.min.css,gh/dibyendu/accu-racist@master/stylesheets/jquery.fancybox.min.css,gh/dibyendu/accu-racist@master/stylesheets/tipTip.min.css" as="style" onload="this.rel='stylesheet'">
    <link href="https://cdn.jsdelivr.net/gh/dibyendu/accu-racist@master/stylesheets/main.min.css" rel="stylesheet">


    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js" type="text/javascript" async></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript" async>
      google.charts.load('current', {packages: ['corechart']});
    </script>
    <script type="text/javascript">
        var name = "<?php echo $name; ?>";
        var userName = "<?php echo $first_name; ?>";
        var user_id = "<?php echo $user_id; ?>";
        var email = "<?php echo $email; ?>";
        var ip = "<?php echo $ip; ?>";
        var address = {
          country: "<?php echo $country; ?>",
          state: "<?php echo $state; ?>",
          city: "<?php echo $city; ?>",
        };
        var app_name = "<?php echo $app_name; ?>".replace('-', '_').toUpperCase();
        var app_title = "<?php echo $app_title; ?>";
    </script>


    <!-- script src="/javascript/jquery.counter.js" type="text/javascript"></script>
    <script src="/javascript/jquery.odoticker.js" type="text/javascript"></script>
    <script src="/javascript/jquery.tipTip.js" type="text/javascript"></script>
    <script src="/javascript/jquery.fancybox.js" type="text/javascript"></script>
    <script src="/javascript/alphabet.js" type="text/javascript"></script>
    <script src="/javascript/bubbleText.js" type="text/javascript"></script>
    <script src="/javascript/main.js" type="text/javascript" async></script>
    <script src="/javascript/kinetic.js" type="text/javascript"></script>
    <script src="/javascript/core.js" type="text/javascript" async defer></script>
    <script src="/javascript/start.js" type="text/javascript" async defer></script>
    <script src="/javascript/end.js" type="text/javascript" async defer></script>
    <script src="/javascript/rect.js" type="text/javascript" async defer></script>
    <script src="/javascript/circle.js" type="text/javascript" async defer></script>
    <script src="/javascript/bisect.js" type="text/javascript" async defer></script>
    <script src="/javascript/midpoint.js" type="text/javascript" async defer></script>
    <script src="/javascript/converge.js" type="text/javascript" async defer></script>
    <script src="/javascript/diameter.js" type="text/javascript" async defer></script>
    <script src="/javascript/triangle.js" type="text/javascript" async defer></script>
    <script src="/javascript/right-angle.js" type="text/javascript" async defer></script>
    <script src="/javascript/controller.js" type="text/javascript" async defer></script -->


    <script src="https://cdn.jsdelivr.net/combine/gh/dibyendu/accu-racist@master/javascript/jquery.counter.min.js,gh/dibyendu/accu-racist@master/javascript/jquery.odoticker.min.js,gh/dibyendu/accu-racist@master/javascript/jquery.tipTip.min.js,gh/dibyendu/accu-racist@master/javascript/jquery.fancybox.min.js,gh/dibyendu/accu-racist@master/javascript/alphabet.min.js,gh/dibyendu/accu-racist@master/javascript/bubbleText.min.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/gh/dibyendu/accu-racist@master/javascript/main.min.js" type="text/javascript" async></script>
    <script src="https://cdn.jsdelivr.net/combine/gh/dibyendu/accu-racist@master/javascript/kinetic.min.js,gh/dibyendu/accu-racist@master/javascript/core.min.js,gh/dibyendu/accu-racist@master/javascript/start.min.js,gh/dibyendu/accu-racist@master/javascript/end.min.js,gh/dibyendu/accu-racist@master/javascript/rect.min.js,gh/dibyendu/accu-racist@master/javascript/circle.min.js,gh/dibyendu/accu-racist@master/javascript/bisect.min.js,gh/dibyendu/accu-racist@master/javascript/midpoint.min.js,gh/dibyendu/accu-racist@master/javascript/converge.min.js,gh/dibyendu/accu-racist@master/javascript/diameter.min.js,gh/dibyendu/accu-racist@master/javascript/triangle.min.js,gh/dibyendu/accu-racist@master/javascript/right-angle.min.js,gh/dibyendu/accu-racist@master/javascript/controller.min.js" type="text/javascript" async defer></script>


</head>

<body class="bg-enable" style="overflow-y: hidden; overflow-x: hidden">
    
    <div id="fb-root"></div>
    <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v5.0&appId=219743985631064&autoLogAppEvents=1"></script>
<!--     <div id="fb-root"></div> -->
    <script>
//         function statusChangeCallback(response) {
//             if (response.status === 'connected') {
//                 window.location = window.location;
//             } else {
//                 alert('User cancelled login or did not fully authorize.');
//             }
//         }
        
        var afterFbLogin = function (response) {
            console.log('---------------');
            console.log(response);
            console.log('---------------');
//             FB.getLoginStatus(function(response) {
//                 statusChangeCallback(response);
//             });
        }
        
        var login = function () {
            console.log('calling FB login');
            FB.login(function(response) {
                console.log('---------------');
                console.log(response);
                console.log('---------------');
                if (response.status === 'connected') {
            
                } else {
            
                }
            }, {scope: 'public_profile,email'});
        }
        
        

//         window.fbAsyncInit = function() {
//             FB.init({
//                 appId: '<?php echo AppInfo::appID(); ?>',
//                 xfbml: true,
//                 cookie: true,
//                 autoLogAppEvents: true,
//                 version: 'v5.0'
//             });
//         };
//         (function(d, s, id) {
//             var js, fjs = d.getElementsByTagName(s)[0];
//             if (d.getElementById(id)) return;
//             js = d.createElement(s);
//             js.id = id;
//             js.src = "https://connect.facebook.net/en_US/sdk.js";
//             fjs.parentNode.insertBefore(js, fjs);
//         }(document, 'script', 'facebook-jssdk'));
    </script>

    <div class="leftcurtain"><img src="/images/frontcurtain.jpg" width="479" height="495"></div>
    <div class="rightcurtain"><img src="/images/frontcurtain.jpg" width="479" height="495"></div>
    <div id="welcome">

        <?php if (isset($session)) { ?>
          <canvas id="c"></canvas>
          <p style="font-family: 'Euphoria Script', cursive; font-size: 100px; text-align: center">Welcome</p>
          <p style="font-family: 'Tangerine', cursive; font-size: 100px; text-align: center; margin-top: 200px">It's time to test your <span class="info">accuracy</span><span id="game-on">Continue</span></p>
          <a class="rope"></a>
        <?php } else { ?>
            <!-- div style="z-index: 4; top: 250px" class="fb-login-button" data-width="" data-size="medium" data-button-type="continue_with" data-auto-logout-link="false" data-use-continue-as="true" data-scope="email" data-onlogin="afterFbLogin"></div -->
            <button style="z-index: 4; top: 250px; height=40px" onclick="login">Continue with Facebook</button>
        <?php } ?>

    </div>

    <div id="info-holder-wrapper" style="display: none">
        <div id="info-holder">
            <h3>How this game works</h3>
            <br>
            <p style="text-align: left">
                The best way to figure out how it works is to simply play it.
                <br>
                <br> The game works by showing you a series of geometries that need to be adjusted a little to make them accurate. A semi-rectangular shape highlights the point that needs to be moved or adjusted. Use the mouse to drag the shape. Once you let go of the mouse, the computer evaluates your move, so don't let up on the mouse button until you are sure. The <em>correct</em> geometry will also be shown in <strong>green</strong>, so that you can see where you went wrong.
                <br>
                <br> You will be presented with each challenge <strong>twice</strong>. The table to the right shows how you scored on each one of them every time.
                <br>
                <br>
            </p>
            <h3>Scoring</h3>
            <br>
            <p style="text-align: left">
                Once you have done each challenge twice, the computer tallies up your average score. The higher your average score, the better. A theoretically perfect score would be <strong>100</strong>. The accuracy is measured in terms of <strong><a href='https://en.wikipedia.org/wiki/Euclidean_distance' target='_blank'>Euclidean distances</a></strong> and <strong>degrees</strong> (for <em>angular bisector</em> and <em>right-angle</em>).
                <br>
                <br> The game keeps track of two tables. A <strong>best score table</strong> is maintained for showing top 100 results from all the games played. The other <strong>recent score table</strong> shows scores for the most recent 100 games. So your scores will fall off that list after 100 more games have been played, even if nobody beats your score. This will allow mere mortals in the same list as well.
                <br>
                <br> The local best score is also stored on your computer, that never expires.
            </p>
        </div>
    </div>

    <div class="game" style="display: none; position: absolute">
        <div id="container"></div>
        <div id="plot-holder" style="position: fixed; top: 0; left: 0; display: none; width: 500px; height: 400px"></div>
        <div id="plot-selector" style="z-index: 4; text-align: left; position: fixed; top: -2px; left: 460px; display: none">
            <input id="c1" name="smooth" type="checkbox">
            <label for="c1"><span></span>&nbsp;Smooth</label>
            <input id="r1" name="chart" type="radio" value="bar">
            <label for="r1"><span></span>&nbsp;Bar Graph</label>
            <br>
            <input checked="checked" id="r2" name="chart" type="radio" value="line">
            <label for="r2"><span></span>&nbsp;Line Graph</label>
        </div>
        <div id="performance-plot-wrapper" style="display: none">
            <div id="performance-plot-holder" style="width: 600px; height: auto"></div>
        </div>

        <p class="unselectable"><span class="tiptip"><span class='about'>About <?php echo $app_title; ?></span></span>
        </p>
        <p class="clickable" onclick="nextFrame();">Start</p>

        <div id='accuracy-container'>
            <p style="float:left">Accurate upto</p>
            <div id='accuracy'>
                <div class="one"></div>
                <span class="point" style="font-family: chalkdusterregular; top: -18px">.</span>
                <div class="two"></div>
            </div>
            <p style="float:left">units</p>
        </div>

        <div class="notification sticky hide">
            <p></p>
            <a class="close" href="javascript:" style="width: 20px; height: 20px; background: url(/images/icons.png) -30px -102px"></a>
        </div>

        <div id="notebook">
            <div class="tabs">
                <div class="highlighter">Your Accuracy</div>
                <span class="item">Your Accuracy</span>
                <span class="item">Top 10 Results</span>
            </div>
            <div class="content">
                <div class="panel">
                  <div id="score-board">
                    <div>
                        <span>Bisect Angle</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Midpoint</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Circle Center</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Parallelogram</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Concurrency</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Circle Diameter</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Right Angle</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                    <div>
                        <span>Triangle Center</span>
                        <ul>
                            <li>-</li>
                            <li>-</li>
                        </ul>
                    </div>
                    <br>
                  </div>
                    <div id="topper">
                        <div>
                            <ul class="header">
                                <li style="background: url(/images/icons.png) no-repeat -151px -22px"></li>
                                <li>Score</li>
                                <li>Error</li>
                                <li>Time</li>
                            </ul>
                        </div>
                        <div id="1">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="2">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="3">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="4">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="5">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="6">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="7">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="8">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="9">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div id="10">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <a class="fancybox fancybox.ajax" href="database/top100.php">Top 100 Results</a>
                        <a class="fancybox fancybox.ajax" href="database/recent100.php" style="top: -15px; left: 48px">Most Recent 100 Results</a>
                    </div>

                </div>
            </div>
        </div>

        <p class="error-message">
          <strong>Average Score : <span id="avg-error" style="color: #145F13"></span></strong>
          <br>
          <em style="font-size: 15px">(the higher the better)</em>
        </p>

        <div id="bottom-pane">
            <p style="margin: 0px; position: relative; top: -90px; left: -140px">Time Elasped <span class="counter counter-analog" data-direction="up" data-format="9:59.9" data-interval="100" data-stop="9:59.9">0:00.0</span></p>
            <p style="font-size: 12px; position: relative; top: -25px">This application is developed by <a class="button-link profile" style="color: #1f49ff; text-decoration: none; cursor: pointer">Dibyendu Das</a> [copyleft &nbsp;&#596;&#8413;&nbsp;]<br> Source Code is released in <a class="button-link" href="https://github.com/dibyendu/<?php echo $app_name; ?>" style="color: #1f49ff; text-decoration: none" target="_blank">GitHub</a> under <a class="button-link" href="http://www.gnu.org/licenses/gpl-3.0-standalone.html" style="color: #1f49ff; text-decoration: none" target="_blank" title="GPLv3">GNU General Public License</a></p>
        </div>
    </div>
</body>
</html>
