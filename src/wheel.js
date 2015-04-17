(function() {
  'use strict';

  var spinning = false;

  var slices = [];
  var numberOfSlices;
  var sliceArc;
  var currentAngle = 0;

  var draw = function() {
    var canvas = document.getElementById('wheel');
    if (typeof canvas.getContext === 'undefined') {
      console.error('Canvas not supported by this browser');
    }

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;

    var arrowHeight = 30;
    var size = canvas.width;

    var outsideRadius = (size-arrowHeight)/2 - 5;
    var insideRadius = 20;

    var cX = size/2;
    var cY = outsideRadius + arrowHeight + 2;

    var i;
    var angle;

    // Slice fill
    for (i = 0; i < numberOfSlices; i++) {
      angle = currentAngle + i * sliceArc;
      ctx.beginPath();
      ctx.arc(cX, cY, outsideRadius, angle, angle + sliceArc, false);
      ctx.arc(cX, cY, insideRadius, angle + sliceArc, angle, true);

      ctx.fillStyle = slices[i].color;
      ctx.fill();
    }

    // Slice outlines
    for (i = 0; i < numberOfSlices; i++) {
      angle = currentAngle + i * sliceArc;
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(cX, cY, outsideRadius, angle, angle + sliceArc, false);
      ctx.arc(cX, cY, insideRadius, angle + sliceArc, angle, true);
      ctx.stroke();
    }

    // Arrow
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(cX - 5, 0);
    ctx.lineTo(cX + 5, 0);
    ctx.lineTo(cX + 5, 20);
    ctx.lineTo(cX + 10, 20);
    ctx.lineTo(cX, 30);
    ctx.lineTo(cX - 10, 20);
    ctx.lineTo(cX - 5, 20);
    ctx.lineTo(cX - 5, 0);
    ctx.fill();

    // Queue draw
    window.requestAnimationFrame(draw);
  };

  var startWheel = function() {
    spinning = true;
    console.log('Starting wheel');
    rotateWheel();
  };

  var rotateWheel = function() {
    if (!spinning) {
      return;
    }

    var inc = 2;
    currentAngle += (inc * Math.PI) / 180;
    if (currentAngle > (2 * Math.PI)) {
      currentAngle -= 2 * Math.PI;
    }

    setTimeout(rotateWheel, 10);
  };

  var stopWheel = function() {
    console.log('Stopping wheel');
    spinning = false;
  };

  $(document).ready(function() {
    var i;

    /* jshint -W117 */
    if (typeof data === 'undefined') {
      console.error('No data found :<');
      //TODO: Write 'no data' to screen
      return;
    }

    console.log('Got data: %o', data);

    for (i = 0; i < data.length; i++) {
      slices.push({
        text: data[i]
      });
    }
    /* jshint +W117 */

    numberOfSlices = slices.length;
    sliceArc = Math.PI * 2 / numberOfSlices;

    var colorSeparation = 360 / numberOfSlices;
    for (i = 0; i < numberOfSlices; i++) {
      slices[i].color = 'hsl(' + i * ( colorSeparation ) + ', 100%, 50%)';
    }

    console.log('Data is now: %o', slices);

    // Queue draw
    window.requestAnimationFrame(draw);
  });

  document.onkeypress = function(e) {
    if (e.keyCode === 32) {
      if (!spinning) {
        startWheel();
      } else {
        stopWheel();
      }
    }
  };

})();