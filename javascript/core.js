var stage = new Kinetic.Stage({
    container: 'container',
    width: 500,
    height: 400
});

var activeLayer = false;
var globalScore = parseFloat(0.0);
var globalError = parseFloat(0.0);
var count = parseInt(0);
var rectX = stage.getWidth() / 2 - 50;
var rectY = stage.getHeight() / 2 - 25;
var borderX = 20;
var borderY = 20;
var w = stage.getWidth() - 2 * borderX;
var h = stage.getHeight() - 2 * borderY;

function createBox(radius, randx, randy) {
    return new Kinetic.Rect({
        x: randx - 10,
        y: randy - 10,
        width: 20,
        height: 20,
        cornerRadius: radius,
        fill: 'transparent',
        stroke: 'white',
        strokeWidth: 2,
        draggable: true,
        id: 'driverBox'
    });
}

function getArrow(x1, y1, x2, y2, angle, length) {
    var pts = [];
    if (y1 < y2) {
        var tmp = Math.atan(Math.abs(x1 - x2) / Math.abs(y1 - y2)) * 180 / 3.14;
        var theta1 = (tmp - angle) * 3.14 / 180;
        var theta2 = (tmp + angle) * 3.14 / 180;
        if (x1 > x2) pts.push(x1 - length * Math.sin(theta1), y1 + length * Math.cos(theta1), x1 - length * Math.sin(theta2), y1 + length * Math.cos(theta2));
        else if (x1 == x2) pts.push(x1 + length * Math.sin(theta1), y1 + length * Math.cos(theta1), x1 + length * Math.sin(theta2), y1 + length * Math.cos(theta2));
        else pts.push(x1 + length * Math.sin(theta1), y1 + length * Math.cos(theta1), x1 + length * Math.sin(theta2), y1 + length * Math.cos(theta2));
    } else if (y1 == y2) {
        var theta = angle * 3.14 / 180;
        if (x1 > x2) pts.push(x1 - length * Math.cos(theta), y1 + length * Math.sin(theta), x1 - length * Math.cos(theta), y1 - length * Math.sin(theta));
        else pts.push(x1 + length * Math.cos(theta), y1 + length * Math.sin(theta), x1 + length * Math.cos(theta), y1 - length * Math.sin(theta));
    } else {
        if (x1 > x2) {
            var tmp = Math.atan(Math.abs(y1 - y2) / Math.abs(x1 - x2)) * 180 / 3.14;
            var theta1 = (tmp - angle) * 3.14 / 180;
            var theta2 = (tmp + angle) * 3.14 / 180;
            pts.push(x1 - length * Math.cos(theta1), y1 - length * Math.sin(theta1), x1 - length * Math.cos(theta2), y1 - length * Math.sin(theta2));
        } else if (x1 == x2) {
            var theta = angle * 3.14 / 180;
            pts.push(x1 - length * Math.sin(theta), y1 - length * Math.cos(theta), x1 + length * Math.sin(theta), y1 - length * Math.cos(theta));
        } else {
            var tmp = Math.atan(Math.abs(y1 - y2) / Math.abs(x1 - x2)) * 180 / 3.14;
            var theta1 = (tmp - angle) * 3.14 / 180;
            var theta2 = (tmp + angle) * 3.14 / 180;
            pts.push(x1 + length * Math.cos(theta1), y1 - length * Math.sin(theta1), x1 + length * Math.cos(theta2), y1 - length * Math.sin(theta2));
        }
    }
    return pts;
}

/******************************************************/
// This function can further be improved.
// Current scoring algorithm is taken from here:
// http://mathforum.org/library/drmath/view/72033.html
// scale bounds could be updated during game play
/******************************************************/
function calculateScore(error, duration) {
  var boundsChanged = (error < scoreBounds.min_error || error > scoreBounds.max_error || duration < scoreBounds.min_time || duration > scoreBounds.max_time);
  if (boundsChanged) {
    scoreBounds.min_error = parseFloat(error < scoreBounds.min_error ? error : scoreBounds.min_error);
    scoreBounds.max_error = parseFloat(error > scoreBounds.max_error ? error : scoreBounds.max_error);
    scoreBounds.min_time = parseFloat(duration < scoreBounds.min_time ? duration : scoreBounds.min_time);
    scoreBounds.max_time = parseFloat(duration > scoreBounds.max_time ? duration : scoreBounds.max_time);
    updateScoreBounds(scoreBounds);
  }
  /*
    scales used:
      scoreBounds.max_error -> 0
      scoreBounds.max_time  -> 0
      scoreBounds.min_error -> 100
      scoreBounds.min_time  -> 100
  */
  var error_score = (scoreBounds.max_error - error) / (scoreBounds.max_error - scoreBounds.min_error);
  var time_score = (scoreBounds.max_time - duration) / (scoreBounds.max_time - scoreBounds.min_time);
  return 0.75 * (error_score * 100) + 0.25 * (time_score * 100);
}

