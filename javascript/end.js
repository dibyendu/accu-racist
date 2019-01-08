var endFrame = function (name, error, minute, second) {

    var layer = new Kinetic.Layer();
    activeLayer = layer;

    var unitText = 'unit' + (error > 1 ? 's' : '');
    var minText = 'minute' + (minute > 1 ? 's' : '');
    var secText = 'second' + (second > 1.0 ? 's' : '');

    var text = new Kinetic.Text({
        x: 0,
        y: 20,
        text: "That's it                \nYou ended up with an average accuracy (error) of\n         " + unitText + " in     " + minText + "      " + secText + ".\nHover over your name flashing above, to see the graph.",
        fontSize: 20,
        fontFamily: 'chalkdusterregular',
        textFill: '#fff',
        width: 500,
        padding: 30,
        align: 'center',
        lineHeight: 2
    });

    var name = new Kinetic.Text({
        x: 80,
        y: 20,
        text: name + " !",
        fontSize: 20,
        fontFamily: 'chalkdusterregular',
        textFill: '#0f0',
        width: 500,
        padding: 30,
        align: 'center',
        lineHeight: 2
    });

    var error = new Kinetic.Text({
        x: 0,
        y: 140,
        text: (error + 0.0005).toFixed(3),
        fontSize: 22,
        fontFamily: 'chalkdusterregular',
        textFill: '#f00',
        width: 500,
        padding: 30,
        align: 'left'
    });

    var minuteText = new Kinetic.Text({
        x: 250,
        y: 140,
        text: '' + minute,
        fontSize: 22,
        fontFamily: 'chalkdusterregular',
        textFill: '#ff0',
        width: 500,
        padding: 30,
        align: 'left'
    });

    var secondText = new Kinetic.Text({
        x: 90,
        y: 180,
        text: '' + second,
        fontSize: 22,
        fontFamily: 'chalkdusterregular',
        textFill: '#ff0',
        width: 500,
        padding: 30,
        align: 'left'
    });

    var circle = new Kinetic.Ellipse({
        x: 370,
        y: 260,
        radius: {
            x: 50,
            y: 30
        },
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 4
    });

    var arrow = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(400, 236);
            context.quadraticCurveTo(500, 115, 480, 0);
            context.lineTo(475, 25);
            context.moveTo(480, 0);
            context.lineTo(490, 25);
            this.fillStroke(context);
        },
        stroke: 'green',
        strokeWidth: 4
    });

    layer.add(arrow);
    layer.add(text);
    layer.add(circle);
    layer.add(name);
    layer.add(error);
    layer.add(minuteText);
    layer.add(secondText);
    stage.add(layer);

}
