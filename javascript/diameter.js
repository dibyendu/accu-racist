var diaFrame = function (idx) {

    var minRadius = 120;

    var randX = Math.floor((Math.random() * w) + borderX);
    var randY = Math.floor((Math.random() * h) + borderY);

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

    var diameter = new Kinetic.Line({
        points: [centerX - radius, centerY, centerX + radius, centerY],
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var initY = centerY + (Math.random() > 0.5 ? 1 : -1) * Math.random() * radius;
    var len = Math.sqrt(radius * radius - (centerY - initY) * (centerY - initY));

    var chord = new Kinetic.Line({
        points: [centerX - len, initY, centerX + len, initY],
        stroke: 'red',
        strokeWidth: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
    });

    var start_time;

    diameter.hide();

    var box = createBox(6, randX, randY);

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
        var curY = box.getPosition().y + box.getHeight() / 2;
        var length = Math.sqrt(radius * radius - (centerY - curY) * (centerY - curY));
        chord.setPoints([centerX - length, curY, centerX + length, curY]);
    });
    box.on('dragend', function () {
        jQuery('.counter').counter('stop');
        diameter.show();
        box.hide();
        box.setDraggable(false);
        stage.draw();
        var counter = jQuery('.counter').text().split(':');
        var curY = box.getPosition().y + box.getHeight() / 2;
        var error = Math.abs(centerY - curY);
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

    boxLayer.add(chord);
    boxLayer.add(diameter);
    boxLayer.add(circle);
    boxLayer.add(box);

    stage.add(boxLayer);

    setHeader('Diameter of a Circle', "<span>Drag the small semi-rectangular shape to make the <span style='color: red'>red</span> line coincide with the <a style='color: yellow' href='http://en.wikipedia.org/wiki/Diameter' target='_blank'><b>diameter</b></a> of the <b>white circle</b></span>", true);

    registerDriverAnimation(stage.get('#driverBox')[0], {});
}
