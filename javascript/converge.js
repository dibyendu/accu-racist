var convergeFrame = function (idx) {

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

    var inctX = Math.floor((Math.random() * w / 6) + borderX + 5 * w / 12);
    var inctY = Math.floor((Math.random() * h / 6) + borderY + 5 * h / 12);

    var x1 = Math.floor((Math.random() * w / 3) + borderX);
    var y1 = borderY;

    var x2 = borderX + w;
    var y2 = Math.floor((Math.random() * h / 3) + borderY);

    var x3 = Math.floor((Math.random() * w) + borderX);
    var y3 = borderY + h;

    var x1f = x1 + (h * (inctX - x1)) / (4 * (inctY - y1));
    var y1f = borderY + h / 4;

    var x2f = borderX + 0.75 * w;
    var y2f = inctY - ((0.75 * w + borderX - inctX) * (inctY - y2)) / (x2 - inctX);

    var x3f = inctX + ((x3 < inctX) ? -1 : 1) * ((0.75 * h + borderY - inctY) * Math.abs(inctX - x3) / (y3 - inctY));
    var y3f = borderY + 0.75 * h;

    var arrow1 = getArrow(x1f, y1f, x1, y1, 20, Math.sqrt((x1f - x1) * (x1f - x1) + (y1f - y1) * (y1f - y1)) / 6);
    var arrow2 = getArrow(x2f, y2f, x2, y2, 20, Math.sqrt((x2f - x2) * (x2f - x2) + (y2f - y2) * (y2f - y2)) / 6);
    var arrow3 = getArrow(x3f, y3f, x3, y3, 20, Math.sqrt((x3f - x3) * (x3f - x3) + (y3f - y3) * (y3f - y3)) / 6);

    var boxLayer = new Kinetic.Layer();
    activeLayer = boxLayer;

    var box = createBox(6, randX, randY);

    var fixed = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x1f, y1f);
            context.moveTo(x2, y2);
            context.lineTo(x2f, y2f);
            context.moveTo(x3, y3);
            context.lineTo(x3f, y3f);
            context.moveTo(arrow1[0], arrow1[1]);
            context.lineTo(x1f, y1f);
            context.lineTo(arrow1[2], arrow1[3]);
            context.moveTo(arrow2[0], arrow2[1]);
            context.lineTo(x2f, y2f);
            context.lineTo(arrow2[2], arrow2[3]);
            context.moveTo(arrow3[0], arrow3[1]);
            context.lineTo(x3f, y3f);
            context.lineTo(arrow3[2], arrow3[3]);
            context.moveTo(x1 - 10, y1);
            context.lineTo(x1 + 10, y1);
            context.moveTo(x1, y1 - 10);
            context.lineTo(x1, y1 + 10);
            context.moveTo(x2 - 10, y2);
            context.lineTo(x2 + 10, y2);
            context.moveTo(x2, y2 - 10);
            context.lineTo(x2, y2 + 10);
            context.moveTo(x3 - 10, y3);
            context.lineTo(x3 + 10, y3);
            context.moveTo(x3, y3 - 10);
            context.lineTo(x3, y3 + 10);
            this.fillStroke(context);
        },
        stroke: 'white',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'bevel'
    });

    var holder = new Kinetic.Shape({
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
            context.moveTo(x3 - 10, y3);
            context.lineTo(x3 + 10, y3);
            context.moveTo(x3, y3 - 10);
            context.lineTo(x3, y3 + 10);
            this.fillStroke(context);
        },
        stroke: '#1A40E3',
        strokeWidth: 2,
        lineCap: 'round'
    });

    var fixedPoint1 = new Kinetic.Circle({
        x: x1,
        y: y1,
        radius: 3,
        fill: '#1A40E3'
    });

    var fixedPoint2 = new Kinetic.Circle({
        x: x2,
        y: y2,
        radius: 3,
        fill: '#1A40E3'
    });

    var fixedPoint3 = new Kinetic.Circle({
        x: x3,
        y: y3,
        radius: 3,
        fill: '#1A40E3'
    });

    var line1 = new Kinetic.Line({
        points: [x1f, y1f, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var line2 = new Kinetic.Line({
        points: [x2f, y2f, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var line3 = new Kinetic.Line({
        points: [x3f, y3f, randX, randY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var accurateLine1 = new Kinetic.Line({
        points: [x1f, y1f, inctX, inctY],
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var accurateLine2 = new Kinetic.Line({
        points: [x2f, y2f, inctX, inctY],
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var accurateLine3 = new Kinetic.Line({
        points: [x3f, y3f, inctX, inctY],
        stroke: 'green',
        strokeWidth: 1,
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

    var start_time;

    accurateLine1.hide();
    accurateLine2.hide();
    accurateLine3.hide();

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
        line1.setPoints([x1f, y1f, curX, curY]);
        line2.setPoints([x2f, y2f, curX, curY]);
        line3.setPoints([x3f, y3f, curX, curY]);
        point.setPosition(curX, curY);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        accurateLine1.show();
        accurateLine2.show();
        accurateLine3.show();
        point.hide();
        box.hide();
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curX = box.getPosition().x + box.getWidth() / 2;
        var curY = box.getPosition().y + box.getHeight() / 2;
        var error = Math.sqrt((inctX - curX) * (inctX - curX) + (inctY - curY) * (inctY - curY));
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
    boxLayer.add(holder);
    boxLayer.add(fixedPoint1);
    boxLayer.add(fixedPoint2);
    boxLayer.add(fixedPoint3);
    boxLayer.add(line1);
    boxLayer.add(line2);
    boxLayer.add(line3);
    boxLayer.add(point);
    boxLayer.add(accurateLine1);
    boxLayer.add(accurateLine2);
    boxLayer.add(accurateLine3);
    boxLayer.add(box);

    stage.add(boxLayer);

    setHeader('Concurrent Lines', "<span>Drag the small semi-rectangular shape along with the <span style='color: red'>red</span> lines to make the <b>3 white lines <a style='color: yellow' href='http://en.wikipedia.org/wiki/Concurrent_lines' target='_blank'>concurrent</a></b></span>", true);

    registerDriverAnimation(stage.get('#driverBox')[0], {
        line: [line1, line2, line3],
        circle: [point]
    });
}
