var frames = [bisectFrame, midPointFrame, circleFrame, rectFrame, convergeFrame, diaFrame, rightFrame, triFrame];
var frameIndex = 0;
var nRound = 2;
var graph = null;

function updateGraphData(score) {
    var exists = false;
    var i;
    var scr = parseFloat((score - 0.01).toFixed(1));
    for (i = 0; i < graph_data.length; i++) {
        if (graph_data[i][0] == scr) {
            graph_data[i][1] += parseInt(1);
            exists = true;
            break;
        }
        if (graph_data[i][0] < scr) break;
    }

    if (!exists) graph_data.splice(i, 0, [scr, 1]);
}

function nextFrame() {
    if (activeLayer) activeLayer.hide();
    stage.clear();
    if (graph) {
        jQuery('#plot-holder').css('display', 'none');
        jQuery('#plot-selector').css('display', 'none');
        graph.getChart().clearChart();
        jQuery('#accuracy-container').show();
        graph = '';
        jQuery('.counter').counter('reset');
        jQuery('#avg-error').html("");
        jQuery('#score-board li').html('-');
        globalScore = parseFloat(0.0);
        globalError = parseFloat(0.0);
        count = parseInt(0);
        registerGameInit(name, ip, email, user_id, address);
    }
    if (!nRound) {
        var counter = jQuery('.counter').text().split(':');
        var time = parseFloat(counter[0]) * 60.0 + parseFloat(counter[1]);
        endFrame(userName, globalError / (frames.length * 2.0), parseInt(counter[0]), parseFloat(counter[1]));
        postData(name, user_id, address, globalError / (frames.length * 2.0), time / (frames.length * 2.0), globalScore / (frames.length * 2.0));
        updateGraphData(globalScore / (frames.length * 2.0));
        jQuery('.clickable').html('Show Graph');
        jQuery('#accuracy .one').odoTicker({
          number: 0
        });
        jQuery('#accuracy .two').odoTicker({
          number: 0
        });
        jQuery('.tiptip').html("");
        nRound -= 1;
        return;
    }
    if (nRound < 0) {
        jQuery('#plot-holder').css('display', 'block');
        jQuery('#plot-selector').css('display', 'block');
        graph = showGraph(globalScore / (frames.length * 2.0));
        var notify = jQuery('.notification.sticky')[0];
        if (jQuery(notify).hasClass('visible'))
          jQuery(notify).stop(true, false).animate({
            marginTop: -jQuery(notify).outerHeight()
          }, 500, function() {
            jQuery(notify).removeClass('visible').addClass('hide');
          });
        jQuery('.clickable').html('Try Again');
        jQuery('.clickable').addClass('rotate');
        jQuery('.tiptip').html("Score Distribution Graph");
        jQuery(".tiptip").tipTip({
          defaultPosition: "bottom",
          fadeOut: 100,
          content: "The horizontal axis represents the <i>Score</i> whereas the vertical one is showing the <i>% of people</i> with that score.<br>Hover over the points in the plot to see individual details."
        });
        jQuery('#accuracy-container').hide();
        nRound = 2;
        frameIndex = 0;
        return;
    }
    jQuery('.clickable').hide("explode", {
      pieces: 8
    }, function () {
      jQuery('.clickable').html('Next');
      if (jQuery('.clickable').hasClass('rotate')) jQuery('.clickable').removeClass('rotate');
    }, 1400);
    frames[frameIndex](frameIndex * 2 + 2 - nRound);
    frameIndex += 1;
    frameIndex %= frames.length;
    if (!frameIndex) nRound -= 1;
}