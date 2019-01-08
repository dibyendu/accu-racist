var startFrame = function (name) {

    var layer = new Kinetic.Layer();
    activeLayer = layer;

    var text = new Kinetic.Text({
        x: 0,
        y: 20,
        text: "Hello " + name + ",\nYou'll be taken through a series of tests.You can hover your mouse over here to get more information about the corresponding task.\nTo start, click here.\nGood luck & enjoy ...",
        fontSize: 20,
        fontFamily: 'chalkdusterregular',
        textFill: '#fff',
        width: 500,
        padding: 20,
        align: 'center',
        lineHeight: 2
    });

    var circle1 = new Kinetic.Ellipse({
        x: 360,
        y: 290,
        radius: {
            x: 40,
            y: 20
        },
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 4
    });

    var circle2 = new Kinetic.Ellipse({
        x: 328,
        y: 170,
        radius: {
            x: 40,
            y: 20
        },
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 4
    });

    var arrow = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(400, 290);
            context.quadraticCurveTo(460, 320, 460, 380);
            context.lineTo(450, 360);
            context.moveTo(460, 384);
            context.lineTo(468, 358);
            context.moveTo(284, 170);
            context.quadraticCurveTo(100, 100, 250, 20);
            context.lineTo(235, 40);
            context.moveTo(254, 16);
            context.lineTo(224, 23);
            this.fillStroke(context);
        },
        stroke: 'green',
        strokeWidth: 4
    });

    layer.add(arrow);
    layer.add(text);
    layer.add(circle1);
    layer.add(circle2);
    stage.add(layer);

}
