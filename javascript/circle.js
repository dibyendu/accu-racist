var circleFrame = function (idx) {

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var minRadius = 80;
    var markerLength = 12;

    var radius = Math.floor((Math.random() * (h / 2 - minRadius)) + minRadius);
    var centerX = Math.floor((Math.random() * (w - 2 * radius)) + borderX + radius);
    var centerY = Math.floor((Math.random() * (h - 2 * radius)) + borderY + radius);

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var circle = new Kinetic.Circle({
        x: centerX,
        y: centerY,
        radius: radius,
        fill: 'transparent',
        stroke: 'white',
        strokeWidth: 2
    });
    var accurateMarkerHorizontal = new Kinetic.Line({
        points: [centerX - markerLength / 2, centerY, centerX + markerLength / 2, centerY],
        stroke: 'green',
        strokeWidth: 1
    });

    var accuratePoint = new Kinetic.Circle({
        x: centerX,
        y: centerY,
        radius: 3,
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 1
    });

    var start_time;

    accuratePoint.hide();

    var userPoint = new Kinetic.Circle({
        x: centerX,
        y: centerY,
        radius: 3,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 0.6
    });

    userPoint.hide();

    var box = createBox(10, randX, randY);

    box.setDragBoundFunc(function (pos) {
        var x = circle.getPosition().x - 10;
        var y = circle.getPosition().y - 10;
        var scale = (circle.getRadius() - 10) / Math.sqrt((pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y));
        if (scale < 1) return {
                y: Math.round((pos.y - y) * scale + y),
                x: Math.round((pos.x - x) * scale + x)
        };
        else return pos;
    });

    var userMarkerHorizontal = new Kinetic.Line({
        points: [randX - markerLength / 2, randY, randX + markerLength / 2, randY],
        stroke: 'red',
        strokeWidth: 0.6
    });
    var userMarkerVertical = new Kinetic.Line({
        points: [randX, randY - markerLength / 2, randX, randY + markerLength / 2],
        stroke: 'red',
        strokeWidth: 0.6
    });

    box.on('mouseover', function () {
        document.body.style.cursor = 'crosshair';
        box.setFill('black');
        box.setOpacity(0.4);
        stage.draw();
    });
    box.on('mouseout', function () {
        document.body.style.cursor = 'default';
        box.setFill('transparent');
        box.setOpacity(1);
        stage.draw();
    });
    box.on('dragstart', function () {
      var counter = jQuery('.counter').text().split(':');
      start_time = parseFloat(counter[0]) * 60.0 + parseFloat(counter[1]);
      jQuery('.counter').counter('play');
    });
    box.on('dragmove', function () {
        userMarkerHorizontal.setPoints([box.getPosition().x + box.getWidth() / 2 - markerLength / 2, box.getPosition().y + box.getHeight() / 2, box.getPosition().x + box.getWidth() / 2 + markerLength / 2, box.getPosition().y + box.getHeight() / 2]);
        userMarkerVertical.setPoints([box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2 - markerLength / 2, box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2 + markerLength / 2]);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        userPoint.setPosition(box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2);
        userMarkerHorizontal.hide();
        userMarkerVertical.hide();
        accuratePoint.show();
        userPoint.show();
        box.hide();
        box.setDraggable(false);
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        var error = Math.sqrt((centerX - curX) * (centerX - curX) + (centerY - curY) * (centerY - curY));
        var duration = parseFloat(counter[0]) * 60.0 + parseFloat(counter[1]) - start_time;
        var score = calculateScore(error, duration);
        globalScore = parseFloat(globalScore) + score;
        globalError = parseFloat(globalError) + error;
        score = (score + 0.0005).toFixed(3);
        showError((error + 0.0005).toFixed(3));
        setScore(idx, score);
        //stage.removeChildren();
        jQuery('.clickable').show("explode", {
            pieces: 8
        }, 1400);
    });

    boxLayer.add(circle);
    boxLayer.add(box);
    boxLayer.add(userPoint);
    boxLayer.add(accuratePoint);
    boxLayer.add(userMarkerHorizontal);
    boxLayer.add(userMarkerVertical);

    stage.add(boxLayer);

    setHeader('Center of a Circle', "<span>Drag the small circular shape along the board in order to make the <span style='color: red'>red</span> cross coincide with the <b>center</b> of the larger <b>white circle</b></span>");

    registerDriverAnimation(stage.get('#driverBox')[0], {
        marker: [
            [userMarkerHorizontal, userMarkerVertical]
        ]
    });
}
