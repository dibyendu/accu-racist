var bisectFrame = function (idx) {

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var x1 = Math.floor((Math.random() * (w / 4 - 10)) + borderX);
    var y1 = Math.floor((Math.random() * h / 4) + borderY);
    var x2 = Math.floor((Math.random() * (w / 4 - 10)) + borderX + 0.75 * w + 10);
    var y2 = Math.floor((Math.random() * h / 4) + borderY);
    var x3 = Math.floor((Math.random() * (w / 2 - 20)) + borderX + w / 4 + 10);
    var y3 = Math.floor((Math.random() * h / 4) + borderY + 0.75 * h);
    var angle1 = Math.atan((y3 - y1) / (x3 - x1)) * 180 / Math.PI;
    var angle2 = Math.atan((y3 - y2) / (x2 - x3)) * 180 / Math.PI;
    var angle = angle1 + (180 - angle1 - angle2) / 2;
    var slope = Math.tan(angle * Math.PI / 180);
    var y4 = y3 - 250;
    var x4 = x3 - 250 / slope;

    var arrow1 = getArrow(x1, y1, x3, y3, 20, Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)) / 10);
    var arrow2 = getArrow(x2, y2, x3, y3, 20, Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3)) / 10);
    var arrow3 = getArrow(x4, y4, x3, y3, 15, Math.sqrt((x4 - x3) * (x4 - x3) + (y4 - y3) * (y4 - y3)) / 10);
    var arrow4 = getArrow(randX, randY, x3, y3, 15, Math.sqrt((randX - x3) * (randX - x3) + (randY - y3) * (randY - y3)) / 10);

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var box = createBox(6, randX, randY);

    var fixed = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x3, y3);
            context.lineTo(x2, y2);
            context.moveTo(arrow1[0], arrow1[1]);
            context.lineTo(x1, y1);
            context.lineTo(arrow1[2], arrow1[3]);
            context.moveTo(arrow2[0], arrow2[1]);
            context.lineTo(x2, y2);
            context.lineTo(arrow2[2], arrow2[3]);
            this.fillStroke(context);
        },
        stroke: 'white',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var line = new Kinetic.Line({
        points: [x3, y3, randX, randY],
        stroke: 'red',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var lineArrow1 = new Kinetic.Line({
        points: [randX, randY, arrow4[0], arrow4[1]],
        stroke: 'red',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var lineArrow2 = new Kinetic.Line({
        points: [randX, randY, arrow4[2], arrow4[3]],
        stroke: 'red',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var accurateLine = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x3, y3);
            context.lineTo(x4, y4);
            context.moveTo(arrow3[0], arrow3[1]);
            context.lineTo(x4, y4);
            context.lineTo(arrow3[2], arrow3[3]);
            this.fillStroke(context);
        },
        stroke: 'green',
        strokeWidth: 1
    });

    var start_time;

    accurateLine.hide();

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
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        line.setPoints([x3, y3, curX, curY]);
        arrow4 = getArrow(curX, curY, x3, y3, 15, Math.sqrt((curX - x3) * (curX - x3) + (curY - y3) * (curY - y3)) / 10);
        lineArrow1.setPoints([arrow4[0], arrow4[1], curX, curY]);
        lineArrow2.setPoints([arrow4[2], arrow4[3], curX, curY]);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        accurateLine.show();
        box.hide();
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        var curAngle = Math.atan((y3 - curY) / (x3 - curX)) * 180 / Math.PI;
        angle = angle < 0 ? 180 + angle : angle;
        curAngle = curAngle < 0 ? 180 + curAngle : curAngle;
        var error = Math.abs(angle - curAngle);
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

    boxLayer.add(line);
    boxLayer.add(lineArrow1);
    boxLayer.add(lineArrow2);
    boxLayer.add(accurateLine);
    boxLayer.add(fixed);
    boxLayer.add(box);

    stage.add(boxLayer);

    setHeader('Angle Bisection', "<span>Drag the small semi-rectangular shape along the board to place the <span style='color: red'>red</span> line along the <b>angular bisector</b> of the <strong>white</strong> lines</span>");

    registerDriverAnimation(stage.get('#driverBox')[0], {
        arrow: [
            [line, lineArrow1, lineArrow2]
        ]
    });
}
