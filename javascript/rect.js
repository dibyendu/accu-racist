var rectFrame = function (idx) {

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var x1 = Math.floor((Math.random() * (w / 2 - borderX + 1)) + borderX);
    var y1 = Math.floor((Math.random() * (h / 4 + 1)) + borderY + h / 4);
    var x2 = Math.floor((Math.random() * (w / 2 - borderX + 1)) + borderX);
    var y2 = Math.floor((Math.random() * (h / 4 + 1)) + borderY + h / 2);
    var x3 = w / 2 + x2 - borderX;
    var y3 = 0;
    if (x2 - x1 < 0) {
        y3 = Math.floor((Math.random() * (h / 2 + 1)) + borderY + h / 2);
    } else {
        var check = Math.tan(Math.atan((y2 - y1) / (x2 - x1)) - Math.PI / 6) * (x3 - x1) + y1;
        while (check < h / 2) {
            x2 = Math.floor((Math.random() * (w / 2 - borderX + 1)) + borderX);
            y2 = Math.floor((Math.random() * (h / 4 + 1)) + borderY + h / 2);
            x3 = w / 2 + x2 - borderX;
            check = Math.tan(Math.atan((y2 - y1) / (x2 - x1)) - Math.PI / 6) * (x3 - x1) + y1;
        }
        y3 = (check < h) ? Math.floor((Math.random() * (check - h / 2)) + borderY + h / 2) : Math.floor((Math.random() * (h / 2 + 1)) + borderY + h / 2);
    }
    var m1 = (y3 - y2) / (x3 - x2);
    var m2 = (y2 - y1) / (x2 - x1);
    var x4 = ((y3 - y1) + (x1 * m1) - (x3 * m2)) / (m1 - m2);
    var y4 = m1 * (x4 - x1) + y1;

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var box = createBox(6, randX, randY);

    var fixed = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            this.fillStroke(context);
        },
        stroke: 'white',
        strokeWidth: 2
    });

    var upperLine = new Kinetic.Line({
        points: [x1, y1, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var lowerLine = new Kinetic.Line({
        points: [x3, y3, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var accurateUpperLine = new Kinetic.Line({
        points: [x1, y1, x4, y4],
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var accurateLowerLine = new Kinetic.Line({
        points: [x3, y3, x4, y4],
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var start_time;

    accurateUpperLine.hide();
    accurateLowerLine.hide();

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
        upperLine.setPoints([x1, y1, box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2]);
        lowerLine.setPoints([x3, y3, box.getPosition().x + box.getWidth() / 2, box.getPosition().y + box.getHeight() / 2]);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        accurateUpperLine.show();
        accurateLowerLine.show();
        box.hide();
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        var error = Math.sqrt((x4 - curX) * (x4 - curX) + (y4 - curY) * (y4 - curY));
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
    boxLayer.add(upperLine);
    boxLayer.add(lowerLine);
    boxLayer.add(accurateUpperLine);
    boxLayer.add(accurateLowerLine);
    boxLayer.add(box);

    stage.add(boxLayer)

    setHeader('Parallelogram', "<span>Drag the small semi-rectangular shape along the board in order to make the <a style='color: yellow' href='http://en.wikipedia.org/wiki/Quadrilateral' target='_blank'>quadrilateral</a> a <a style='color: yellow' href='http://en.wikipedia.org/wiki/Parallelogram'  target='_blank'>parallelogram</a></span>", true);

    registerDriverAnimation(stage.get('#driverBox')[0], {
        line: [upperLine, lowerLine]
    })
}
