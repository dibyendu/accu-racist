var rightFrame = function (idx) {

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var x1 = Math.floor((Math.random() * w / 4) + borderX);
    var y1 = Math.floor((Math.random() * h / 4) + h / 2 + borderY);
    var x2 = Math.floor((Math.random() * w / 4) + borderX + w / 2);
    var y2 = Math.floor((Math.random() * h / 4) + borderY + 0.75 * h);
    var arrow1 = getArrow(x2, y2, x1, y1, 20, Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 10);

    var angle = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;
    var x3 = x1 + 200 * Math.sin(angle * Math.PI / 180);
    var y3 = y1 - 200 * Math.cos(angle * Math.PI / 180);
    var arrow2 = getArrow(x3, y3, x1, y1, 20, Math.sqrt((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1)) / 10);

    var arrow3 = getArrow(randX, randY, x1, y1, 20, Math.sqrt((randX - x1) * (randX - x1) + (randY - y1) * (randY - y1)) / 10);

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var box = createBox(6, randX, randY);

    box.setDragBoundFunc(function (pos) {
        var newY = pos.y + 10 > y1 ? y1 - 10 : pos.y;
        return {
            x: pos.x,
            y: newY
        };
    });

    var fixed = new Kinetic.Line({
        points: [x1, y1, x2, y2],
        stroke: 'white',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var fixedArrow1 = new Kinetic.Line({
        points: [x2, y2, arrow1[0], arrow1[1]],
        stroke: 'white',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var fixedArrow2 = new Kinetic.Line({
        points: [x2, y2, arrow1[2], arrow1[3]],
        stroke: 'white',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var line = new Kinetic.Line({
        points: [x1, y1, randX, randY],
        stroke: 'red',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var lineArrow1 = new Kinetic.Line({
        points: [randX, randY, arrow3[0], arrow3[1]],
        stroke: 'red',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var lineArrow2 = new Kinetic.Line({
        points: [randX, randY, arrow3[2], arrow3[3]],
        stroke: 'red',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var accurateLine = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x3, y3);
            context.moveTo(arrow2[0], arrow2[1]);
            context.lineTo(x3, y3);
            context.lineTo(arrow2[2], arrow2[3]);
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
        line.setPoints([x1, y1, curX, curY]);
        arrow3 = getArrow(curX, curY, x1, y1, 20, Math.sqrt((curX - x1) * (curX - x1) + (curY - y1) * (curY - y1)) / 10);
        lineArrow1.setPoints([arrow3[0], arrow3[1], curX, curY]);
        lineArrow2.setPoints([arrow3[2], arrow3[3], curX, curY]);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        accurateLine.show();
        box.hide();
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        var curAngle = Math.atan(Math.abs(y1 - curY) / Math.abs(x1 - curX)) * 180 / Math.PI;
        var error = Math.abs(curX < x1 ? 90 + ((curY <= y1 ? -1 : 1) * curAngle) + angle : 90 + ((curY <= y1 ? -1 : 1) * curAngle) - angle);
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
    boxLayer.add(fixedArrow1);
    boxLayer.add(fixedArrow2);
    boxLayer.add(box);

    stage.add(boxLayer);

    setHeader('Right Angle', "<span>Drag the small semi-rectangular shape along the board to make the <span style='color: red'>red</span> line <a style='color: yellow' href='http://en.wikipedia.org/wiki/Perpendicular' target='_blank'><b>perpendicular</b></a> to the <strong>white</strong> line</span>", true);

    registerDriverAnimation(stage.get('#driverBox')[0], {
        arrow: [
            [line, lineArrow1, lineArrow2]
        ]
    });
}