function showError(score) {
    var intPart = Math.floor(score);
    var floatPart = "" + Math.floor((score - intPart) * 1000.0 + 0.5);

    if (floatPart.length == 2) floatPart = "0" + floatPart;
    else if (floatPart.length == 1) floatPart = "00" + floatPart;

    if (floatPart[0] == '0' && floatPart[1] == '0' && floatPart[2] == '0') {
        floatPart = '0';
    }

    jQuery('#accuracy .one').odoTicker({
      number: intPart
    });
    jQuery('#accuracy .two').odoTicker({
      number: floatPart
    });
}

function setScore(idx, score) {
    jQuery('#score-board li:eq(' + idx + ')').html(score);
    count += 1;
    jQuery('#avg-error').html((globalScore / count + 0.00005).toFixed(3));
}

function setHeader(title, tooltip, alive) {
    alive = (typeof alive == "undefined") ? false : alive;
    jQuery('.tiptip').html(title);
    jQuery(".tiptip").tipTip({
        defaultPosition: "bottom",
        keepAlive: alive,
        fadeOut: 2000,
        content: tooltip
    });
}

function registerDriverAnimation(shape, others) {
    jQuery('#container').mousedown(function (event) {
        if (shape.isVisible()) shape.setDraggable(true);
        var xPosition = event.pageX - this.offsetLeft - 40;
        var yPosition = event.pageY - this.offsetTop - 40;
        var shapeX = shape.getPosition().x;
        var shapeY = shape.getPosition().y;
        var shapeWidth = shape.getWidth();
        var shapeHeight = shape.getHeight();
        if (shape.isVisible() && (xPosition >= 0 && yPosition >= 0 && xPosition <= 500 && yPosition <= 400) && (xPosition < shapeX || xPosition > shapeX + shapeWidth || yPosition < shapeY || yPosition > shapeY + shapeHeight)) {
	    jQuery('.counter').counter('play');
            shape.transitionTo({
                x: xPosition - shapeWidth / 2,
                y: yPosition - shapeHeight / 2,
                duration: 0.2,
                easing: 'ease-in',
                callback: function () {
                    if ('line' in others) {
                        for (var i = 0; i < others.line.length; i++) {
                            var currentPoints = others.line[i].getPoints();
                            others.line[i].setPoints([currentPoints[0].x, currentPoints[0].y, xPosition, yPosition]);
                        }
                    }
                    if ('arrow' in others) {
                        for (var i = 0; i < others.arrow.length; i++) {
                            var currentPoints = others.arrow[i][0].getPoints();
                            var arrowPoints = getArrow(xPosition, yPosition, currentPoints[0].x, currentPoints[0].y, 15, Math.sqrt((xPosition - currentPoints[0].x) * (xPosition - currentPoints[0].x) + (yPosition - currentPoints[0].y) * (yPosition - currentPoints[0].y)) / 10);
                            others.arrow[i][0].setPoints([currentPoints[0].x, currentPoints[0].y, xPosition, yPosition]);
                            others.arrow[i][1].setPoints([arrowPoints[0], arrowPoints[1], xPosition, yPosition]);
                            others.arrow[i][2].setPoints([arrowPoints[2], arrowPoints[3], xPosition, yPosition]);
                        }
                    }
                    shape.simulate('mousedown');
                }
            });

            if ('circle' in others) {
                for (var i = 0; i < others.circle.length; i++)
                    others.circle[i].transitionTo({
                        x: xPosition,
                        y: yPosition,
                        duration: 0.2,
                        easing: 'ease-in'
                    });
            }

            if ('marker' in others) {
                for (var i = 0; i < others.marker.length; i++) {
                    var length = Math.abs(others.marker[i][0].getPoints()[0].x - others.marker[i][0].getPoints()[1].x);
                    others.marker[i][0].setPoints([xPosition - length / 2, yPosition, xPosition + length / 2, yPosition]);
                    others.marker[i][1].setPoints([xPosition, yPosition - length / 2, xPosition, yPosition + length / 2]);
                }
            }

        } else if (shape.isVisible() && (xPosition >= shapeX && xPosition <= shapeX + shapeWidth && yPosition >= shapeY && yPosition <= shapeY + shapeHeight)) {
            shape.simulate('mousedown');
            shape.setDraggable(true);
        }
    });

    jQuery(document).mouseup(function (event) {
        var xPosition = (event.pageX - jQuery('#container').offset().left) - 40;
        var yPosition = (event.pageY - jQuery('#container').offset().top) - 40;
        var maxX = jQuery('#container').width();
        var maxY = jQuery('#container').height();
        if (xPosition <= 0 || xPosition >= maxX || yPosition <= 0 || yPosition >= maxY) {
            if (shape.isDragging()) {
                shape.simulate('dragend');
                shape.setDraggable(false);
            }
        } else {
            var shapeX = shape.getPosition().x;
            var shapeY = shape.getPosition().y;
            var shapeWidth = shape.getWidth();
            var shapeHeight = shape.getHeight();
            if (xPosition < shapeX || xPosition > shapeX + shapeWidth || yPosition < shapeY || yPosition > shapeY + shapeHeight) shape.setDraggable(false);
        }
    });
}
