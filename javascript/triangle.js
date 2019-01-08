var triFrame = function (idx) {

    var markerLength = 12;

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var x1 = Math.floor((Math.random() * w / 3) + borderX);
    var y1 = borderY;

    var x2 = borderX + w;
    var y2 = Math.floor((Math.random() * h / 3) + borderY);

    var x3 = Math.floor((Math.random() * w) + borderX);
    var y3 = borderY + h;

    var l1 = Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3));
    var l2 = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3));
    var l3 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    var centerX = (l1 * x1 + l2 * x2 + l3 * x3) / (l1 + l2 + l3);
    var centerY = (l1 * y1 + l2 * y2 + l3 * y3) / (l1 + l2 + l3);
    var radius = Math.sqrt((l1 - l2 + l3) * (l2 - l3 + l1) * (l3 - l1 + l2) * (l1 + l2 + l3)) / (2 * (l1 + l2 + l3)) - 1;

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var box = createBox(6, randX, randY);

    var fixed = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            context.closePath();
            this.fillStroke(context);
        },
        stroke: 'white',
        strokeWidth: 2,
        lineJoin: 'meter'
    });

    var circle = new Kinetic.Circle({
        x: centerX,
        y: centerY,
        radius: radius,
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 1
    });

    var line1 = new Kinetic.Line({
        points: [x1, y1, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6
    });
    var line2 = new Kinetic.Line({
        points: [x2, y2, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6
    });
    var line3 = new Kinetic.Line({
        points: [x3, y3, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6
    });

    var accuratePoint = new Kinetic.Circle({
        x: centerX,
        y: centerY,
        radius: 3,
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 1
    });
    var point = new Kinetic.Circle({
        x: randX,
        y: randY,
        radius: 3,
        fill: 'black',
        stroke: 'red',
        strokeWidth: 0.6
    });

    var start_time;

    circle.hide();
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
        line1.setPoints([x1, y1, box.getPosition().x + box.getWidth() / 2,
            box.getPosition().y + box.getHeight() / 2
        ]);
        line2.setPoints([x2, y2, box.getPosition().x + box.getWidth() / 2,
            box.getPosition().y + box.getHeight() / 2
        ]);
        line3.setPoints([x3, y3, box.getPosition().x + box.getWidth() / 2,
            box.getPosition().y + box.getHeight() / 2
        ]);
        point.setPosition(box.getPosition().x + box.getWidth() / 2, box
            .getPosition().y + box.getHeight() / 2);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        point.setFill('transparent');
        box.hide();
        line1.hide();
        line2.hide();
        line3.hide();
        circle.show();
        accuratePoint.show();
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
        // stage.removeChildren();
        jQuery('.clickable').show("explode", {
            pieces: 8
        }, 1400);
    });

    boxLayer.add(line1);
    boxLayer.add(line2);
    boxLayer.add(line3);
    boxLayer.add(point);
    boxLayer.add(fixed);
    boxLayer.add(box);
    boxLayer.add(circle);
    boxLayer.add(accuratePoint);

    stage.add(boxLayer);

    setHeader(
        "Triangle Incenter",
        "<span>Drag the small semi-rectangular shape along the board in order to make the <span style='color: black; background: white'>black</span> point coincide with the <a style='color: yellow' href='http://mathworld.wolfram.com/Incenter.html' target='_blank'><b>incenter</b></a> of the <b>white triangle</b></span>",
    true);

    registerDriverAnimation(stage.get('#driverBox')[0], {
        line: [line1, line2, line3],
        circle: [point]
    });
}
