var midPointFrame = function (idx) {

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var x1 = Math.floor((Math.random() * w) + borderX);
    var y1 = Math.floor((Math.random() * h / 4) + borderY);
    var x2 = Math.floor((Math.random() * w) + borderX);
    var y2 = Math.floor((Math.random() * h / 4) + borderY + 0.75 * h);

    var midX = Math.min(x1, x2) + Math.abs(x2 - x1) / 2;
    var midY = Math.min(y1, y2) + Math.abs(y2 - y1) / 2;

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var box = createBox(6, randX, randY);

    var fixed = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x1 - 10, y1);
            context.lineTo(x1 + 10, y1);
            context.moveTo(x1, y1 - 10);
            context.lineTo(x1, y1 + 10);
            context.moveTo(x2 - 10, y2);
            context.lineTo(x2 + 10, y2);
            context.moveTo(x2, y2 - 10);
            context.lineTo(x2, y2 + 10);
            this.fillStroke(context);
        },
        stroke: 'white',
        strokeWidth: 2
    });

    var fixedPoint1 = new Kinetic.Circle({
        x: x1,
        y: y1,
        radius: 3,
        fill: 'white'
    });

    var fixedPoint2 = new Kinetic.Circle({
        x: x2,
        y: y2,
        radius: 3,
        fill: 'white'
    });

    var line1 = new Kinetic.Line({
        points: [x1, y1, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var line2 = new Kinetic.Line({
        points: [x2, y2, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var point = new Kinetic.Circle({
        x: randX,
        y: randY,
        radius: 3,
        fill: 'black',
        stroke: 'red',
        strokeWidth: 0.6
    });

    var accurateLine = new Kinetic.Line({
        points: [x1, y1, x2, y2],
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round'
    });

    var accuratePoint = new Kinetic.Circle({
        x: midX,
        y: midY,
        radius: 3,
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 1
    });

    var start_time;

    accurateLine.hide();
    accuratePoint.hide();

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
        line1.setPoints([x1, y1, box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2]);
        line2.setPoints([x2, y2, box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2]);
        point.setPosition(box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        point.setFill('transparent');
        box.hide();
        accurateLine.show();
        accuratePoint.show();
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        var error = Math.sqrt((midX - curX) * (midX - curX) + (midY - curY) * (midY - curY));
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

    boxLayer.add(fixed);
    boxLayer.add(line1);
    boxLayer.add(line2);
    boxLayer.add(accurateLine);
    boxLayer.add(point);
    boxLayer.add(accuratePoint);
    boxLayer.add(fixedPoint1);
    boxLayer.add(fixedPoint2);
    boxLayer.add(box);

    stage.add(boxLayer);

    setHeader('Mid Point', "<span>Drag the small semi-rectangular shape along the board in order to make the <span style='color: black; background: white'>black</span> point coincide with the <b>mid point</b> of the line segment joining the <b>white crossbars</b></span>");

    registerDriverAnimation(stage.get('#driverBox')[0], {
        line: [line1, line2],
        circle: [point]
    });
}
